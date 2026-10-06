import React from 'react';
import type { Wallet } from '../../../types/wallet.types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface WalletCardProps {
    wallet: Wallet | null;
    loading?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, loading }) => {
    if (loading) {
        return <div style={{ padding: 20, textAlign: 'center' }}>Đang tải số dư...</div>;
    }

    if (!wallet) return null;

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                padding: '20px 24px',
                borderRadius: 16,
                marginBottom: 24,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
        >
            <div style={{ fontSize: 14, opacity: 0.9 }}>Ví: {wallet.name}</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>
                {formatCurrency(wallet.balance)}
            </div>
        </div>
    );
};