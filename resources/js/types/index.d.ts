export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

interface ComponentInstance {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isFocus: boolean;
}

interface position {
    x: number;
    y: number;
}

interface TextComponentInstance {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    text: string;
    isFocus: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
