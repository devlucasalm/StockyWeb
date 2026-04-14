import {
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductCreate } from '../../../shared/models/product.interface';
import { Category } from '../../../shared/models/category.interface';

@Component({
  selector: 'app-product-modal-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss'],
})
export class ProductModalCreateComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  loading = signal(false);
  loadingCategories = signal(false);
  error = signal<string | null>(null);
  preview = signal<string | null>(null);
  categories = signal<Category[]>([]);

  form: ProductCreate = {
    nome: '',
    descricao: '',
    preco: 0,
    quantidade: 0,
    categoryId: '',
    imagemUrl: undefined,
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingCategories.set(true);
    this.categoryService.getCategories(0, 100).subscribe({
      next: (res) => {
        this.categories.set(res.dados.items);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.form.imagemUrl = file as any;
    const reader = new FileReader();
    reader.onload = (e) => this.preview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closed.emit();
    }
  }

  onSubmit(): void {
    if (!this.form.nome.trim()) {
      this.error.set('O nome do produto é obrigatório.');
      return;
    }
    if (!this.form.categoryId) {
      this.error.set('Selecione uma categoria.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.productService.postProduct(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.created.emit();
        this.closed.emit();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Erro ao cadastrar produto. Tente novamente.');
      },
    });
  }
}
