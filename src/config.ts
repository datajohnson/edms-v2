import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `.env.test`;
    break;
  case "production":
    path = `.env.production`;
    break;
  default:
    path = `.env.development`;
}
dotenv.config({ path: path });

console.log(`Loading config from ${path}`);

export const API_PORT = parseInt(process.env.API_PORT || "3000");
export const FRONTEND_URL = process.env.FRONTEND_URL || "";
export const NODE_ENV = process.env.NODE_ENV;

export const DB_NAME = process.env.DB_NAME || "postgres";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASS = process.env.DB_PASS || "password";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || "5432";

export const EMAIL_HOST = process.env.EMAIL_HOST || "";
export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_PASS = process.env.EMAIL_PASS || "";

export const FILE_PATH = process.env.FILE_PATH || __dirname + "\\files\\";
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
export const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
