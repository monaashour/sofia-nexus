export interface ExampleProps {
    title: string;
    description?: string;
}

export interface AppState {
    isLoading: boolean;
    error?: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
};

export type ApiResponse<T> = {
    data: T;
    message: string;
    status: number;
};