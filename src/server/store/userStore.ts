import { User } from "../types";

type UserInternal = User;

class InMemoryUserStore {
  private readonly usersByEmail = new Map<string, UserInternal>();
  private readonly usersById = new Map<string, UserInternal>();

  findByEmail(email: string): UserInternal | undefined {
    return this.usersByEmail.get(email.toLowerCase());
  }

  findById(id: string): UserInternal | undefined {
    return this.usersById.get(id);
  }

  save(user: UserInternal): UserInternal {
    const normalizedEmail = user.email.toLowerCase();
    this.usersByEmail.set(normalizedEmail, user);
    this.usersById.set(user.id, user);
    return user;
  }

  clear() {
    this.usersByEmail.clear();
    this.usersById.clear();
  }
}

const store = new InMemoryUserStore();

export const userStore = {
  findByEmail: (email: string) => store.findByEmail(email),
  findById: (id: string) => store.findById(id),
  save: (user: UserInternal) => store.save(user),
  clear: () => store.clear(),
};
