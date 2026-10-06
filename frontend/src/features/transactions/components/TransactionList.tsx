import React from 'react';
import type { Transaction } from '../../../types/transaction.types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
    return (
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Lịch sử chi tiêu ({transactions.length})</h2>

            {transactions.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Chưa có giao dịch nào!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {transactions.map((tx) => (
                        <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};