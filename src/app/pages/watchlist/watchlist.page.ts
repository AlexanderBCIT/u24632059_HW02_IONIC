import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: false
})
export class WatchlistPage {

  watchlist: Movie[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    await this.loadWatchlist();
  }

  async loadWatchlist() {
    this.watchlist = await this.storageService.getWatchlist();
  }

  viewDetails(movie: Movie) {
  this.router.navigate(['/movie-details', movie.imdbId], {
    state: {
      movie: movie,
      returnUrl: '/tabs/watchlist'
    }
  });
}

  async markAsWatched(movie: Movie) {
    await this.storageService.markAsWatched(movie);
    alert('Movie moved to Watched List.');
    await this.loadWatchlist();
  }

  async removeFromWatchlist(movie: Movie) {
    await this.storageService.removeFromWatchlist(movie.imdbId || '');
    alert('Movie removed from Watchlist.');
    await this.loadWatchlist();
  }
}