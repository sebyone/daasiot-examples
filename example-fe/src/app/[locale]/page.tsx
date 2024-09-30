import ClientRedirect from '@/components/ClientRedirect';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <ClientRedirect />
    </main>
  );
}
