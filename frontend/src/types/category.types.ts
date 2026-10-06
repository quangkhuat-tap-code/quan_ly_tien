export type CategoryType = 'EXPENSE' | 'INCOME';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
    userId: number;
}