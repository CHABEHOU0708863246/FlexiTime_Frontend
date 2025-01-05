import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getDocument(): Document | null {
    return this.isBrowser() ? document : null;
  }

  getWindow(): Window | null {
    return this.isBrowser() ? window : null;
  }
}
