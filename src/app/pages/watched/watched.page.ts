import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.page.html',
  styleUrls: ['./watched.page.scss'],
  standalone: false
})
export class WatchedPage {

  watchedList: Movie[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    await this.loadWatchedList();
  }

  async loadWatchedList() {
    this.watchedList = await this.storageService.getWatchedList();
  }

 viewDetails(movie: Movie) {
  this.router.navigate(['/movie-details', movie.imdbId], {
    state: {
      movie: movie,
      returnUrl: '/tabs/watched'
    }
  });
}

  async removeFromWatchedList(movie: Movie) {
    await this.storageService.removeFromWatchedList(movie.imdbId || '');
    alert('Movie removed from Watched List.');
    await this.loadWatchedList();
  }

  async resetMovie(movie: Movie) {
    await this.storageService.resetWatchedMovie(movie);
    alert('Movie reset and moved back to Watchlist.');
    await this.loadWatchedList();
  }
}