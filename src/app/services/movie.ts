import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = 'https://imdb.iamidiotareyoutoo.com/search';

  constructor(private http: HttpClient) { }

  searchMovies(searchTerm: string): Observable<Movie[]> {
    const params = new HttpParams().set('q', searchTerm);

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(response => {
        const results = response?.description || [];

        return results.map((item: any) => {
          return {
            imdbId: item['#IMDB_ID'] || '',
            title: item['#TITLE'] || 'Unknown Title',
            year: item['#YEAR'] || '',
            cast: item['#ACTORS'] || '',
            poster: item['#IMG_POSTER'] || '',
            timesWatched: 0
          };
        });
      })
    );
  }
}