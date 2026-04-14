import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from '../../shared/models/category.interface';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);

  searchTerm = signal('');
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  total = signal(0);
  currentPage = signal(1);
  showInactive = signal(false);

  showCreateModal = signal(false);
  createForm: CategoryCreate = { nome: '', descricao: '', ativo: true };
  createLoading = signal(false);
  createError = signal<string | null>(null);

  categoryToEdit = signal<Category | null>(null);
  editForm!: CategoryUpdate;
  editLoading = signal(false);
  editError = signal<string | null>(null);

  readonly take = 10;

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

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const inactive = this.showInactive();
    return this.categories()
      .filter(
        (c) =>
          !term ||
          c.nome.toLowerCase().includes(term) ||
          c.descricao?.toLowerCase().includes(term),
      );
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getCategories(this.skip, this.take).subscribe({
      next: (res) => {
        this.categories.set(res.dados.items);
        this.total.set(res.dados.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar categorias.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage())
      return;
    this.currentPage.set(page);
    this.loadCategories();
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  toggleInactive(): void {
    this.showInactive.update((v) => !v);
  }

  openCreateModal(): void {
    this.createForm = { nome: '', descricao: '', ativo: true };
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  onCreateOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showCreateModal.set(false);
    }
  }

  onCreateSubmit(): void {
    if (!this.createForm.nome.trim()) {
      this.createError.set('O nome da categoria é obrigatório.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this.categoryService.postCategory(this.createForm).subscribe({
      next: () => {
        this.createLoading.set(false);
        this.showCreateModal.set(false);
        this.loadCategories();
      },
      error: () => {
        this.createLoading.set(false);
        this.createError.set('Erro ao cadastrar categoria.');
      },
    });
  }

  openEditModal(category: Category): void {
    this.editForm = {
      categoryId: category.categoryId,
      nome: category.nome,
      descricao: category.descricao,
      dataCriacao: category.dataCriacao,
      dataAtualizacao: category.dataAtualizacao,
    };
    this.editError.set(null);
    this.categoryToEdit.set(category);
  }

  onEditOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.categoryToEdit.set(null);
    }
  }

  onEditSubmit(): void {
    if (!this.editForm.nome.trim()) {
      this.editError.set('O nome da categoria é obrigatório.');
      return;
    }
    this.editLoading.set(true);
    this.editError.set(null);
    this.categoryService
      .putCategory({ ...this.editForm })
      .subscribe({
        next: () => {
          this.editLoading.set(false);
          this.categoryToEdit.set(null);
          this.loadCategories();
        },
        error: () => {
          this.editLoading.set(false);
          this.editError.set('Erro ao atualizar categoria.');
        },
      });
  }

  onDelete(category: Category): void {
    if (!confirm(`Deseja excluir "${category.nome}"?`)) return;
    this.categoryService.deleteCategory(category.categoryId).subscribe({
      next: () => this.loadCategories(),
      error: () => alert('Erro ao excluir categoria.'),
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  toggleCreateAtivo(): void {
    this.createForm = { ...this.createForm, ativo: !this.createForm.ativo };
  }

  toggleEditAtivo(): void {
    this.editForm = { ...this.editForm };
  }
}
