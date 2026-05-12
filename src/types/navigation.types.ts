import { Category } from "./category.types";
import { Transaction } from "./transaction.types";

export type RootStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    LoginOptions: undefined;
    MainTabs: undefined;
    Settings: undefined;
    Themes: undefined;
    Reports: undefined;
    CustomCategory: undefined;
    Transactions: undefined;
    TransactionDetails: {
        transaction: Transaction;
    };
    CreateTransaction:
    | undefined
    | {
        editData?: Transaction;
    };
    CreateCategory:
    | undefined
    | {
        category?: Category;
    };

    DeleteCategory: {
        categoryId: string;
    };
};