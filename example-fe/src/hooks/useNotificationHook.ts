import { notification } from 'antd';

export const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: 'success' | 'info' | 'warning' | 'error', message: string, description: string) => {
    api[type]({
      message,
      description,
    });
  };

  return { notify, contextHolder };
};
