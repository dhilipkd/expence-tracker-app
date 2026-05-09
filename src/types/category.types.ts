export type Category = {
    id: string;
    title: string;
    icon: string;
    color: string;
    type: "expense" | "income";
    isDefault: boolean;
    createdAt?: any;
    updatedAt?: any;
};

export type CreateCategoryPayload = {
    title: string;
    icon: string;
    color: string;
    type: "expense" | "income";
};

export type UpdateCategoryPayload = {
    id: string;
    title: string;
    icon: string;
    color: string;
};