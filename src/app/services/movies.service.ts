import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Movie } from '../../types/Movies.type';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(
        `${environment.backendUrl}/api/v1/map-points
    `
      )
      .pipe(
        map((movies: Movie[]) => {
          return movies;
        })
      );
  }
}
