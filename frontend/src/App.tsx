import { Wallet } from 'lucide-react';
import { TransactionPage } from './features/transactions/TransactionPage';

export default function App() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Wallet size={32} color="#2563eb" />
        <h1 style={{ fontSize: 24 }}>Quản Lý Chi Tiêu</h1>
      </header>

      <main>
        <TransactionPage />
      </main>
    </div>
  );
}