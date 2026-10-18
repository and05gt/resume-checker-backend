declare global {
  namespace Express {
    interface User {
      _id: string | { toString(): string };
      email?: string;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
