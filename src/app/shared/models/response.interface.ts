export interface AppResponse<T> {
    dados: T;
    mensagem: string;
    sucesso: boolean;
}

export interface Paginacao<T> {
    items: T[];
    total: number;
    skip: number;
    take: number;
}