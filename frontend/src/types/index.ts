export interface Commander {
    id?: number;
    userId: number;
    name: string;
    scryfallId: string;
    imageUrl: string;
    bracket: string;
    isActive?: boolean;
}

export interface Play {
    id?: number;
    commanderId: number;
    userId: number;
    playedAt?: string;
    result?: string;
    isVoided?: boolean;
}

export interface Tag {
    id: number;
    name: string;
}

export interface UserSummary {
    id: number;
    userName: string;
    isAdmin: boolean;
    tags: Tag[];
}
