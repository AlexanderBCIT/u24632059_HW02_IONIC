import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie';
import { StorageService } from 'src/app/services/storage';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage {

  searchTerm = '';
  movies: Movie[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(
    private movieService: MovieService,
    private storageService: StorageService,
    private router: Router
  ) { }

  searchMovies() {
    if (!this.searchTerm.trim()) {
      alert('Please enter a movie title.');
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.movies = [];

    this.movieService.searchMovies(this.searchTerm).subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        alert('Could not load movies. Please try again.');
        this.isLoading = false;
      }
    });
  }

  async addToWatchlist(movie: Movie) {
    const added = await this.storageService.addToWatchlist(movie);

    if (added) {
      alert('Movie added to Watchlist.');
    } else {
      alert('This movie is already in your Watchlist.');
    }
  }
viewDetails(movie: Movie) {
  this.router.navigate(['/movie-details', movie.imdbId], {
    state: {
      movie: movie,
      returnUrl: '/tabs/search'
    }
  });
}
}