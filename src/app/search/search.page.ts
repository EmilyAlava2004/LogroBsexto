import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonSearchbar, IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTab, IonTabBar, IonIcon, IonTabButton, IonSegmentButton, IonLabel, IonSegment, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { MovesService } from '../servicios/moves.service';
import { inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'
import { addIcons } from 'ionicons';
import { homeOutline, playCircle, radio, search, person, film, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonSegment, IonLabel, IonSegmentButton, IonTabButton, IonIcon, IonTabBar, IonTab, IonTabs, 
    FormsModule,
    IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, 
    IonSearchbar, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, CommonModule]
})

export class SearchPage {
  private moviesService = inject(MovesService);
  searchTerm: string = '';
  searchType: string = 'movies';
  searchResults: any[] = [];
  genres: any[] = [];
  selectedGenre: number | null = null;

  constructor() { 
    addIcons({ homeOutline, playCircle, radio, search, person, film, listOutline });
    this.loadGenres();
  }

  loadGenres() {
    this.moviesService.getGenres().subscribe({
      next: (data: any) => {
        this.genres = data.genres;
      },
      error: (error: any) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  onSearchTypeChange(event: any) {
    this.searchType = event.detail.value;
    this.searchResults = [];
    this.selectedGenre = null;
    
    if (this.searchType !== 'genres' && this.searchTerm.trim()) {
      this.performSearch();
    }
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.detail.value;
    if (this.selectedGenre) {
      this.searchByGenre();
    } else {
      this.searchResults = [];
    }
  }

  searchMovies() {
    if (this.searchType === 'genres') {
      return; // No hacer búsqueda por texto cuando estamos en modo género
    }
    
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    this.performSearch();
  }

  private performSearch() {
    switch (this.searchType) {
      case 'movies':
        this.searchMoviesByTitle();
        break;
      case 'actors':
        this.searchByActor();
        break;
      case 'multi':
        this.searchMulti();
        break;
    }
  }

  private searchByGenre() {
    if (!this.selectedGenre) return;
    
    this.moviesService.getMoviesByGenre(this.selectedGenre).subscribe({
      next: (data: any) => {
        this.searchResults = data.results.map((item: any) => ({
          ...item,
          type: 'movie'
        }));
      },
      error: (error: any) => {
        console.error('Error searching by genre:', error);
      }
    });
  }

  private searchMoviesByTitle() {
    this.moviesService.searchMovies(this.searchTerm).subscribe({
      next: (datos: any) => {
        this.searchResults = datos.results.map((item: any) => ({
          ...item,
          type: 'movie'
        }));
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  private searchByActor() {
    this.moviesService.searchActors(this.searchTerm).subscribe({
      next: (datos: any) => {
        const actors = datos.results.filter((person: any) => person.known_for_department === 'Acting');
        
        if (actors.length > 0) {
          this.moviesService.getActorMovies(actors[0].id).subscribe({
            next: (moviesData: any) => {
              this.searchResults = moviesData.cast.map((item: any) => ({
                ...item,
                type: 'movie',
                actor_name: actors[0].name
              }));
            },
            error: (error: any) => {
              console.error(error);
            }
          });
        } else {
          this.searchResults = [];
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  private searchMulti() {
    this.moviesService.searchMulti(this.searchTerm).subscribe({
      next: (datos: any) => {
        this.searchResults = datos.results.map((item: any) => ({
          ...item,
          type: item.media_type
        }));
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  getImageUrl(item: any): string {
    if (item.type === 'person') {
      return item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'assets/img/person-placeholder.jpeg';
    } else {
      return item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'assets/img/images.jpeg';
    }
  }

  getTitle(item: any): string {
    if (item.type === 'person') {
      return item.name;
    }
    return item.title || item.name;
  }

  getSubtitle(item: any): string {
    if (item.type === 'person') {
      return item.known_for_department || 'Actor';
    }
    if (item.actor_name) {
      return `${item.release_date} - Actor: ${item.actor_name}`;
    }
    return item.release_date || item.first_air_date || '';
  }

  canNavigateToDetails(item: any): boolean {
    return item.type === 'movie' || item.media_type === 'movie';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  ngOnInit() {
  }
}