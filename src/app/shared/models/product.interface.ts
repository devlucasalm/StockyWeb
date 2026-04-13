import { Category } from "./category.interface";

export interface Product {
    productId: string;
    nome: string
    descricao: string;
    preco: number;
    quantidade: number;
    imagemUrl?: string;
    ativo: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
    categoryId: string;
    category: Category;
}

export interface ProductCreate {
    nome: string
    descricao: string;
    preco: number;
    quantidade: number;
    imagemUrl?: string;
    categoryId: string;
}

export interface ProductUpdate {
    productId: string;
    nome: string
    descricao: string;
    preco: number;
    ativo: boolean;
    quantidade: number;
    imagemUrl?: string;
    categoryId: string;
}