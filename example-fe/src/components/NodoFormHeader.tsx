import { Device, NodoFormProps } from '@/types';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const NodoFormHeader = ({ form, onFinish, setIsDataSaved, readOnly }: NodoFormProps) => {
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
        marginTop: '20px',
        marginLeft: 10,
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
        <Row gutter={24} style={marginBottom}>
          <Col span={12}>
            <Form.Item label={t('model')} name="modello">
              {readOnly ? (
                <Input name="modello" placeholder={t('model')} readOnly={readOnly} style={cursor} />
              ) : (
                <Select />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="matricola" label={t('serialNumber')}>
              <Input name="matricola" placeholder={t('serialNumber')} readOnly={readOnly} style={cursor} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoFormHeader;
