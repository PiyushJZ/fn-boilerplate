import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  apiKey,
  phoneNumber,
  twoFactor,
  username,
  organization,
  captcha,
  multiSession,
  oAuthProxy,
  openAPI,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: true,
    cookiePrefix: "fn-boilerplate",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 5,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async () => {},
    onPasswordReset: async () => {},
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async () => {},
    expiresIn: 1 * 60 * 60,
  },
  socialProviders: {
    apple: {
      enabled: true,
      clientId: "",
      clientSecret: "",
      appBundleIdentifier: "",
    },
    github: {
      enabled: true,
      clientId: "",
      clientSecret: "",
    },
    google: {
      enabled: true,
      clientId: "",
      clientSecret: "",
    },
    microsoft: {
      enabled: true,
      clientId: "",
      clientSecret: "",
    },
  },
  plugins: [
    twoFactor(),
    username(),
    phoneNumber(),
    passkey(),
    admin(),
    apiKey(),
    organization(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: "",
    }),
    multiSession(),
    oAuthProxy({
      productionURL: "",
      currentURL: "http://localhost:8080",
    }),
    openAPI(),
  ],
  trustedOrigins: ["https://appleid.apple.com"],
});
