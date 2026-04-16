export interface Dashboard {
  totalProdutos: number;
  totalCategorias: number;
  produtosAtivos: number;
  produtosInativos: number;
  totalItensEstoque: number;
  valorTotalEstoque: number;

  produtosPorCategoria: GraficoCategoria[];
  estoquePorProduto: GraficoProduto[];
  produtosBaixoEstoque: GraficoProduto[];
}

export interface GraficoCategoria {
  categoria: string;
  quantidade: number;
}

export interface GraficoProduto {
  nome: string;
  quantidade: number;
}