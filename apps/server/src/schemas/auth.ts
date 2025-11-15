import { JSONSchemaType } from "./index";

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  image: string | null | undefined;
}

export interface SignupBody {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {}

export const loginBodySchema: JSONSchemaType<LoginBody> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

export const signupBodySchema: JSONSchemaType<SignupBody> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    name: { type: "string", minLength: 3, maxLength: 50 },
  },
  required: ["email", "password", "name"],
};
