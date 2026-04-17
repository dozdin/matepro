import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Neon serverless PostgreSQL client.
// DATABASE_URL is provided by the Neon integration.
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // In demo mode (no DATABASE_URL), this module is never actually used,
  // but we throw a clear error if someone tries to import it without config.
  throw new Error(
    'DATABASE_URL is not set. Connect the Neon integration or run in demo mode.'
  )
}

const sql = neon(connectionString)

export const db = drizzle(sql, { schema })

export * from './schema'
