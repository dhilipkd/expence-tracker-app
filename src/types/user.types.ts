export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    provider?: "email" | "google" | "apple" | "phone" | "microsoft";
};