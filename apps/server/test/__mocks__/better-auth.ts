// Lightweight manual mock for 'better-auth' used during unit tests.
// Prevents pulling in heavy ESM deps like 'jose' and avoids network/crypto work.

export class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export function betterAuth(_: any) {
  return {
    api: {
      signInEmail: async (_opts?: any) => ({
        user: { emailVerified: true, email: 'test@example.com', name: 'Test', image: '' },
        token: 'mock-token',
      }),
      signOut: async (_opts?: any) => {},
      signUpEmail: async (_opts?: any) => {},
    },
  } as const;
}

// Some modules import from 'better-auth/adapters/prisma' and 'better-auth/plugins'
// Those are provided in sibling mock files under __mocks__/better-auth/*
