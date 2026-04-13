import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.interface';
import { ProductModalCreateComponent } from './modal/modal-create.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalCreateComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  searchTerm = signal('');
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  total = signal(0);
  currentPage = signal(1);
  showInactive = signal(false);
  showCreateModal = signal(false);

  readonly take = 11;

  get skip(): number {
    return (this.currentPage() - 1) * this.take;
  }

  totalPages = computed(() => {
    const total = this.total();
    return total > 0 ? Math.ceil(total / this.take) : 1;
  });

  hasPagination = computed(() => this.totalPages() > 1);

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  });

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const inactive = this.showInactive();

    return this.products()
      .filter((p) => (inactive ? !p.ativo : p.ativo))
      .filter(
        (p) =>
          !term ||
          p.nome.toLowerCase().includes(term) ||
          p.productId.toLowerCase().includes(term) ||
          p.category?.nome?.toLowerCase().includes(term),
      );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts(this.skip, this.take).subscribe({
      next: (res) => {
        this.products.set(res.dados.items);
        this.total.set(res.dados.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar produtos.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage())
      return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onNewProduct(): void {
    this.showCreateModal.set(true);
  }
  onEdit(product: Product): void {}
  onDelete(product: Product): void {
    if (!confirm(`Deseja realmente excluir "${product.nome}"?`)) return;

    this.productService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: () => {
        alert('Erro ao excluir produto. Tente novamente.');
      },
    });
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  onProductCreated(): void {
  this.loadProducts();
}

  toggleInactive(): void {
    this.showInactive.update((v) => !v);
  }
}
