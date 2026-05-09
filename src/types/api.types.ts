export type ApiResponse<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export type AuthResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};