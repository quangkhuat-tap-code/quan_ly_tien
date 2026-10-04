import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Đọc cấu hình từ file .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware cho phép đọc JSON và gọi API chéo từ Web/Mobile
app.use(cors());
app.use(express.json());

// ==========================================
// 1. Route kiểm tra server còn sống (Health check)
// ==========================================
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Server Quan Ly Tien dang chay on dinh!' });
});

// ==========================================
// 2. Route test kết nối Database
// ==========================================
app.get('/api/test-db', async (req: Request, res: Response) => {
    try {
        const wallets = await prisma.wallets.findMany();
        res.json({
            success: true,
            message: 'Ket noi MySQL qua Prisma thanh cong!',
            data: wallets,
        });
    } catch (error) {
        console.error('Loi ket noi database:', error);
        res.status(500).json({ success: false, message: 'Loi ket noi Database' });
    }
});

// ==========================================
// 3. Route tạo dữ liệu mẫu (User, Ví, Danh mục)
// ==========================================
app.post('/api/seed', async (req: Request, res: Response) => {
    try {
        // 1. Tạo hoặc lấy User mẫu
        const user = await prisma.users.upsert({
            where: { email: 'test@gmail.com' },
            update: {},
            create: {
                email: 'test@gmail.com',
                password: 'password123',
                name: 'Người dùng Test',
            },
        });

        // 2. Tạo ví Tiền mặt (nếu chưa có)
        let wallet = await prisma.wallets.findFirst({ where: { userId: user.id } });
        if (!wallet) {
            wallet = await prisma.wallets.create({
                data: {
                    name: 'Tiền mặt',
                    balance: 500000,
                    userId: user.id,
                },
            });
        }

        // 3. Tạo danh mục Ăn uống (Chi tiêu)
        let category = await prisma.categories.findFirst({
            where: { userId: user.id, name: 'Ăn uống' },
        });
        if (!category) {
            category = await prisma.categories.create({
                data: {
                    name: 'Ăn uống',
                    type: 'EXPENSE',
                    userId: user.id,
                },
            });
        }

        res.json({
            success: true,
            message: 'Đã tạo xong dữ liệu mẫu!',
            data: { user, wallet, category },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo dữ liệu mẫu' });
    }
});

// ==========================================
// 4. Route Thêm giao dịch & Cập nhật số dư ví
// ==========================================
app.post('/api/transactions', async (req: Request, res: Response) => {
    try {
        const { amount, note, userId, walletId, categoryId } = req.body;

        if (!amount || !userId || !walletId || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc (amount, userId, walletId, categoryId)',
            });
        }

        // Tìm danh mục để kiểm tra đây là Thu hay Chi
        const category = await prisma.categories.findUnique({
            where: { id: Number(categoryId) },
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
        }

        // Sử dụng Transaction của Prisma: Tạo bản ghi chi tiêu VÀ cập nhật tiền trong ví cùng lúc
        const result = await prisma.$transaction(async (tx) => {
            // 1. Thêm bản ghi giao dịch
            const transaction = await tx.transactions.create({
                data: {
                    amount: Number(amount),
                    note,
                    userId: Number(userId),
                    walletId: Number(walletId),
                    categoryId: Number(categoryId),
                },
            });

            // 2. Tính toán trừ hoặc cộng tiền ví
            const balanceChange =
                category.type === 'EXPENSE' ? -Number(amount) : Number(amount);

            const updatedWallet = await tx.wallets.update({
                where: { id: Number(walletId) },
                data: {
                    balance: {
                        increment: balanceChange, // Prisma hỗ trợ hàm tự cộng/trừ số dư
                    },
                },
            });

            return { transaction, updatedWallet };
        });

        res.status(201).json({
            success: true,
            message: 'Ghi nhận giao dịch thành công!',
            data: result,
        });
    } catch (error) {
        console.error('Lỗi lưu giao dịch:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lưu giao dịch' });
    }
});

// ==========================================
// 5. Route Lấy toàn bộ danh sách giao dịch
// ==========================================
app.get('/api/transactions', async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transactions.findMany({
            include: {
                category: true,
                wallet: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách giao dịch' });
    }
});

// Khởi chạy server lắng nghe kết nối
app.listen(PORT, () => {
    console.log(` Server dang chay tai: http://localhost:${PORT}`);
});

// ==========================================
// 6. Route Lấy thông tin ví (xem số dư hiện tại)
// ==========================================
app.get('/api/wallets/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wallet = await prisma.wallets.findUnique({
            where: { id: Number(id) },
        });

        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Ví không tồn tại' });
        }

        res.json({ success: true, data: wallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin ví' });
    }
});

// ==========================================
// 7. Route Xóa giao dịch & Hoàn lại tiền vào ví
// ==========================================
app.delete('/api/transactions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Tìm giao dịch cần xóa xem nó là Thu hay Chi
        const transaction = await prisma.transactions.findUnique({
            where: { id: Number(id) },
            include: { category: true },
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Giao dịch không tồn tại' });
        }

        // Hoàn lại tiền: nếu trước đó chi tiền (EXPENSE) thì xóa đi phải CỘNG LẠI tiền cho ví
        const refundAmount =
            transaction.category.type === 'EXPENSE'
                ? Number(transaction.amount)
                : -Number(transaction.amount);

        await prisma.$transaction([
            prisma.wallets.update({
                where: { id: transaction.walletId },
                data: { balance: { increment: refundAmount } },
            }),
            prisma.transactions.delete({
                where: { id: Number(id) },
            }),
        ]);

        res.json({ success: true, message: 'Đã xóa giao dịch và hoàn số dư ví!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa giao dịch' });
    }
});