import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonRefresher, IonRefresherContent, IonSpinner, IonSearchbar, IonSelect } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MovesService } from '../servicios/moves.service';

import {IonSelectOption} from '@ionic/angular/standalone';

@Component({
  selector: 'app-populares',
  templateUrl: './populares.page.html',
  styleUrls: ['./populares.page.scss'],
  standalone: true,
  imports: [IonSearchbar,IonSelect,IonSelectOption, IonSpinner, IonRefresherContent, IonRefresher, IonIcon, IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PopularesPage implements OnInit {

  
  popularMovies: any[] = [];
  filteredMovies: any[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'rating' | 'release_date' | 'title' = 'rating';
  isLoading = true;
  searchQuery = '';

  constructor(
    private router: Router,
    private moviesService: MovesService
  ) { }

  ngOnInit() {
    this.loadPopularMovies();
  }

  loadPopularMovies() {
    this.isLoading = true;
    this.moviesService.getMoviespopular().subscribe({
      next: (response: any) => {
        this.popularMovies = response.results;
        this.filteredMovies = [...this.popularMovies];
        this.sortMovies();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.isLoading = false;
      }
    });
  }

  searchMovies(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    
    if (query && query.trim() !== '') {
      this.filteredMovies = this.popularMovies.filter((movie) => {
        return movie.title.toLowerCase().includes(query) || 
               movie.overview.toLowerCase().includes(query);
      });
    } else {
      this.filteredMovies = [...this.popularMovies];
    }
    this.sortMovies();
  }

  sortMovies() {
    this.filteredMovies.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  changeSortBy(event: any) {
    this.sortBy = event.detail.value;
    this.sortMovies();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  viewMovieDetail(movieId: number) {
    this.router.navigate(['/detalles', movieId]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getImageUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

  getGenreText(genreIds: number[]): string {
    // Mapeo básico de géneros comunes
    const genreMap: { [key: number]: string } = {
      28: 'Acción',
      12: 'Aventura',
      16: 'Animación',
      35: 'Comedia',
      80: 'Crimen',
      99: 'Documental',
      18: 'Drama',
      10751: 'Familiar',
      14: 'Fantasía',
      36: 'Historia',
      27: 'Terror',
      10402: 'Música',
      9648: 'Misterio',
      10749: 'Romance',
      878: 'Ciencia Ficción',
      10770: 'Película de TV',
      53: 'Suspense',
      10752: 'Guerra',
      37: 'Western'
    };
    
    return genreIds.slice(0, 2).map(id => genreMap[id] || 'Desconocido').join(', ');
  }

  refreshData(event: any) {
    this.loadPopularMovies();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}