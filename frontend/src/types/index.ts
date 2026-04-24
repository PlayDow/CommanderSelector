export interface Commander {
    id?: number;
    userId: number;
    name: string;
    scryfallId: string;
    imageUrl: string;
    bracket: number;
}

export interface Play {
    id?: number;
    commanderId: number;
    userId: number;
    playedAt?: string;
}