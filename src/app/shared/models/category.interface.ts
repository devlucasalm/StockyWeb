export interface Category {
    categoryId: string;
    nome: string;
    descricao?: string;
    ativo: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
}


export interface CategoryCreate {
    nome: string;
    descricao?: string;
    ativo: boolean;
}

export interface CategoryUpdate {
    categoryId: string;
    nome: string;
    descricao?: string;
    ativo: boolean;
}