'use client';
import { UploadOutlined, UsbOutlined } from '@ant-design/icons';
import { Button, Progress, Typography, Upload, message } from 'antd';
import CryptoJS from 'crypto-js';
import { ESPLoader, Transport } from 'esptool-js';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { XTerm } from 'react-xtermjs';

const { Title } = Typography;

/*const Terminal = dynamic(() => import('react-xtermjs').then((mod) => mod.XTerm), {
  ssr: false,
  loading: () => <p>Caricamento terminale...</p>,
});*/

const DaaSUpdater = () => {
  const [device, setDevice] = useState(null);
  const [transport, setTransport] = useState(null);
  const [chip, setChip] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    const loadPolyfill = async () => {
      if (!navigator.serial && navigator.usb) {
        const serialPolyfill = await import('web-serial-polyfill');
        navigator.serial = serialPolyfill.default;
      }
    };
    loadPolyfill();
  }, []);

  const espLoaderTerminal = {
    clean() {
      if (terminalRef.current?.terminal) {
        terminalRef.current.terminal.clear();
      }
    },
    writeLine(data) {
      if (terminalRef.current?.terminal) {
        terminalRef.current.terminal.writeln(data);
      }
    },
    write(data) {
      if (terminalRef.current?.terminal) {
        terminalRef.current.terminal.write(data);
      }
    },
  };

  const connectDevice = async () => {
    try {
      const port = await navigator.serial.requestPort({});
      const newTransport = new Transport(port, true);
      setDevice(port);
      setTransport(newTransport);

      const flashOptions = {
        transport: newTransport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      };
      const esploader = new ESPLoader(flashOptions);
      const detectedChip = await esploader.main();
      setChip(detectedChip);
      setIsConnected(true);
      message.success(`Connected to device: ${detectedChip}`);
    } catch (e) {
      console.error(e);
      message.error(`Error: ${e.message}`);
    }
  };

  const disconnectDevice = async () => {
    if (transport) {
      await transport.disconnect();
    }
    setDevice(null);
    setTransport(null);
    setChip(null);
    setIsConnected(false);
    espLoaderTerminal.clean();
    message.info('Disconnected from device');
  };

  const uploadFirmware = async (info) => {
    const { file } = info;
    if (!file || !isConnected) {
      message.warning('No file selected or device not connected');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileArray = untar(arrayBuffer);

      const flashOptions = {
        fileArray: fileArray,
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const newProgress = fileIndex * 25 + (written / total) * 25;
          setProgress(newProgress);
        },
        calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      };

      const esploader = new ESPLoader({
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      });

      await esploader.writeFlash(flashOptions);
      message.success('Firmware uploaded successfully');
    } catch (e) {
      console.error(e);
      message.error(`Error: ${e.message}`);
    } finally {
      setProgress(0);
    }
  };

  function arrayBufferToBinaryString(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return binaryString;
  }

  function untar(arrayBuffer) {
    const TAR_BLOCK_SIZE = 512;
    let offset = 0;
    const files = [];

    const offsets = [0x10000, 0x8000, 0x1000];

    let index = 0;

    while (offset < arrayBuffer.byteLength) {
      const name = new TextDecoder().decode(arrayBuffer.slice(offset, offset + 100)).replace(/\0/g, '');
      if (!name) break;

      const size = parseInt(new TextDecoder().decode(arrayBuffer.slice(offset + 124, offset + 136)).trim(), 8);
      const content = arrayBuffer.slice(offset + TAR_BLOCK_SIZE, offset + TAR_BLOCK_SIZE + size);

      console.log(name, size, content);

      files.push({ name: name, data: arrayBufferToBinaryString(content), address: offsets[index++] });

      offset += TAR_BLOCK_SIZE + size;
      if (size % TAR_BLOCK_SIZE !== 0) {
        offset += TAR_BLOCK_SIZE - (size % TAR_BLOCK_SIZE);
      }
    }

    return files;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>DaaS Updater for ESP32</Title>
      <Button
        icon={<UsbOutlined />}
        onClick={isConnected ? disconnectDevice : connectDevice}
        type="primary"
        style={{ marginBottom: '20px' }}
      >
        {isConnected ? 'Disconnetti dispositivo' : 'Connetti dispositivo'}
      </Button>
      <XTerm
        ref={terminalRef}
        options={{ cursorBlink: true }}
        style={{ width: '100%', height: '300px', marginBottom: '20px' }}
      />

      {isConnected && (
        <>
          <Upload accept=".bin,.tar,.dsfw" beforeUpload={() => false} onChange={uploadFirmware}>
            <Button type="primary" icon={<UploadOutlined />}>
              Seleziona firmware
            </Button>
          </Upload>
          <Progress percent={progress} style={{ marginTop: '20px' }} />
        </>
      )}
    </div>
  );
};

export default DaaSUpdater;
