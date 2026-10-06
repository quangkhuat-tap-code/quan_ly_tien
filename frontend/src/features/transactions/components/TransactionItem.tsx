import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import type { Transaction } from '../../../types/transaction.types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface TransactionItemProps {
    transaction: Transaction;
    onDelete: (id: number) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
    const isExpense = transaction.category?.type === 'EXPENSE';

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: 8,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isExpense ? (
                    <ArrowDownCircle color="#dc2626" size={28} />
                ) : (
                    <ArrowUpCircle color="#16a34a" size={28} />
                )}
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{transaction.note || transaction.category?.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {transaction.wallet?.name} • {new Date(transaction.createdAt).toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: isExpense ? '#dc2626' : '#16a34a' }}>
                    {isExpense ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                </span>
                <button
                    onClick={() => onDelete(transaction.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}
                    title="Xóa giao dịch"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};