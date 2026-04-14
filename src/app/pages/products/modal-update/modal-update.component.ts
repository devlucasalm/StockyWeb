import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import {
  Product,
  ProductUpdate,
} from '../../../shared/models/product.interface';
import { Category } from '../../../shared/models/category.interface';

@Component({
  selector: 'app-product-modal-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss'],
})
export class ProductModalUpdateComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  loading = signal(false);
  loadingCategories = signal(false);
  error = signal<string | null>(null);
  preview = signal<string | null>(null);
  categories = signal<Category[]>([]);

  form!: ProductUpdate;

  ngOnInit(): void {
    this.form = {
      productId: this.product.productId,
      nome: this.product.nome,
      descricao: this.product.descricao,
      preco: this.product.preco,
      quantidade: this.product.quantidade,
      ativo: this.product.ativo,
      categoryId: this.product.categoryId,
      imagemUrl: undefined,
    };

    if (this.product.imagemUrl) {
      this.preview.set(this.product.imagemUrl);
    }

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

    

    this.loading.set(true);
    this.error.set(null);

    const payload: ProductUpdate = {
      ...this.form,
      ativo: this.form.ativo === true,
    };

    this.productService.putProduct(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.updated.emit();
        this.closed.emit();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Erro ao atualizar produto. Tente novamente.');
      },
    });
  }
}
