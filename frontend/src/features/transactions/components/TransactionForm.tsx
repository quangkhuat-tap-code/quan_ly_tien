import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
    onAdd: (data: { amount: number; note: string }) => Promise<unknown>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            return alert('Vui lòng nhập số tiền hợp lệ!');
        }

        setSubmitting(true);
        try {
            await onAdd({
                amount: Number(amount),
                note: note.trim() || 'Không có ghi chú',
            });
            setAmount('');
            setNote('');
        } catch (err) {
            console.error(err);
            alert('Không thể lưu giao dịch!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Thêm khoản chi</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <label style={{ display: 'block', fontSize: 14, marginBottom: 4, fontWeight: 500 }}>Số tiền (VNĐ):</label>
                    <input
                        type="number"
                        placeholder="VD: 50000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: 14, marginBottom: 4, fontWeight: 500 }}>Ghi chú:</label>
                    <input
                        type="text"
                        placeholder="VD: Ăn sáng, xăng xe..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    <PlusCircle size={20} />
                    {submitting ? 'Đang lưu...' : 'Lưu khoản chi'}
                </button>
            </form>
        </div>
    );
};