export interface Wallet {
    id: number;
    name: string;
    balance: number | string;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}