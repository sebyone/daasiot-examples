import { Device, NodoFormProps } from '@/types';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const NodoFormGenerali = ({ form, onFinish, setIsDataSaved, readOnly }: NodoFormProps) => {
  const marginBottom = { marginBottom: -22 };
  const cursor = readOnly ? { cursor: 'default' } : undefined;
  const t = useTranslations('NodoForm');
  const style = {
    minWidth: '550px',
    width: '100%',
    maxWidth: '680px',
    marginTop: -50,
    transform: 'scale(0.9)',
    marginLeft: -30,
  };
  const handleFinish = (values: Device) => {
    onFinish(values);
    setIsDataSaved(true);
  };

  //const [maps, setMaps] = useState<DinDataType[]>([]);

  /*useEffect(() => {
    ConfigService
      .getMaps()
      .then((data) => setMaps(data))
      .catch((error) => console.error('Errore nel caricamento dei maps:', error));
  }, []);*/

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  return (
    <div
      style={{
        minWidth: '250px',
        width: '100%',
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'left',
        marginTop: '25px',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        style={style}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="sid" label="SID">
              <Input name="sid" placeholder="SID" readOnly={readOnly} style={cursor} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="din" label="DIN">
              <Input name="din" placeholder="DIN" readOnly={readOnly} style={cursor} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="latitudine" label={t('latitude')}>
              <Input name="latitudine" placeholder={t('latitude')} readOnly={readOnly} style={cursor} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="longitudine" label={t('longitude')}>
              <Input name="longitudine" placeholder={t('longitude')} readOnly={readOnly} style={cursor} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox style={{ marginTop: 26 }} disabled={readOnly}>
                {t('enabled')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoFormGenerali;
