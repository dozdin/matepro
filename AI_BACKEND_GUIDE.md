# MatePro - Guia Backend per a IA (Vibe Coding)

> **Objectiu**: Aquest document permet a qualsevol IA configurar i estendre el backend de MatePro sense que l'usuari hagi d'escriure codi. Simplement demana el que necessites i la IA ho implementara.

---

## 1. Arquitectura General

```
MatePro/
├── app/                    # Next.js App Router (frontend + API routes)
│   ├── api/               # Endpoints REST
│   │   ├── auth/          # Login, logout, register
│   │   └── ...            # Altres endpoints
│   └── (app)/             # Pagines protegides
├── lib/
│   ├── db/
│   │   ├── index.ts       # Client Drizzle + Neon
│   │   └── schema.ts      # Schema PostgreSQL amb Drizzle ORM
│   ├── auth.ts            # Sistema d'autenticacio JWT
│   ├── store.ts           # Zustand store (estat client, dades demo)
│   └── i18n/              # Sistema multiidioma (ca, en, fr, it, de)
├── components/            # Components React
├── scripts/               # Scripts SQL i Node.js per migracions
└── drizzle.config.ts      # Configuracio Drizzle
```

---

## 2. Base de Dades: Neon PostgreSQL

### Connexio
- **Proveidor**: Neon (PostgreSQL serverless)
- **Variable d'entorn**: `DATABASE_URL` (ja configurada a Vercel)
- **Client**: `@neondatabase/serverless` amb `drizzle-orm/neon-http`

### Com connectar-se
```typescript
// lib/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### Schema Actual (11 taules)

| Taula | Descripcio |
|-------|------------|
| `users` | Usuaris del sistema (id, email, passwordHash, role, department, etc.) |
| `sessions` | Sessions JWT actives |
| `projects` | Projectes (nom, codi, client, estat, prioritat, dates, progress) |
| `tasks` | Tasques vinculades a projectes |
| `task_comments` | Comentaris a tasques |
| `checklists` | Llistes de verificacio |
| `checklist_items` | Items de checklists |
| `documents` | Documents i fitxers |
| `forum_categories` | Categories del forum |
| `forum_threads` | Fils de discussio |
| `forum_replies` | Respostes als fils |
| `forum_votes` | Vots (upvote/downvote) |
| `chat_rooms` | Sales de xat |
| `chat_room_members` | Membres de sales |
| `chat_messages` | Missatges de xat |
| `notifications` | Notificacions push |
| `activity_log` | Registre d'activitat |
| `calendar_events` | Esdeveniments de calendari |
| `calendar_event_attendees` | Assistents a esdeveniments |

### Rols d'Usuari
```typescript
type Role = 'admin' | 'cap_projecte' | 'operari' | 'visitant'
```

### Estats
```typescript
// Projectes
type ProjectStatus = 'planificacio' | 'en_curs' | 'pausat' | 'completat' | 'cancelat'

// Tasques
type TaskStatus = 'pendent' | 'en_curs' | 'revisio' | 'completat' | 'bloquejat'

// Prioritat
type Priority = 'baixa' | 'normal' | 'alta' | 'critica'
```

---

## 3. Autenticacio

### Mode Demo (sense DB)
Quan `DATABASE_URL` no esta configurat, el sistema usa usuaris demo:

| Email | Contrasenya | Rol |
|-------|-------------|-----|
| `admin@matepro.com` | `admin123` | admin |
| `manager@matepro.com` | `manager123` | cap_projecte |
| `operari@matepro.com` | `operari123` | operari |

### Mode Produccio (amb DB)
- Passwords hashejats amb `bcryptjs`
- Sessions a la taula `sessions` amb token JWT
- Cookie `auth_token` (httpOnly, 7 dies)

### Funcions Disponibles
```typescript
import { getSession, login, logout, requireAuth, isDemoMode } from '@/lib/auth'

