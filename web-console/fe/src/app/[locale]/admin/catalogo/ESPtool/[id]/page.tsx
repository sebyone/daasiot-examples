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
import FirmwareUpdaterExplanation from '@/components/FirmwareUpdaterExplanation';
import ConfigService from '@/services/configService';
import { InfoCircleOutlined, SyncOutlined, UsbOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Progress, Select, Space, Typography, Upload, message } from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ESPLoader, Transport } from 'esptool-js';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './ESP.module.css';

const { Title } = Typography;

const DaaSUpdater = () => {
  const t = useTranslations('DaaSUpdater');
  const router = useRouter();
  const locale = useLocale();

  const [device, setDevice] = useState(null);
  const [transport, setTransport] = useState(null);
  const [chip, setChip] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFirmware, setSelectedFirmware] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);
  const [portInfo, setPortInfo] = useState('');
  const params = useParams();
  const id = Number(params.id);
  let esploader;

  const [availableFirmware, setAvailableFirmware] = useState<string | null>(null);

  const fetchFirmwareData = async () => {
    try {
      const response = await ConfigService.getDeviceModelById(id);

      const firmwareResources = response.resources?.find(
        (resource) => resource.resource_type === 5 && resource.name === 'firmware'
      )?.link;
      setAvailableFirmware(firmwareResources);
    } catch (error) {
      console.error('Error fetching firmware:', error);
      message.error('Errore nel caricamento del firmware');
    }
  };

  useEffect(() => {
    if (id) {
      fetchFirmwareData();
    }
  }, [id]);

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
      };
      esploader = new ESPLoader(flashOptions);
      const detectedChip = await esploader.main();
      setChip(detectedChip);
      setIsConnected(true);
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
    message.info('Dispositivo disconnesso');
  };

  const [flashStatus, setFlashStatus] = useState('');

  const uploadFirmware = async () => {
    if (!selectedFirmware) {
      message.warning('Seleziona firmware');
      return;
    }

    try {
      // Gestione disconnessione precedente
      if (transport) {
        console.log('Chiusura porta seriale precedente...');
        await transport.disconnect();
        setTransport(null);
        setDevice(null);
        setIsConnected(false);
      }

      setFlashStatus('downloading');
      const response = await axios.get(selectedFirmware, {
        responseType: 'blob',
      });

      const firmwareData = new Blob([response.data], { type: 'application/octet-stream' });
      const arrayBuffer = await firmwareData.arrayBuffer();

      setFlashStatus('extracting');
      const files = untar(arrayBuffer);
      console.log('Files estratti e filtrati:', files);

      if (files.length !== 3) {
        throw new Error(`File mancanti o non validi!`);
      }

      // Richiedi una nuova porta seriale
      setFlashStatus('connecting');
      if (!device) {
        const port = await navigator.serial.requestPort({});
        setDevice(port);
        const newTransport = new Transport(port);
        setTransport(newTransport);
        console.log('Nuova connessione seriale stabilita');
      }

      const esploader = new ESPLoader({
        transport,
        baudrate: 115200,
      });

      // Inizializzazione ESP
      await esploader.main();
      setIsConnected(true);

      // Prepara i file per il flash
      const flashFiles = files.map((file) => ({
        data: file.data,
        address: file.offset,
      }));

      // Flash di tutti i file in una volta
      const flashOptions = {
        fileArray: flashFiles,
        flashSize: '4MB',
        eraseAll: true,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const progress = (fileIndex * 100) / files.length + (written / total) * (100 / files.length);
          setProgress(Math.round(progress));
        },
        calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      };

      setFlashStatus('flashing');
      console.log('Avvio flash con opzioni:', flashOptions);
      await esploader.writeFlash(flashOptions);

      setUpdateComplete(true);
      message.success('Firmware aggiornato correttamente');
    } catch (e) {
      console.error('Errore durante il flash:', e);
      message.error(`Errore nell'aggiornamento del firmware: ${e.message}`);

      // Cleanup in caso di errore
      if (transport) {
        try {
          await transport.disconnect();
          setTransport(null);
          setDevice(null);
          setIsConnected(false);
        } catch (disconnectError) {
          console.error('Errore durante la disconnessione:', disconnectError);
        }
      }
    } finally {
      setProgress(0);
      setFlashStatus('');
    }
  };

  // Aggiungi una funzione di cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (transport) {
        transport.disconnect().catch(console.error);
      }
    };
  }, [transport]);

  function untar(arrayBuffer) {
    const TAR_BLOCK_SIZE = 512;
    let offset = 0;
    const files = [];

    // Mappa per gli offset standard
    const fileOffsets = {
      'bootloader.bin': 0x1000,
      'partitions.bin': 0x8000,
      'firmware.bin': 0x10000,
    };

    while (offset < arrayBuffer.byteLength) {
      const nameBuffer = arrayBuffer.slice(offset, offset + 100);
      const name = new TextDecoder().decode(nameBuffer).replace(/\0/g, '');
      if (!name) break;

      const sizeBuffer = arrayBuffer.slice(offset + 124, offset + 136);
      const size = parseInt(new TextDecoder().decode(sizeBuffer).trim(), 8);
      if (size === 0) break;

      const content = arrayBuffer.slice(offset + TAR_BLOCK_SIZE, offset + TAR_BLOCK_SIZE + size);

      // Filtra solo i file principali
      if (!name.startsWith('PaxHeader/') && !name.startsWith('._') && !name.startsWith('_')) {
        const baseName = name.split('/').pop(); // Rimuove eventuali percorsi
        if (fileOffsets[baseName] !== undefined) {
          console.log(`Processando file: ${baseName}, dimensione: ${size} bytes`);
          files.push({
            name: baseName,
            data: arrayBufferToBinaryString(content),
            size: size,
            offset: fileOffsets[baseName],
          });
        }
      }

      offset += TAR_BLOCK_SIZE + size;
      if (size % TAR_BLOCK_SIZE !== 0) {
        offset += TAR_BLOCK_SIZE - (size % TAR_BLOCK_SIZE);
      }
    }

    // Ordina i file per offset
    return files.sort((a, b) => a.offset - b.offset);
  }

  const getStatusMessage = () => {
    switch (flashStatus) {
      case 'downloading':
        return 'Download firmware in corso...';
      case 'validating':
        return 'Validazione firmware...';
      case 'flashing':
        return 'Aggiornamento firmware in corso...';
      default:
        return '';
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title
          level={2}
          style={{
            background: 'linear-gradient(to right, #0077e6, #003366, #001529)',
            backgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold',
          }}
        >
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
                  disabled={!availableFirmware}
                >
                  {availableFirmware && <Select.Option value={availableFirmware}>Firmware disponibile</Select.Option>}
                </Select>
                <Button onClick={uploadFirmware} type="primary" icon={<SyncOutlined />} style={{ flex: 1 }}>
                  Start Update
                </Button>
              </div>
            </Space>
          )}
        </div>

        <div className={styles.terminal}>
          {!updateComplete && <FirmwareUpdaterExplanation />}

          {flashStatus && <Alert message={getStatusMessage()} type="info" showIcon style={{ marginBottom: '1rem' }} />}

          {progress > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <Progress percent={Math.round(progress)} />
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
