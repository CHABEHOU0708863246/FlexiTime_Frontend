import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ToastComponent } from './core/components/toast/toast.component';
import { NgIf } from '@angular/common'; // ✅ Import direct de NgIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastrModule, ToastComponent, NgIf], // ✅ Ajout de NgIf explicitement
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FlexiTime_Frontend';
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true; // Afficher le spinner au début de la navigation
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false; // Cacher le spinner à la fin du chargement
      }
    });
  }
}
