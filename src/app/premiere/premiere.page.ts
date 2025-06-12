import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, 
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonChip,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonBadge} from '@ionic/angular/standalone';
import { MovesService } from '../servicios/moves.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { 

  star, 
  starOutline, 
  calendar, 
  time, 
  play,
  sparklesOutline,
  heartOutline,
  trendingUp,
  trophy,
  search as searchIcon
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
}
interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Component({
  selector: 'app-premiere',
  templateUrl: './premiere.page.html',
  styleUrls: ['./premiere.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonImg,
    IonChip,
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonBadge]
})
export class PremierePage implements OnInit {
 private moviesService = inject(MovesService);
  
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  selectedSegment: string = 'popular';
  searchQuery: string = '';
  isLoading: boolean = false;
  favorites: Set<number> = new Set();

  constructor(
     private router: Router,

  ) {
    addIcons({
      star,
      starOutline,
      calendar,
      time,
      play,
      sparklesOutline,
      heartOutline,
      trendingUp,
      trophy,
      searchIcon
    });
  }

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies() {
    this.isLoading = true;
    try {
      let response: any;
      
      switch (this.selectedSegment) {
        case 'Cartelera':
          response = await this.moviesService.getCartelera().toPromise();
          break;
        case 'top_rated':
          response = await this.moviesService.getTopRatedMovies().toPromise();
          break;
        case 'estrenos':
          response = await this.moviesService.getEstrenos().toPromise();
          break;
        default:
          response = await this.moviesService.getCartelera().toPromise();
      }
      
      this.movies = response.results;
      this.filteredMovies = this.movies;
      
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      this.isLoading = false;
    }
  }
 viewMovieDetail(movieId: number) {
    this.router.navigate(['/detalles', movieId]);
  }
  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
    this.searchQuery = '';
    this.loadMovies();
  }

  async onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
    
    if (this.searchQuery.trim() === '') {
      this.filteredMovies = this.movies;
      return;
    }

    if (this.searchQuery.length > 2) {
      try {
        const response: any = await this.moviesService.searchMovies(this.searchQuery).toPromise();
        this.filteredMovies = response.results;
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    }
  }

  toggleFavorite(movieId: number) {
    if (this.favorites.has(movieId)) {
      this.favorites.delete(movieId);
    } else {
      this.favorites.add(movieId);
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favorites.has(movieId);
  }

  getMoviePosterUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/placeholder-movie.jpg';
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating / 2) % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star-half');
    }
    
    while (stars.length < 5) {
      stars.push('star-outline');
    }
    
    return stars;
  }

  getGenreColor(index: number): string {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    return colors[index % colors.length];
  }

  async doRefresh(event: any) {
    await this.loadMovies();
    event.target.complete();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}