import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse, Paginacao } from '../models/response.interface';
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(
    skip: number,
    take: number,
  ): Observable<AppResponse<Paginacao<Category>>> {
    return this.http.get<AppResponse<Paginacao<Category>>>(
      `${this.apiUrl}/Category?skip=${skip}&take=${take}`,
    );
  }

  postCategory(category: CategoryCreate): Observable<AppResponse<Category>> {
    return this.http.post<AppResponse<Category>>(
      `${this.apiUrl}/Category`,
      category,
    );
  }

  putCategory(categoryUpdate: CategoryUpdate): Observable<AppResponse<Category>> {
    return this.http.put<AppResponse<Category>>(
      `${this.apiUrl}/Category`,
      categoryUpdate,
    );
  }


  deleteCategory(id: string): Observable<AppResponse<Category>> {
    return this.http.delete<AppResponse<Category>>(
      `${this.apiUrl}/Category?id=${id}`,
    );
  }

  getCategoryById(id: string): Observable<AppResponse<Category>> {
    return this.http.get<AppResponse<Category>>(`${this.apiUrl}/Category/${id}`);
  }
}
