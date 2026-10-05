import { useEffect, useState } from 'react';
import axios from 'axios';
import { Wallet, ArrowDownCircle, ArrowUpCircle, PlusCircle, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  amount: number | string;
  note: string | null;
  createdAt: string;
  category: {
    id: number;
    name: string;
    type: string;
  };
  wallet: {
    id: number;
    name: string;
  };
}

interface WalletData {
  id: number;
  name: string;
  balance: number | string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:5000/api';
  // 1. Lấy thông tin ví
  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/wallets/1`);
      if (res.data.success) {
        setWallet(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi lấy thông tin ví:', error);
    }
  };

  // 2. Lấy danh sách giao dịch
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions`);
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách giao dịch:', error);
    }
  };

  // Tải cả ví và giao dịch khi mở trang
  const refreshData = () => {
    fetchWallet();
    fetchTransactions();
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 3. Thêm khoản chi mới
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return alert('Vui lòng nhập số tiền!');

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/transactions`, {
        amount: Number(amount),
        note: note || 'Không có ghi chú',
        userId: 1,
        walletId: 1,
        categoryId: 1,
      });

      setAmount('');
      setNote('');
      refreshData();
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
      alert('Không thể thêm giao dịch!');
    } finally {
      setLoading(false);
    }
  };

  // 4. Xóa giao dịch
  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này? Số tiền sẽ được hoàn lại ví.')) return;

    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      refreshData();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Lỗi xóa giao dịch!');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Wallet size={32} color="#2563eb" />
        <h1 style={{ fontSize: 24 }}>Quản Lý Chi Tiêu</h1>
      </header>

      {/* THẺ HIỂN THỊ SỐ DƯ VÍ */}
      {wallet && (
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
            {Number(wallet.balance).toLocaleString('vi-VN')} đ
          </div>
        </div>
      )}

      {/* FORM NHẬP KHOẢN CHI MỚI */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Thêm khoản chi</h2>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
              placeholder="VD: Tiền gửi xe, cafe..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
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
            {loading ? 'Đang lưu...' : 'Lưu khoản chi'}
          </button>
        </form>
      </div>

      {/* DANH SÁCH CÁC GIAO DỊCH */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Lịch sử chi tiêu ({transactions.length})</h2>

        {transactions.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Chưa có giao dịch nào!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.map((item) => {
              const isExpense = item.category?.type === 'EXPENSE';
              return (
                <div
                  key={item.id}
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
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{item.note || item.category?.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {item.wallet?.name} • {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: isExpense ? '#dc2626' : '#16a34a' }}>
                      {isExpense ? '-' : '+'}
                      {Number(item.amount).toLocaleString('vi-VN')} đ
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        padding: 4,
                      }}
                      title="Xóa giao dịch"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}