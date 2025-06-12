import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Comment } from '../interface/IComment';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
private http = inject(HttpClient);
  private baseUrl = 'https://api.themoviedb.org/3';
  private apiKey = '790bcff984e23cec4b17963625a97209';
  
  constructor() {}
    // Búsqueda de películas por título
  searchMovies(query: string) {
    return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&include_adult=false&language=en-US&page=1`);
  }

  // Búsqueda de actores por nombre
  searchActors(query: string) {
    return this.http.get(`${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${query}&include_adult=false&language=en-US&page=1`);
  }

  // Obtener películas de un actor específico
  getActorMovies(actorId: number) {
    return this.http.get(`${this.baseUrl}/person/${actorId}/movie_credits?api_key=${this.apiKey}&language=en-US`);
  }

  // Búsqueda combinada (multi-search que incluye películas, actores y series)
  searchMulti(query: string) {
    return this.http.get(`${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${query}&include_adult=false&language=en-US&page=1`);
  }
getGenres() {
  return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`);
}

// Obtener películas por género específico
getMoviesByGenre(genreId: number, page: number = 1) {
  return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=es-ES&page=${page}`);
}

getMovieDetails(movieId: string) {
  return this.http.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=790bcff984e23cec4b17963625a97209&language=en-US`);
}

getMoviespopular() {
  return this.http.get('https://api.themoviedb.org/3/movie/popular?api_key=790bcff984e23cec4b17963625a97209&language=en-US&page=1');
}
getMoviesTopRated() {
  return this.http.get('https://api.themoviedb.org/3/movie/top_rated?api_key=790bcff984e23cec4b17963625a97209&language=en-US&page=1');
}

getTopRatedMovies() {
  return this.http.get('https://api.themoviedb.org/3/movie/top_rated?api_key=790bcff984e23cec4b17963625a97209&language=en-US&page=1');
}
getCartelera(){
  return this.http.get('https://api.themoviedb.org/3/movie/upcoming?api_key=790bcff984e23cec4b17963625a97209&language=en-US&page=1');
  
}
getEstrenos() {
  return this.http.get('https://api.themoviedb.org/3/movie/now_playing?api_key=790bcff984e23cec4b17963625a97209&language=en-US&page=1')
}
saveComment(user_id: number, movie_id: number, comment: string) {
  const token = localStorage.getItem('token');
  const headers = {'Authorization': `Bearer ${token}`};
  // Cambiar 'comment' por 'description' para que coincida con tu modelo
  return this.http.post('http://localhost:3000/api/comment', {description: comment, user_id, movie_id}, { headers });
}

getComment(movie_id: number) {
  // No necesitas token para obtener comentarios según tu backend
  return this.http.get<Comment[]>(`http://localhost:3000/api/comments/${movie_id}`);
}
}
