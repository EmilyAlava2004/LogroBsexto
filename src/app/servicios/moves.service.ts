import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
private http = inject(HttpClient);
  constructor() {}
   searchMovies(query: string) {
  const apiKey = '790bcff984e23cec4b17963625a97209';
  return this.http.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&language=en-US&page=1`);
}
getMovieDetails(movieId: string) {
  return this.http.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=790bcff984e23cec4b17963625a97209&language=en-US`);
}

}

