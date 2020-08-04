import dotenv from 'dotenv';
import * as fs from 'fs';
import { info } from './prettyPrint';

// Setup
if (fs.existsSync('.env')) {
  info('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  info('Using .env.example file to supply config environment variables');
}
export const ENVIRONMENT = process.env.NODE_ENV;

// Secrets
export const REDDIT_CLIENT_ID = process.env['REDDIT_CLIENT_ID'];
export const REDDIT_CLIENT_SECRET = process.env['REDDIT_CLIENT_SECRET'];
export const REDDIT_PASSWORD = process.env['REDDIT_PASSWORD'];
export const REDDIT_USERNAME = process.env['REDDIT_USERNAME'];
