import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api.types';
import type { Wallet } from '../types/wallet.types';

export const walletApi = {
    getById: (id: number): Promise<ApiResponse<Wallet>> => {
        return axiosClient.get(`/wallets/${id}`);
    },
};