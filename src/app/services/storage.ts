import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.storageReady = true;
  }

  private async waitForStorage() {
    while (!this.storageReady) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  private async loadMovieList(key: string): Promise<Movie[]> {
    await this.waitForStorage();

    const localMovies = localStorage.getItem(key);

    if (localMovies) {
      return JSON.parse(localMovies);
    }

    const ionicMovies = await this.storage.get(key);

    if (ionicMovies) {
      localStorage.setItem(key, JSON.stringify(ionicMovies));
      return ionicMovies;
    }

    return [];
  }

  private async saveMovieList(key: string, movies: Movie[]) {
    await this.waitForStorage();

    await this.storage.set(key, movies);
    localStorage.setItem(key, JSON.stringify(movies));
  }

  async getWatchlist(): Promise<Movie[]> {
    return await this.loadMovieList('watchlist');
  }

  async saveWatchlist(movies: Movie[]): Promise<void> {
    await this.saveMovieList('watchlist', movies);
  }

  async addToWatchlist(movie: Movie): Promise<boolean> {
    const watchlist = await this.getWatchlist();
    const watchedList = await this.getWatchedList();

    const alreadyInWatchlist = watchlist.find(item => item.imdbId === movie.imdbId);
    const alreadyWatched = watchedList.find(item => item.imdbId === movie.imdbId);

    if (alreadyInWatchlist || alreadyWatched) {
      return false;
    }

    const movieToAdd: Movie = {
      imdbId: movie.imdbId,
      title: movie.title,
      year: movie.year,
      cast: movie.cast,
      poster: movie.poster,
      timesWatched: 0
    };

    watchlist.push(movieToAdd);

    await this.saveWatchlist(watchlist);

    return true;
  }

  async removeFromWatchlist(imdbId: string): Promise<void> {
    const watchlist = await this.getWatchlist();

    const updatedWatchlist = watchlist.filter(movie => movie.imdbId !== imdbId);

    await this.saveWatchlist(updatedWatchlist);
  }

  async getWatchedList(): Promise<Movie[]> {
    return await this.loadMovieList('watchedList');
  }

  async saveWatchedList(movies: Movie[]): Promise<void> {
    await this.saveMovieList('watchedList', movies);
  }

  async markAsWatched(movie: Movie): Promise<void> {
    await this.removeFromWatchlist(movie.imdbId || '');

    const watchedList = await this.getWatchedList();

    const existingMovie = watchedList.find(item => item.imdbId === movie.imdbId);

    if (existingMovie) {
      existingMovie.timesWatched = (existingMovie.timesWatched || 0) + 1;
    } else {
      const watchedMovie: Movie = {
        imdbId: movie.imdbId,
        title: movie.title,
        year: movie.year,
        cast: movie.cast,
        poster: movie.poster,
        timesWatched: 1
      };

      watchedList.push(watchedMovie);
    }

    await this.saveWatchedList(watchedList);
  }

  async removeFromWatchedList(imdbId: string): Promise<void> {
    const watchedList = await this.getWatchedList();

    const updatedWatchedList = watchedList.filter(movie => movie.imdbId !== imdbId);

    await this.saveWatchedList(updatedWatchedList);
  }

  async resetWatchedMovie(movie: Movie): Promise<void> {
    await this.removeFromWatchedList(movie.imdbId || '');

    const watchlist = await this.getWatchlist();

    const alreadyInWatchlist = watchlist.find(item => item.imdbId === movie.imdbId);

    if (!alreadyInWatchlist) {
      const resetMovie: Movie = {
        imdbId: movie.imdbId,
        title: movie.title,
        year: movie.year,
        cast: movie.cast,
        poster: movie.poster,
        timesWatched: 0
      };

      watchlist.push(resetMovie);
      await this.saveWatchlist(watchlist);
    }
  }
}