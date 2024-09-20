//import '@/utils/i18n/i18n';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, theme } from 'antd';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const config: ThemeConfig = {
  // Use dark algorithm
  // algorithm: theme.darkAlgorithm,
  // token: {
  //   colorPrimary: '#1890ff',
  // },
};

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DaaS-NodeJS - Sebyone',
  description: 'DaaS-NodeJS app by Sebyone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = {
    components: {
      Form: { verticalLabelPadding: 0 },
    },
  };

  return (
    <html lang="it">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AntdRegistry>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
