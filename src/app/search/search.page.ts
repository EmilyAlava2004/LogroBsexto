import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonSearchbar, IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTab, IonTabBar, IonIcon, IonTabButton } from '@ionic/angular/standalone';
import { MovesService } from '../servicios/moves.service';
import { inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'
import { addIcons } from 'ionicons';
import { homeOutline, playCircle, radio, search } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonTabButton, IonIcon, IonTabBar, IonTab, IonTabs, 
    FormsModule,
    IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, 
    IonSearchbar, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, CommonModule]
  })

export class SearchPage{
  private moviesService = inject(MovesService);
    searchTerm: string = '';
    searchResults: any[] = [];
  constructor() { 
     addIcons({ homeOutline, playCircle, radio, search });
  }
   searchMovies() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
   this.moviesService.searchMovies(this.searchTerm).subscribe({
      next: (datos: any) => {
        this.searchResults = datos.results;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    
  }
    

  trackByIndex(index: number, item: any): number {
    return index;
  }
  ngOnInit() {
  }

}