// Obtenir usuari actual (server component o API route)
const user = await getSession()

// Login
const result = await login(email, password)
// { success: true, token: '...', user: {...} }

// Logout
await logout()

// Verificar permisos
const canAccess = requireAuth(['admin', 'cap_projecte'])(user)
```

---

## 4. Crear Nous Endpoints API

### Estructura
```typescript
// app/api/[recurs]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { taulaExemple } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 })
  }

  const data = await db.query.taulaExemple.findMany()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 403 })
  }

  const body = await request.json()
  // Validar i inserir...
  
  return NextResponse.json({ success: true })
}
```

---

## 5. Afegir Nova Taula

### Pas 1: Definir al Schema
```typescript
// lib/db/schema.ts
export const novaEntitat = pgTable('nova_entitat', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  descripcio: text('descripcio'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

### Pas 2: Crear Script Migracio
```javascript
// scripts/00X-nova-entitat.js
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)

await sql`
  CREATE TABLE IF NOT EXISTS nova_entitat (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    descripcio TEXT,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`
console.log('Taula creada!')
```

### Pas 3: Executar
Demana a la IA: "Executa el script scripts/00X-nova-entitat.js"

---

## 6. Queries Comunes amb Drizzle

### Select
```typescript
// Tot
const users = await db.query.users.findMany()

// Amb filtre
const admins = await db.query.users.findMany({
  where: eq(users.role, 'admin')
})

// Un sol registre
const user = await db.query.users.findFirst({
  where: eq(users.email, 'admin@matepro.com')
})

// Amb relacions
const projectsWithTasks = await db.query.projects.findMany({
  with: { tasks: true, manager: true }
})
```

### Insert
```typescript
import { nanoid } from '@/lib/nanoid'

await db.insert(users).values({
  id: nanoid(),
  email: 'nou@matepro.com',
  passwordHash: await bcrypt.hash('password', 10),
  name: 'Nou Usuari',
  role: 'operari',
})
```

### Update
```typescript
await db.update(projects)
  .set({ status: 'completat', progress: 100 })
  .where(eq(projects.id, projectId))
```

### Delete
```typescript
await db.delete(tasks).where(eq(tasks.id, taskId))
```

---

## 7. Sistema de Notificacions

### Crear Notificacio
```typescript
import { db, notifications } from '@/lib/db'
import { nanoid } from '@/lib/nanoid'

await db.insert(notifications).values({
  id: nanoid(),
  userId: targetUserId,
  type: 'task_assigned',
  title: 'Nova tasca assignada',
  message: `T'han assignat la tasca "${task.title}"`,
  link: `/tasks/${task.id}`,
  metadata: { taskId: task.id, projectId: task.projectId },
})
```

### Tipus de Notificacio
```typescript
type NotificationType = 
  | 'task_assigned' 
  | 'task_updated' 
  | 'comment' 
  | 'mention' 
  | 'deadline' 
  | 'forum_reply' 
  | 'chat_message' 
  | 'system'
```

---

## 8. Internacionalitzacio (i18n)

### Idiomes Suportats
- `ca` - Catala (per defecte)
- `en` - English
- `fr` - Francais
- `it` - Italiano
- `de` - Deutsch

### Afegir Traduccions
```typescript
// lib/i18n/translations.ts
// Afegir clau a TOTS els idiomes:

const ca = {
  // ...existing
  novaFuncio: {
    titol: 'Titol en catala',
    descripcio: 'Descripcio en catala',
  }
}

const en = {
  // ...existing
  novaFuncio: {
    titol: 'Title in English',
    descripcio: 'Description in English',
  }
}
// ... repetir per fr, it, de
```

### Usar al Component
```typescript
'use client'
import { useTranslation } from '@/lib/i18n/provider'

function Component() {
  const { t } = useTranslation()
  return <h1>{t('novaFuncio.titol')}</h1>
}
```

---

## 9. Variables d'Entorn Necessaries

| Variable | Descripcio | Requerit |
|----------|------------|----------|
| `DATABASE_URL` | Connexio Neon PostgreSQL | Si (produccio) |
| `JWT_SECRET` | Secret per tokens JWT | Recomanat |

> Si `DATABASE_URL` no existeix, l'app funciona en **mode demo** amb dades mockejades.

---

## 10. Scripts Disponibles

| Script | Descripcio |
|--------|------------|
| `scripts/migrate-neon.js` | Crea totes les taules a Neon |
| `scripts/seed-neon.js` | Insereix dades d'exemple |
| `scripts/004-neon-schema.sql` | SQL pur del schema (referencia) |
| `scripts/005-neon-seed.sql` | SQL pur del seed (referencia) |

### Com Executar (via IA)
Simplement demana:
- "Executa el script de migracio"
- "Seedeja la base de dades amb dades d'exemple"
- "Crea la taula X a la base de dades"

---

## 11. Patterns per a Noves Funcionalitats

### Nou CRUD Complet
1. Afegir taula al schema (`lib/db/schema.ts`)
2. Crear migracio (`scripts/00X-nom.js`)
3. Executar migracio
4. Crear API routes (`app/api/recurs/route.ts`)
5. Crear pagina UI (`app/(app)/recurs/page.tsx`)
6. Afegir traduccions si cal

### Nova Pagina Protegida
```typescript
// app/(app)/nova-pagina/page.tsx
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NovaPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  
  // Carregar dades de la DB
  const data = await db.query.taula.findMany()
  
  return <ClientComponent data={data} user={user} />
}
```

### Accio de Servidor (Server Action)
```typescript
'use server'
import { getSession } from '@/lib/auth'
import { db, taula } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function crearRegistre(formData: FormData) {
  const user = await getSession()
  if (!user) throw new Error('No autoritzat')
  
  await db.insert(taula).values({
    id: nanoid(),
    nom: formData.get('nom') as string,
    userId: user.id,
  })
  
  revalidatePath('/ruta')
}
```

---

## 12. Comandes per a la IA

Pots demanar directament:

### Base de Dades
- "Crea una taula per a [entitat] amb camps [x, y, z]"
- "Afegeix un camp [nom] a la taula [taula]"
- "Crea un index a [taula] pel camp [camp]"
- "Executa la migracio"
- "Seedeja dades d'exemple per a [entitat]"

### API
- "Crea un endpoint GET/POST/PUT/DELETE per a [recurs]"
- "Afegeix autenticacio a l'endpoint [ruta]"
- "Crea un endpoint per cercar [entitat] per [camp]"

### Funcionalitat
- "Afegeix notificacions quan [event]"
- "Crea un sistema de [funcionalitat]"
- "Integra [servei extern] amb [funcionalitat]"

### Traduccions
- "Afegeix traduccions per a [funcionalitat]"
- "Tradueix [text] a tots els idiomes"

---

## 13. Checklist Pre-Produccio

- [ ] `DATABASE_URL` configurat a Vercel
- [ ] `JWT_SECRET` configurat (secret fort)
- [ ] Migracions executades (`migrate-neon.js`)
- [ ] Dades inicials seedejades si cal
- [ ] Usuari admin creat a la DB real
- [ ] Variables d'entorn verificades
- [ ] Build sense errors (`npm run build`)

---

## Notes Finals

- **Sense ORM magic**: Usem Drizzle, que es type-safe i explícit
- **Serverless-first**: Neon i Vercel escalen automaticament
- **Demo mode**: L'app funciona sense DB per desenvolupament rapid
- **i18n integrat**: Tot el text UI es traduible
- **PostgreSQL natiu**: JSONB, timestamps amb timezone, transaccions ACID

> **Recorda**: L'usuari no ha de tocar codi. Tu (IA) fas tots els canvis seguint aquesta guia.
