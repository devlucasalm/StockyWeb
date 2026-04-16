import {
  Component,
  OnInit,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../shared/services/dashboard.service';
import { Dashboard } from '../../shared/models/dashboard.interface';

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

Chart.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  DoughnutController, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  @ViewChild('estoqueChart') estoqueChart!: ElementRef;
  @ViewChild('distribuicaoChart') distribuicaoChart!: ElementRef;

  data = signal<Dashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  estoqueChartInstance: any;
  distribuicaoChartInstance: any;

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.data.set(res.dados);
        this.loading.set(false);

        setTimeout(() => {
          this.createCharts(res.dados);
        });
      },
      error: () => {
        this.error.set('Erro ao carregar dashboard.');
        this.loading.set(false);
      },
    });
  }

  createCharts(data: Dashboard) {
    if (this.estoqueChartInstance) this.estoqueChartInstance.destroy();
    if (this.distribuicaoChartInstance) this.distribuicaoChartInstance.destroy();

    const chartColors = ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6'];

    this.estoqueChartInstance = new Chart(this.estoqueChart.nativeElement, {
      type: 'bar',
      data: {
        labels: data.produtosPorCategoria.map(c => c.categoria),
        datasets: [{
          data: data.produtosPorCategoria.map(c => c.quantidade),
          backgroundColor: chartColors,
          borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
          barPercentage: 0.5 
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, 
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: { display: false }, 
            grid: { color: '#f3f4f6' }, 
          },
          x: {
            border: { display: false }, 
            grid: { display: false } 
          }
        }
      }
    });

    this.distribuicaoChartInstance = new Chart(this.distribuicaoChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.produtosPorCategoria.map(c => `${c.categoria}   ${c.quantidade}`),
        datasets: [{
          data: data.produtosPorCategoria.map(c => c.quantidade),
          backgroundColor: chartColors,
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%', 
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true, 
              padding: 20,
              font: { family: "'DM Sans', sans-serif", size: 12 }
            }
          }
        }
      }
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatNumber(value: number): string {
    return value.toLocaleString('pt-BR');
  }
}