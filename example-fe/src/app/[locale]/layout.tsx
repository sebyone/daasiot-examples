import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
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

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const theme = {
    components: {
      Form: { verticalLabelPadding: 0 },
    },
  };

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang="it">
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AntdRegistry>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
