import { Component, ElementRef, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  protected readonly menuItems: MenuItem[] = [
    { label: 'Products', route: '/products' },
    { label: 'Orders', route: '/pedidos' },
    { label: 'Reviews', route: '/avaliacoes' },
  ];

  protected readonly userMenuItems: MenuItem[] = [
    { label: 'Account Settings', route: '/configuracoes-conta' },
    { label: 'Finance', route: '/financeiro' },
  ];

  protected isLoggedIn = false;
  protected isUserMenuOpen = false;
  protected userPhotoUrl: string | null = null;

  protected toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  protected closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.isUserMenuOpen = false;
    }
  }
}
