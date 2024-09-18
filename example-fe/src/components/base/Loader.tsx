'use client';

import { Flex, Space, Spin } from 'antd';

const Loader = () => (
  <Flex
    align="center"
    gap="middle"
    justify="center"
    style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#FFFFFF', zIndex: 1000 }}
  >
    <Space align="center">
      <Spin size="large" />
    </Space>
  </Flex>
);

export default Loader;
