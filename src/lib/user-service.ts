import db from './db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, email, passwordHash);

    return db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid) as User;
  } catch (e) {
    console.error('Error creating user:', e);
    return null;
  }
}

export function getUserByEmail(email: string): User | null {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | null;
}

export function getUserById(id: number): User | null {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | null;
} 