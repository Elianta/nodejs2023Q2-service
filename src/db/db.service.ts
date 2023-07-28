import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, SafeUser } from 'src/types';

@Injectable()
export class DbService {
  private users: User[] = [];

  private _getSafeUser(user: User): SafeUser {
    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  getAllUsers() {
    return this.users.map((user) => this._getSafeUser(user));
  }

  getOneUser(id: string, safe = true): User | SafeUser | null {
    const found = this.users.find((user) => user.id === id);

    if (!found) return null;
    if (safe) return this._getSafeUser(found);
    return found;
  }

  deleteOneUser(id: string) {
    const prevLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    const currentLength = this.users.length;

    return currentLength < prevLength ? id : null;
  }

  createUser({
    data: { login, hash },
  }: {
    data: { login: string; hash: string };
  }): SafeUser {
    const createdAt = Date.now();
    const user: User = {
      id: uuidv4(),
      login,
      passwordHash: hash,
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };

    this.users.push(user);

    return this._getSafeUser(user);
  }

  updateUser({
    data: { id, userData },
  }: {
    data: { id: string; userData: Partial<User> };
  }) {
    const found = this.users.find((user) => user.id === id);

    if (!found) return null;

    for (const key in userData) {
      found[key] = userData[key];
    }
    found.version = found.version + 1;
    found.updatedAt = Date.now();

    return this._getSafeUser(found);
  }
}
