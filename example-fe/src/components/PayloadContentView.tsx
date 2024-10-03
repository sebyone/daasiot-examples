import { Checkbox, Input } from 'antd';
import React, { useEffect, useState } from 'react';

const PayloadContentView = ({ payloadContent }: { payloadContent: string }) => {
  const [payloadFormat, setPayloadFormat] = useState('BASE64');
  const [convertedContent, setConvertedContent] = useState('');

  const convertPayload = (format) => {
    let content = payloadContent || '';

    switch (format) {
      case 'ASCII':
        setConvertedContent(atob(content));
        break;
      case 'Binary':
        setConvertedContent(
          atob(content)
            .split('')
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ')
        );
        break;
      case 'HEX':
        setConvertedContent(
          atob(content)
            .split('')
            .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(' ')
        );
        break;
      case 'BASE64':
        setConvertedContent(content);
        break;
      default:
        setConvertedContent(content);
    }
  };

  const handleCheckboxChange = (e) => {
    const selectedFormat = e.target.value;
    setPayloadFormat(selectedFormat);
    convertPayload(selectedFormat);
  };

  useEffect(() => {
    convertPayload(payloadFormat);
  }, [payloadContent, payloadFormat]);

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Checkbox value="ASCII" checked={payloadFormat === 'ASCII'} onChange={handleCheckboxChange}>
          ASCII
        </Checkbox>
        <Checkbox value="Binary" checked={payloadFormat === 'Binary'} onChange={handleCheckboxChange}>
          Binary
        </Checkbox>
        <Checkbox value="HEX" checked={payloadFormat === 'HEX'} onChange={handleCheckboxChange}>
          HEX
        </Checkbox>
        <Checkbox value="BASE64" checked={payloadFormat === 'BASE64'} onChange={handleCheckboxChange}>
          BASE64
        </Checkbox>
      </div>
      <Input.TextArea
        value={convertedContent}
        rows={5}
        readOnly
        style={{ width: '100%', resize: 'none', border: '2px solid black', borderRadius: '10px', cursor: 'default' }}
      />
    </>
  );
};

export default PayloadContentView;
