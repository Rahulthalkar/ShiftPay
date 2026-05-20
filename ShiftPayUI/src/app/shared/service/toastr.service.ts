import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  private containerId = 'custom-toast-container';

  private getOrCreateContainer(): HTMLElement {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm';
      document.body.appendChild(container);
    }
    return container;
  }

  success(message: string, title: string = 'Success') {
    this.showToast(message, title, 'success');
  }

  error(message: string, title: string = 'Error') {
    this.showToast(message, title, 'error');
  }

  info(message: string, title: string = 'Info') {
    this.showToast(message, title, 'info');
  }

  warning(message: string, title: string = 'Warning') {
    this.showToast(message, title, 'warning');
  }

  private showToast(message: string, title: string, type: 'success' | 'error' | 'info' | 'warning') {
    const container = this.getOrCreateContainer();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-500 transform translate-x-12 opacity-0 scale-95`;

    let typeClasses = '';
    let iconSvg = '';

    switch (type) {
      case 'success':
        typeClasses = 'bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white';
        iconSvg = `
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        `;
        break;
      case 'error':
        typeClasses = 'bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white';
        iconSvg = `
          <div class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        `;
        break;
      case 'warning':
        typeClasses = 'bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white';
        iconSvg = `
          <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        `;
        break;
      default:
        typeClasses = 'bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white';
        iconSvg = `
          <div class="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        `;
    }

    toast.className += ` ${typeClasses}`;
    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-0.5">${title}</h4>
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 self-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Hook up dismiss button
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.onclick = () => this.dismiss(toast);
    }

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-12', 'opacity-0', 'scale-95');
      toast.classList.add('translate-x-0', 'opacity-100', 'scale-100');
    }, 10);

    // Auto-dismiss
    setTimeout(() => {
      this.dismiss(toast);
    }, 4000);
  }

  private dismiss(toast: HTMLElement) {
    if (!toast.parentNode) return;
    
    // Animate out
    toast.classList.remove('translate-x-0', 'opacity-100', 'scale-100');
    toast.classList.add('translate-x-12', 'opacity-0', 'scale-95');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 500);
  }
}
