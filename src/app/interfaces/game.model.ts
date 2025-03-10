export interface Game {
    id: string;
    title: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    storeUrl?: string;
    description?: string;
    assets?: GameAssets;
    steamAppId?: string;
}

export interface GameAssets {
    banner145?: string;
    banner300?: string;
    banner400?: string;
    banner600?: string;
    boxart?: string;
}

export interface ApiResponse<T> {
    data: T[];
    list?: T[];
    meta?: {
        total?: number;
        offset?: number;
        limit?: number;
    };
    hasMore?: boolean;
    nextOffset?: number;
}

export interface DealResponse {
    plain: string;
    title: string;
    assets?: GameAssets;
    deal: {
        price: {
            amount: number;
            amountInt: number;
            currency: string;
        };
        regular: {
            amount: number;
            amountInt: number;
            currency: string;
        };
        cut: number;
    };
    url: string;
    shop: {
        id: number;
        name: string;
    };
}