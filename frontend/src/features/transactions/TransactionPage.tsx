import React from 'react';
import { WalletCard } from '../wallets/components/WalletCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { useTransactions } from './hooks/useTransactions';

export const TransactionPage: React.FC = () => {
    const { wallet, transactions, loading, error, addTransaction, removeTransaction } = useTransactions(1);

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa giao dịch này? Số tiền sẽ được hoàn lại ví.')) {
            removeTransaction(id);
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            <WalletCard wallet={wallet} loading={loading && !wallet} />
            <TransactionForm onAdd={addTransaction} />
            <TransactionList transactions={transactions} onDelete={handleDelete} />
        </div>
    );
};