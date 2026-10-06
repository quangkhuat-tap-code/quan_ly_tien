import { useState, useEffect, useCallback } from 'react';
import { transactionApi } from '../../../api/transactionApi';
import { walletApi } from '../../../api/walletApi';
import type { Transaction, CreateTransactionDTO } from '../../../types/transaction.types';
import type { Wallet } from '../../../types/wallet.types';

export const useTransactions = (walletId: number = 1) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [txRes, walletRes] = await Promise.all([
                transactionApi.getAll(),
                walletApi.getById(walletId),
            ]);

            if (txRes.success && txRes.data) {
                setTransactions(txRes.data);
            }
            if (walletRes.success && walletRes.data) {
                setWallet(walletRes.data);
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj.message || 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [walletId]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addTransaction = async (data: Omit<CreateTransactionDTO, 'userId' | 'walletId' | 'categoryId'>) => {
        const res = await transactionApi.create({
            ...data,
            userId: 1,
            walletId,
            categoryId: 1,
        });
        if (res.success) {
            await refreshData();
        }
        return res;
    };

    const removeTransaction = async (id: number) => {
        const res = await transactionApi.delete(id);
        if (res.success) {
            await refreshData();
        }
        return res;
    };

    return {
        transactions,
        wallet,
        loading,
        error,
        refreshData,
        addTransaction,
        removeTransaction,
    };
};