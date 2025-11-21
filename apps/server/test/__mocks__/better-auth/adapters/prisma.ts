// Minimal mock for 'better-auth/adapters/prisma'
// Provides a prismaAdapter function that simply stores provided args.

export function prismaAdapter(client: any, options?: any) {
  return { client, options } as any;
}
