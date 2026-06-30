import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: false
})
export class MovieDetailsPage {

  movie: Movie | null = null;
  movieId = '';
  returnUrl = '/tabs/search';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  async ionViewWillEnter() {
    this.movieId = this.route.snapshot.paramMap.get('id') || '';

    const navigation = this.router.getCurrentNavigation();
    const stateMovie = navigation?.extras?.state?.['movie'] || history.state.movie;
    const stateReturnUrl = navigation?.extras?.state?.['returnUrl'] || history.state.returnUrl;

    if (stateReturnUrl) {
      this.returnUrl = stateReturnUrl;
    }

    if (stateMovie) {
      this.movie = stateMovie;
      return;
    }

    await this.loadMovieFromStorage();
  }

  async loadMovieFromStorage() {
    const watchlist = await this.storageService.getWatchlist();
    const watchedList = await this.storageService.getWatchedList();

    this.movie =
      watchlist.find(item => item.imdbId === this.movieId) ||
      watchedList.find(item => item.imdbId === this.movieId) ||
      null;
  }

  async addToWatchlist() {
    if (!this.movie) {
      return;
    }

    const added = await this.storageService.addToWatchlist(this.movie);

    if (added) {
      alert('Movie added to Watchlist.');
    } else {
      alert('This movie is already in your Watchlist.');
    }
  }

  async markAsWatched() {
    if (!this.movie) {
      return;
    }

    await this.storageService.markAsWatched(this.movie);
    alert('Movie marked as watched.');
    this.router.navigateByUrl('/tabs/watched');
  }

  goBack() {
    this.router.navigateByUrl(this.returnUrl);
  }
}