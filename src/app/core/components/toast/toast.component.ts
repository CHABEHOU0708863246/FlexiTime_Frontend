// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible"
         class="fixed top-4 right-4 z-50 max-w-md animate-fade-in"
         [ngClass]="getToastClass()">
      <div class="flex items-center justify-between p-4 rounded-lg shadow-lg">
        <div class="flex items-center">
          <span class="mr-2" [ngClass]="getIconClass()">
            <i class="fas" [ngClass]="getIconType()"></i>
          </span>
          <p class="text-sm font-medium">{{ message }}</p>
        </div>
        <button
          (click)="close()"
          class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer">
          ×
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  isVisible = false;
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  private timeout: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.show(toast.message, toast.type);
    });
  }

  show(message: string, type: 'success' | 'error' | 'info') {
    this.message = message;
    this.type = type;
    this.isVisible = true;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.close();
    }, 3000);
  }

  close() {
    this.isVisible = false;
  }

  getToastClass() {
    return {
      'bg-red-100 text-red-900': this.type === 'error',
      'bg-green-100 text-green-900': this.type === 'success',
      'bg-blue-100 text-blue-900': this.type === 'info'
    };
  }

  getIconClass() {
    return {
      'text-red-600': this.type === 'error',
      'text-green-600': this.type === 'success',
      'text-blue-600': this.type === 'info'
    };
  }

  getIconType() {
    return {
      'fa-exclamation-circle': this.type === 'error',
      'fa-check-circle': this.type === 'success',
      'fa-info-circle': this.type === 'info'
    };
  }
}
