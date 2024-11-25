/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: page.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
'use client';
import { InfoCircleOutlined, SyncOutlined, UploadOutlined, UsbOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Divider, Progress, Select, Space, Typography, Upload, message } from 'antd';
import CryptoJS from 'crypto-js';
import { ESPLoader, Transport } from 'esptool-js';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
//import { ITerminalOptions, Terminal } from 'xterm';
import FirmwareUpdaterExplanation from '@/components/FirmwareUpdaterExplanation';
import { useTranslations } from 'next-intl';
import Terminal from 'react-console-emulator';
import styles from './Updater.module.css';

const { Title } = Typography;

/*interface XTermProps {
  options?: ITerminalOptions;
  style?: React.CSSProperties;
}*/

const DaaSUpdater = () => {
  const t = useTranslations('DaaSUpdater');
  const XTerm = dynamic(() => import('react-xtermjs').then((mod) => mod.XTerm), {
    ssr: false,
    loading: () => <p>Caricamento terminale...</p>,
  });
  const [device, setDevice] = useState(null);
  const [transport, setTransport] = useState(null);
  const [chip, setChip] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFirmware, setSelectedFirmware] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);
  const [portInfo, setPortInfo] = useState('');
  const [terminalLineData, setTerminalLineData] = useState([
    { type: 'input', value: 'Device Firmware Updater Terminal' },
  ]);

  const FakeTerminal = () => (
    <div
      style={{
        width: '50%',
        height: '300px',
        backgroundColor: '#000',
        color: '#00ff00',
        fontFamily: 'monospace',
        padding: '10px',
        overflowY: 'auto',
        marginBottom: '20px',
      }}
    ></div>
  );
  //const [terminal, setTerminal] = useState<Terminal | null>(null);
  //const xtermRef = useRef<{ terminal: Terminal } | null>(null);

  /*useEffect(() => {
    if (xtermRef.current && xtermRef.current.terminal) {
      setTerminal(xtermRef.current.terminal);
      return () => {
        if (xtermRef.current && xtermRef.current.terminal) {
          xtermRef.current.terminal.dispose();
        }
      };
    }
  }, []);

  const espLoaderTerminal = {
    clean() {
      if (terminal) {
        terminal.clear();
      }
    },
    writeLine(data: string) {
      if (terminal) {
        terminal.writeln(data);
      }
    },
    write(data: string) {
      if (terminal) {
        terminal.write(data);
      }
    },
  };*/

  useEffect(() => {
    const loadPolyfill = async () => {
      if (!navigator.serial && navigator.usb) {
        const serialPolyfill = await import('web-serial-polyfill');
        navigator.serial = serialPolyfill.default;
      }
    };
    loadPolyfill();
  }, []);

  const connectDevice = async () => {
    try {
      const port = await navigator.serial.requestPort({});
      const newTransport = new Transport(port, true);
      setDevice(port);
      setTransport(newTransport);

      setPortInfo(port.getInfo().usbProductId ? `USB (Product ID: ${port.getInfo().usbProductId})` : 'Serial Port');

      const flashOptions = {
        transport: newTransport,
        baudrate: 115200,
        //terminal: espLoaderTerminal,
      };
      const esploader = new ESPLoader(flashOptions);
      const detectedChip = await esploader.main();
      setChip(detectedChip);
      setIsConnected(true);
      //espLoaderTerminal.writeLine(`Connected to device: ${detectedChip}`);
      message.success(`Connesso al dispositivo: ${detectedChip}`);
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
    //espLoaderTerminal.clean();
    message.info('Dispositivo disconnesso');
  };

  const uploadFirmware = async () => {
    if (!isConnected || !selectedFirmware) {
      //espLoaderTerminal.writeLine('Please select firmware');
      message.warning('Seleziona firmware');
      return;
    }
    try {
      const firmwareData = null; //await fetchFirmwareData(selectedFirmware);
      if (!firmwareData) {
        throw new Error('Failed to fetch firmware data');
      }

      const arrayBuffer = await firmwareData.arrayBuffer();
      const fileArray = untar(arrayBuffer);

      const flashOptions = {
        fileArray: fileArray,
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const newProgress = fileIndex * 25 + (written / total) * 25;
          setProgress(newProgress);
          //espLoaderTerminal.writeLine(`Update progress: ${Math.round(newProgress)}%`);
        },
        calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      };

      const esploader = new ESPLoader({
        transport,
        baudrate: 115200,
        //terminal: espLoaderTerminal,
      });

      //espLoaderTerminal.writeLine('Starting firmware update...');
      await esploader.writeFlash(flashOptions);
      setUpdateComplete(true);
      //espLoaderTerminal.writeLine('Firmware update completed successfully!');
      message.success('Firmware aggiornato correttamente');
    } catch (e) {
      console.error(e);
      //espLoaderTerminal.writeLine(`Error: ${e.message}`);
      message.error(`Errore nell'aggiornamento del firmware: ${e.message}`);
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
    <div className={styles.container}>
      <div className={styles.title}>
        <Title level={2} style={{ fontWeight: 'bold' }}>
          Devices Firmware Updater (Esp32)
        </Title>
      </div>

      <div className={styles.content}>
        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <Button
            icon={<UsbOutlined />}
            onClick={isConnected ? disconnectDevice : connectDevice}
            type="primary"
            style={{ marginBottom: '20px', width: '100%' }}
          >
            {isConnected ? 'Disconnetti dispositivo' : 'Connetti dispositivo'}
          </Button>

          {isConnected && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item
                  label={
                    <>
                      <UsbOutlined /> Port
                    </>
                  }
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  {portInfo}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <InfoCircleOutlined /> Device
                    </>
                  }
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  {chip || 'Unknown'}
                </Descriptions.Item>
              </Descriptions>

              <div className={styles.selectGroup}>
                <Select
                  style={{ flex: 1 }}
                  placeholder="Seleziona Firmware"
                  onChange={(value) => setSelectedFirmware(value)}
                  value={selectedFirmware}
                >
                  <Select.Option value="firmware1">Firmware 1</Select.Option>
                  <Select.Option value="firmware2">Firmware 2</Select.Option>
                </Select>

                <Button onClick={uploadFirmware} type="primary" icon={<SyncOutlined />} style={{ flex: 1 }}>
                  Start Update
                </Button>
              </div>
            </Space>
          )}
        </div>

        {/* Terminal Section */}
        <div className={styles.terminal}>
          {!updateComplete && <FirmwareUpdaterExplanation />}

          {progress > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <Progress percent={progress} />
            </div>
          )}

          {updateComplete && (
            <Alert
              message="Aggiornamento completato!"
              description="Scollegare il dispositivo e riavviarlo!"
              type="success"
              showIcon
              style={{ marginTop: '1rem' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DaaSUpdater;
