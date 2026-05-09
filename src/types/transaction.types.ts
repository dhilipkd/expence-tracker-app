export type TransactionType = "expense" | "income";

export type PaymentMethod = "cash" | "upi" | "card" | "bank";

export type PaymentStatus = "paid" | "pending";

export type Transaction = {
    id?: string;
    userId: string;

    title: string;

    type: TransactionType;
    amount: number;

    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;

    note?: string;
    date: Date;

    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;

    attachment?: {
        url: string;
        name: string;
        type: string;
    };

    createdAt?: any;
    updatedAt?: any;
};