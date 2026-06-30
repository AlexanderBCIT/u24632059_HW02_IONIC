import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface UserAccount {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  private async loadUsers(): Promise<UserAccount[]> {
    await this.waitForStorage();

    const localUsers = localStorage.getItem('users');

    if (localUsers) {
      return JSON.parse(localUsers);
    }

    const ionicUsers = await this.storage.get('users');

    if (ionicUsers) {
      localStorage.setItem('users', JSON.stringify(ionicUsers));
      return ionicUsers;
    }

    return [];
  }

  private async saveUsers(users: UserAccount[]) {
    await this.waitForStorage();

    await this.storage.set('users', users);
    localStorage.setItem('users', JSON.stringify(users));
  }

  async signup(email: string, password: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();

    const users = await this.loadUsers();

    const existingUser = users.find(user => user.email === cleanEmail);

    if (existingUser) {
      return false;
    }

    const newUser: UserAccount = {
      email: cleanEmail,
      password: password
    };

    users.push(newUser);

    await this.saveUsers(users);

    return true;
  }

  async login(email: string, password: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();

    const users = await this.loadUsers();

    const validUser = users.find(
      user => user.email === cleanEmail && user.password === password
    );

    if (validUser) {
      await this.storage.set('currentUser', cleanEmail);
      localStorage.setItem('currentUser', cleanEmail);

      return true;
    }

    return false;
  }

  async logout(): Promise<void> {
    await this.waitForStorage();

    await this.storage.remove('currentUser');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<string | null> {
    await this.waitForStorage();

    const localCurrentUser = localStorage.getItem('currentUser');

    if (localCurrentUser) {
      return localCurrentUser;
    }

    const ionicCurrentUser = await this.storage.get('currentUser');

    if (ionicCurrentUser) {
      localStorage.setItem('currentUser', ionicCurrentUser);
      return ionicCurrentUser;
    }

    return null;
  }
}