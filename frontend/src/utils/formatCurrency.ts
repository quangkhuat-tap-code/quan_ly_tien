export const formatCurrency = (amount: number | string): string => {
    return Number(amount).toLocaleString('vi-VN') + ' ₫';
};