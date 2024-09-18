import ElementiService from '@/services/elementiService';
import { DispositiviDataType, DispositivoFormData, DispositivoFormProps, ElementiDataType } from '@/types';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

const DispositivoForm = ({ form, onFinish, setIsDataSaved }: DispositivoFormProps) => {
  const marginBottom = { marginBottom: -8 };
  const cursorDefault = { cursor: 'default' };
  const style = { minWidth: '550px', width: '100%', maxWidth: '680px', marginTop: -30, transform: 'scale(0.90)' };
  const [elementi, setElementi] = useState<ElementiDataType[]>([]);
  const [isMatricolaEqualsDenominazione, setIsMatricolaEqualsDenominazione] = useState(false);

  useEffect(() => {
    ElementiService.getAll()
      .then((data) => setElementi(data))
      .catch((error) => console.error('Errore nel caricamento degli elementi:', error));
  }, []);

  const handleFinish = (values: DispositivoFormData) => {
    onFinish(values);
    setIsDataSaved(true);
  };

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  const handleMatricolaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMatricolaEqualsDenominazione) {
      form.setFieldsValue({ denominazione: e.target.value });
    }
  };

  const handleCheckboxChange = (e: { target: { checked: boolean } }) => {
    setIsMatricolaEqualsDenominazione(e.target.checked);
    if (e.target.checked) {
      const matricola = form.getFieldValue('matricola');
      form.setFieldsValue({ denominazione: matricola });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      style={style}
    >
      <Row gutter={32} style={marginBottom}>
        <Col span={19}>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="elementi" label="Elemento">
            <Select placeholder="Seleziona un elemento">
              {elementi.length > 0 ? (
                elementi.map((elemento) => (
                  <Select.Option key={elemento.id} value={elemento.id}>
                    {elemento.denominazione}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Nessun elemento disponibile
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="ID Elemento">
            <Form.Item noStyle name="elementi">
              <Input readOnly style={cursorDefault} />
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="matricola"
        label="Matricola"
        rules={[{ required: true, message: 'Inserisci matricola!' }]}
        validateTrigger="onBlur"
      >
        <Input name="matricola" placeholder="Matricola" onChange={handleMatricolaChange} />
      </Form.Item>
      <Form.Item name="modello" label="Modello">
        <Input name="modello" placeholder="Modello" readOnly style={cursorDefault} />
      </Form.Item>

      <Form.Item
        name="denominazione"
        label="Denominazione"
        rules={[{ required: true, message: 'Inserisci denominazione!' }]}
        validateTrigger="onBlur"
      >
        <Input name="denominazione" placeholder="Denominazione" disabled={isMatricolaEqualsDenominazione} />
      </Form.Item>
      <Form.Item>
        <Checkbox onChange={handleCheckboxChange}>La denominazione coincide con la matricola</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default DispositivoForm;
