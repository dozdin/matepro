import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function seedDatabase() {
  try {
    console.log('[v0] Starting Neon database seeding...')

    // Insert demo users with @matepro.com domain
    await sql`
      INSERT INTO users (id, email, password_hash, name, role, department) VALUES
        ('demo-admin', 'admin@matepro.com', 'hashed_admin123', 'Carlos Martinez', 'admin', 'Direccion'),
        ('demo-manager', 'manager@matepro.com', 'hashed_manager123', 'Ana Garcia', 'cap_projecte', 'Proyectos'),
        ('demo-operari', 'operari@matepro.com', 'hashed_operari123', 'Miguel Torres', 'operari', 'Produccion')
      ON CONFLICT (email) DO NOTHING
    `
    console.log('[v0] Inserted demo users')

    // Insert sample projects
    await sql`
      INSERT INTO projects (id, name, code, client_name, status, budget, manager_id) VALUES
        ('proj-001', 'Construcción Yate Luxury', 'YLX-2024', 'MaxiYachts International', 'en_curs', 850000.00, 'demo-manager'),
        ('proj-002', 'Reforma Interior Catamarán', 'CAT-2024', 'SeaVentures', 'completat', 120000.00, 'demo-manager'),
        ('proj-003', 'Sistema Navegación Avanzado', 'NAV-2024', 'TechYachts', 'planificacio', 75000.00, 'demo-manager')
      ON CONFLICT (id) DO NOTHING
    `
    console.log('[v0] Inserted sample projects')

    // Insert sample tasks
    await sql`
      INSERT INTO tasks (id, project_id, title, priority, status, assignee_id, due_date, progress) VALUES
        ('task-001', 'proj-001', 'Diseño de planos estructurales', 'alta', 'en_progres', 'demo-operari', '2024-05-15', 75),
        ('task-002', 'proj-001', 'Compra de materiales principales', 'alta', 'completada', 'demo-operari', '2024-04-20', 100),
        ('task-003', 'proj-001', 'Ensamblaje del casco', 'media', 'pendente', 'demo-manager', '2024-06-30', 0),
        ('task-004', 'proj-002', 'Instalación de acabados', 'media', 'completada', 'demo-operari', '2024-03-15', 100),
        ('task-005', 'proj-003', 'Programación sistemas GPS', 'alta', 'pendente', 'demo-manager', '2024-07-01', 0)
      ON CONFLICT (id) DO NOTHING
    `
    console.log('[v0] Inserted sample tasks')

    // Insert sample forum posts
    await sql`
      INSERT INTO forum_posts (id, project_id, author_id, title, content) VALUES
        ('post-001', 'proj-001', 'demo-manager', 'Actualización de cronograma', 'Se ha reprogramado la entrega de materiales para la semana del 15 de mayo.'),
        ('post-002', 'proj-001', 'demo-operari', 'Pregunta sobre especificaciones', 'Necesito aclaración sobre las dimensiones del compartimiento principal.'),
        ('post-003', 'proj-002', 'demo-manager', 'Proyecto completado', 'Felicidades al equipo por finalizar exitosamente la reforma interior.')
      ON CONFLICT (id) DO NOTHING
    `
    console.log('[v0] Inserted sample forum posts')

    // Insert sample chat messages
    await sql`
      INSERT INTO chat_messages (id, room_id, user_id, content) VALUES
        ('msg-001', 'proj-001-general', 'demo-manager', '¡Hola equipo! Bienvenidos al proyecto YLX-2024'),
        ('msg-002', 'proj-001-general', 'demo-operari', 'Listo para comenzar. ¿Cuáles son los próximos pasos?'),
        ('msg-003', 'proj-001-general', 'demo-manager', 'Empezaremos con la revisión de planos el lunes.')
      ON CONFLICT (id) DO NOTHING
    `
    console.log('[v0] Inserted sample chat messages')

    // Insert sample calendar events
    await sql`
      INSERT INTO calendar_events (id, title, start_at, end_at, user_id, project_id, type) VALUES
        ('evt-001', 'Reunión de kickoff YLX-2024', '2024-05-08 09:00:00', '2024-05-08 11:00:00', 'demo-manager', 'proj-001', 'meeting'),
        ('evt-002', 'Revisión de estructuras', '2024-05-15 14:00:00', '2024-05-15 16:00:00', 'demo-manager', 'proj-001', 'milestone'),
        ('evt-003', 'Entrega de materiales', '2024-05-20 08:00:00', '2024-05-20 18:00:00', 'demo-operari', 'proj-001', 'delivery')
      ON CONFLICT (id) DO NOTHING
    `
    console.log('[v0] Inserted sample calendar events')

    console.log('[v0] ✓ Database seeding completed successfully!')
  } catch (error) {
    console.error('[v0] Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
