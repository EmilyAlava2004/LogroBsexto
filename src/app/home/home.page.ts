import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { Router } from '@angular/router';
import { MovesService } from '../servicios/moves.service';
import{ FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline,
  trendingUp,
  film,
  star,
  play,
  starOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  featuredMovies: any[] = [];
  topRatedMovies: any[] = [];
  popularMovies: any[] = [];
  isLoading = true;
  username !: string;
  categories = [
    { name: 'Populares', icon: 'trending-up', route: '/tabs/populares' },
    { name: 'En Cartelera', icon: 'film', route: '/tabs/premiere' },
  ];
  constructor(
    private router: Router,
    private moviesService: MovesService
  ) { 
    addIcons({
      'trending-up': trendingUp,
      'film': film,
      'star': star,
      'star-outline': starOutline,
      'play': play,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {
    this.loadHomeData();
    this.username = localStorage.getItem('userEmail') || '';
  }

  loadHomeData() {
    this.isLoading = true;
    
    // Cargar películas populares para la sección destacada
    this.moviesService.getMoviespopular().subscribe({
      next: (response: any) => {
        this.featuredMovies = response.results.slice(0, 1); // Película destacada principal
        this.popularMovies = response.results.slice(1, 6); // Otras películas populares
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
      }
    });

    // Cargar películas mejor valoradas
    this.moviesService.getTopRatedMovies().subscribe({
      next: (response: any) => {
        this.topRatedMovies = response.results.slice(0, 6);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading top rated movies:', error);
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewMovieDetail(movieId: number) {
    this.router.navigate(['/detalles', movieId]);
  }

  getImageUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

  getBackdropUrl(backdropPath: string): string {
    return backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : 'assets/no-image.png';
  }

  refreshData(event: any) {
    this.loadHomeData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}