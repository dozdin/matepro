import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function runMigration() {
  try {
    console.log('[v0] Starting Neon schema migration...')

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'operari',
        department TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created users table')

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    console.log('[v0] Created sessions table')

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        client_name TEXT,
        status TEXT DEFAULT 'en_curs',
        budget DECIMAL(12, 2),
        start_date DATE,
        end_date DATE,
        manager_id TEXT,
        team_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `
    console.log('[v0] Created projects table')

    // Create tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'media',
        status TEXT DEFAULT 'pendente',
        assignee_id TEXT,
        start_date DATE,
        due_date DATE,
        estimated_hours DECIMAL(8, 2),
        progress INT DEFAULT 0,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        created_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assignee_id) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `
    console.log('[v0] Created tasks table')

    // Create forum posts table
    await sql`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        author_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INT DEFAULT 0,
        replies INT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    console.log('[v0] Created forum_posts table')

    // Create chat messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    console.log('[v0] Created chat_messages table')

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT,
        type TEXT DEFAULT 'info',
        read BOOLEAN DEFAULT FALSE,
        snoozed_until TIMESTAMP,
        related_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    console.log('[v0] Created notifications table')

    // Create calendar events table
    await sql`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_at TIMESTAMP NOT NULL,
        end_at TIMESTAMP NOT NULL,
        user_id TEXT NOT NULL,
        project_id TEXT,
        type TEXT DEFAULT 'event',
        color TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      )
    `
    console.log('[v0] Created calendar_events table')

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_forum_project ON forum_posts(project_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_room ON chat_messages(room_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_events_user ON calendar_events(user_id)`
    console.log('[v0] Created indexes')

    console.log('[v0] ✓ Neon schema migration completed successfully!')
  } catch (error) {
    console.error('[v0] Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
