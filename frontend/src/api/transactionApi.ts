import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api.types';
import type { Transaction, CreateTransactionDTO } from '../types/transaction.types';

export const transactionApi = {
    getAll: (): Promise<ApiResponse<Transaction[]>> => {
        return axiosClient.get('/transactions');
    },
    create: (data: CreateTransactionDTO): Promise<ApiResponse<{ transaction: Transaction; updatedWallet: unknown }>> => {
        return axiosClient.post('/transactions', data);
    },
    delete: (id: number): Promise<ApiResponse<null>> => {
        return axiosClient.delete(`/transactions/${id}`);
    },
};