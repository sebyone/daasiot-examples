import {
  CheckCircleOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  SyncOutlined,
  UsbOutlined,
} from '@ant-design/icons';
import { Card, Space, Steps, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

export default function FirmwareUpdaterExplanation() {
  return (
    <Card style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography>
          <Title level={2}>{"Come funziona l'aggiornamento del firmware"}</Title>
          <Paragraph>Una guida passo-passo al processo di aggiornamento del firmware del dispositivo</Paragraph>
        </Typography>

        <Steps direction="vertical" current={-1}>
          <Step
            title="Connessione del dispositivo"
            description="Collega il tuo dispositivo ESP32 al computer tramite USB."
            icon={<UsbOutlined />}
          />
          <Step
            title="Selezione del firmware"
            description="Scegli il firmware appropriato per il tuo dispositivo dall'elenco disponibile."
            icon={<OrderedListOutlined />}
          />
          <Step
            title="Avvio dell'aggiornamento"
            description="Clicca su 'Start Update' per iniziare il processo di aggiornamento del firmware."
            icon={<PlayCircleOutlined />}
          />
          <Step
            title="Processo di aggiornamento"
            description="Il firmware viene caricato sul dispositivo. Una barra di avanzamento mostra lo stato dell'aggiornamento."
            icon={<SyncOutlined />}
          />
          <Step
            title="Completamento"
            description="Una volta completato l'aggiornamento, riceverai un messaggio di conferma. Riavvia il dispositivo per applicare le modifiche."
            icon={<CheckCircleOutlined />}
          />
        </Steps>
      </Space>
    </Card>
  );
}
