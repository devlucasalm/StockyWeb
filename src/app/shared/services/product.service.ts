import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse, Paginacao } from '../models/response.interface';
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(
    skip: number,
    take: number,
  ): Observable<AppResponse<Paginacao<Product>>> {
    return this.http.get<AppResponse<Paginacao<Product>>>(
      `${this.apiUrl}/Product?skip=${skip}&take=${take}`,
    );
  }

  postProduct(product: ProductCreate): Observable<AppResponse<Product>> {
    const formData = new FormData();

    formData.append('Nome', product.nome);
    formData.append('Descricao', product.descricao);
    formData.append('Preco', product.preco.toString());
    formData.append('Quantidade', product.quantidade.toString());
    formData.append('CategoryId', product.categoryId);

    if (product.imagemUrl) {
      formData.append('Imagem', product.imagemUrl);
    }

    return this.http.post<AppResponse<Product>>(
      `${this.apiUrl}/Product`,
      formData,
    );
  }

  putProduct(
    productUpdate: ProductUpdate,
  ): Observable<AppResponse<ProductUpdate>> {
    const formData = new FormData();

    formData.append('id', productUpdate.productId);
    formData.append('nome', productUpdate.nome);
    formData.append('descricao', productUpdate.descricao);
    formData.append('preco', productUpdate.preco.toString());
    formData.append('quantidade', productUpdate.quantidade.toString());
    formData.append('ativo', productUpdate.ativo.toString());

    if (productUpdate.imagemUrl) {
      formData.append('imagemFile', productUpdate.imagemUrl);
    }

    return this.http.put<AppResponse<ProductUpdate>>(
      `${this.apiUrl}/Product`,
      formData,
    );
  }

  deleteProduct(id: string): Observable<AppResponse<Product>> {
    return this.http.delete<AppResponse<Product>>(
      `${this.apiUrl}/Product?id=${id}`,
    );
  }

  getProductById(id: string): Observable<AppResponse<Product>> {
    return this.http.get<AppResponse<Product>>(`${this.apiUrl}/Product/${id}`);
  }
}
