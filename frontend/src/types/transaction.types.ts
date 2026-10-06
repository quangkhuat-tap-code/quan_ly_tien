import type { Category } from './category.types';
import type { Wallet } from './wallet.types';

export interface Transaction {
    id: number;
    amount: number | string;
    note: string | null;
    createdAt: string;
    userId: number;
    walletId: number;
    categoryId: number;
    category?: Category;
    wallet?: Wallet;
}

export interface CreateTransactionDTO {
    amount: number;
    note?: string;
    userId: number;
    walletId: number;
    categoryId: number;
}