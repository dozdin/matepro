-- MatePro Seed Data (PostgreSQL / Neon)
-- Migration 005: Insert initial data on Neon Postgres

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, department, is_active)
VALUES (
  'usr_admin_001',
  'admin@matepro.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m',
  'Administrador Sistema',
  'admin',
  'Direcció',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Insert project manager
INSERT INTO users (id, email, password_hash, name, role, department, is_active)
VALUES (
  'usr_pm_001',
  'jordi.garcia@matepro.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m',
  'Jordi García',
  'cap_projecte',
  'Producció',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Insert operators
INSERT INTO users (id, email, password_hash, name, role, department, is_active)
VALUES
  ('usr_op_001', 'marc.puig@matepro.com',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Marc Puig',   'operari', 'Fusteria',    TRUE),
  ('usr_op_002', 'anna.vidal@matepro.com',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Anna Vidal',  'operari', 'Pintura',     TRUE),
  ('usr_op_003', 'pere.font@matepro.com',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Pere Font',   'operari', 'Electrònica', TRUE),
  ('usr_op_004', 'laura.serra@matepro.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Laura Serra', 'operari', 'Fibra',       TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, code, description, client_name, boat_model, status, priority, start_date, estimated_end_date, progress, manager_id)
VALUES
  ('prj_001', 'Restauració Velero Clàssic',   'PRJ-2024-001', 'Restauració completa d''un velero clàssic de fusta de 12 metres', 'Família Martínez',       'Velero 12m',       'en_curs',       'alta',    TIMESTAMPTZ '2024-01-15', TIMESTAMPTZ '2024-06-30', 45.5,  'usr_pm_001'),
  ('prj_002', 'Construcció Iot Luxe 18m',     'PRJ-2024-002', 'Nova construcció d''un iot de luxe personalitzat de 18 metres',    'Sr. Johnson',            'Custom Yacht 18m', 'planificacio',  'critica', TIMESTAMPTZ '2024-03-01', TIMESTAMPTZ '2025-03-01', 10.0,  'usr_pm_001'),
  ('prj_003', 'Manteniment Anual Flota',      'PRJ-2024-003', 'Manteniment preventiu de la flota de lloguer',                     'Club Nàutic Barcelona',  'Diversos',         'en_curs',       'normal',  TIMESTAMPTZ '2024-02-01', TIMESTAMPTZ '2024-04-30', 75.0,  'usr_pm_001'),
  ('prj_004', 'Reparació Motor Diesel',       'PRJ-2024-004', 'Reparació urgent del sistema de propulsió',                        'Pescadors de Blanes',    'Llaüt 8m',         'completat',     'alta',    TIMESTAMPTZ '2024-01-10', TIMESTAMPTZ '2024-02-15', 100.0, 'usr_pm_001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for project 1
INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position)
VALUES
  ('tsk_001', 'prj_001', 'Desmuntatge de la coberta',      'Retirar tots els elements de la coberta per avaluació',     'completat', 'alta',    'usr_op_001', 24, TIMESTAMPTZ '2024-01-25', 0),
  ('tsk_002', 'prj_001', 'Reparació estructural del casc', 'Reparar les zones afectades del casc de fusta',             'en_curs',   'critica', 'usr_op_001', 80, TIMESTAMPTZ '2024-03-15', 1),
  ('tsk_003', 'prj_001', 'Tractament anti-corrosió',       'Aplicar tractament a totes les parts metàl·liques',         'pendent',   'alta',    'usr_op_002', 32, TIMESTAMPTZ '2024-04-01', 2),
  ('tsk_004', 'prj_001', 'Pintura exterior',               'Preparació i pintura de l''exterior del casc',              'pendent',   'normal',  'usr_op_002', 48, TIMESTAMPTZ '2024-05-15', 3),
  ('tsk_005', 'prj_001', 'Instal·lació electrònica',       'Instal·lar nous sistemes de navegació i comunicació',       'pendent',   'normal',  'usr_op_003', 40, TIMESTAMPTZ '2024-06-01', 4),
  ('tsk_006', 'prj_001', 'Muntatge final coberta',         'Reinstal·lar i acabar la coberta',                          'pendent',   'normal',  'usr_op_001', 32, TIMESTAMPTZ '2024-06-20', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert tasks for project 2
INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position)
VALUES
  ('tsk_007', 'prj_002', 'Disseny i plànols',        'Finalitzar els plànols tècnics amb el client',         'en_curs', 'critica', 'usr_pm_001', 120, TIMESTAMPTZ '2024-04-15', 0),
  ('tsk_008', 'prj_002', 'Construcció motlle casc',  'Fabricar el motlle per al casc de fibra',              'pendent', 'alta',    'usr_op_004', 200, TIMESTAMPTZ '2024-06-01', 1),
  ('tsk_009', 'prj_002', 'Laminat del casc',         'Laminat i curat del casc en fibra de carboni',         'pendent', 'alta',    'usr_op_004', 300, TIMESTAMPTZ '2024-09-01', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert tasks for project 3
INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position)
VALUES
  ('tsk_010', 'prj_003', 'Revisió motors vaixell 1', 'Manteniment complet del motor',                     'completat', 'normal', 'usr_op_003',  8, TIMESTAMPTZ '2024-02-10', 0),
  ('tsk_011', 'prj_003', 'Revisió motors vaixell 2', 'Manteniment complet del motor',                     'completat', 'normal', 'usr_op_003',  8, TIMESTAMPTZ '2024-02-15', 1),
  ('tsk_012', 'prj_003', 'Neteja i pintura cascs',   'Neteja antifouling i repintat',                     'en_curs',   'normal', 'usr_op_002', 24, TIMESTAMPTZ '2024-03-01', 2),
  ('tsk_013', 'prj_003', 'Revisió equips seguretat', 'Verificar i substituir equips de seguretat caducats','pendent',  'alta',   'usr_op_001', 16, TIMESTAMPTZ '2024-04-15', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert forum categories
INSERT INTO forum_categories (id, name, description, slug, color, icon, position)
VALUES
  ('cat_001', 'Anuncis',    'Comunicats oficials i novetats de l''empresa',    'anuncis',    '#ef4444', 'megaphone',   0),
  ('cat_002', 'Tècnic',     'Discussions tècniques sobre construcció i reparació', 'tecnic', '#3b82f6', 'wrench',      1),
  ('cat_003', 'Seguretat',  'Protocols, normatives i avisos de seguretat',      'seguretat', '#8b5cf6', 'shield',      2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample forum threads
INSERT INTO forum_threads (id, category_id, author_id, title, content, is_pinned, view_count, reply_count)
VALUES
  ('thr_001', 'cat_001', 'usr_admin_001', 'Benvinguts al nou sistema de comunicació',            'Us presentem el nou fòrum intern de MatePro. Aquí podreu compartir coneixements, fer preguntes i mantenir-vos informats de les novetats.', TRUE,  45, 3),
  ('thr_002', 'cat_002', 'usr_pm_001',    'Millors pràctiques per al laminat de fibra de carboni','Comparteixo algunes tècniques que hem anat perfeccionant per al laminat de fibra de carboni en cascos de iots.',                      FALSE, 32, 5),
  ('thr_003', 'cat_003', 'usr_admin_001', 'Actualització protocol EPIs',                         'Recordeu que a partir d''aquest mes és obligatori l''ús de mascaretes FFP2 durant els treballs de pintura i laminat.',                     TRUE,  28, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample forum replies
INSERT INTO forum_replies (id, thread_id, author_id, content, upvotes)
VALUES
  ('rep_001', 'thr_001', 'usr_op_001', 'Excel·lent iniciativa! Ja era hora de tenir un espai així.',                     5),
  ('rep_002', 'thr_002', 'usr_op_004', 'Molt útil la informació, especialment la part de la temperatura de curat.',       8),
  ('rep_003', 'thr_002', 'usr_pm_001', 'Gràcies pel feedback! Afegeixo que també és important controlar la humitat.',     3)
ON CONFLICT (id) DO NOTHING;

-- Insert chat rooms
INSERT INTO chat_rooms (id, name, description, type, project_id, created_by_id)
VALUES
  ('room_001', 'General',                   'Canal general de l''astillero',                                'public',  NULL,       'usr_admin_001'),
  ('room_002', 'Velero Clàssic - Equip',    'Comunicació de l''equip del projecte de restauració',          'private', 'prj_001',  'usr_pm_001'),
  ('room_003', 'Caps de Projecte',          'Canal privat per a caps de projecte',                          'private', NULL,       'usr_admin_001')
ON CONFLICT (id) DO NOTHING;

-- Insert chat room members
INSERT INTO chat_room_members (id, room_id, user_id, role)
VALUES
  ('mem_001', 'room_001', 'usr_admin_001', 'admin'),
  ('mem_002', 'room_001', 'usr_pm_001',    'member'),
  ('mem_003', 'room_001', 'usr_op_001',    'member'),
  ('mem_004', 'room_001', 'usr_op_002',    'member'),
  ('mem_005', 'room_002', 'usr_pm_001',    'admin'),
  ('mem_006', 'room_002', 'usr_op_001',    'member'),
  ('mem_007', 'room_002', 'usr_op_002',    'member')
ON CONFLICT (id) DO NOTHING;

-- Insert sample chat messages
INSERT INTO chat_messages (id, room_id, sender_id, content, message_type)
VALUES
  ('msg_001', 'room_001', 'usr_admin_001', 'Bon dia a tothom! Benvinguts al nou sistema de xat.',                                                     'text'),
  ('msg_002', 'room_001', 'usr_pm_001',    'Perfecte! Això facilitarà molt la comunicació.',                                                           'text'),
  ('msg_003', 'room_002', 'usr_pm_001',    'Equip, recordeu que demà tenim reunió a les 9h per revisar l''estat del casc.',                            'text')
ON CONFLICT (id) DO NOTHING;

-- Insert sample calendar events
INSERT INTO calendar_events (id, title, description, start_date, end_date, all_day, type, project_id, created_by_id, color)
VALUES
  ('evt_001', 'Reunió setmanal d''equip',  'Revisió de l''estat dels projectes',                TIMESTAMPTZ '2024-03-18 09:00+00', TIMESTAMPTZ '2024-03-18 10:00+00', FALSE, 'reunio',  NULL,      'usr_pm_001',    '#3b82f6'),
  ('evt_002', 'Entrega Velero Clàssic',    'Data prevista d''entrega del projecte',             TIMESTAMPTZ '2024-06-30',          TIMESTAMPTZ '2024-06-30',          TRUE,  'entrega', 'prj_001', 'usr_pm_001',    '#f97316'),
  ('evt_003', 'Revisió de seguretat',      'Inspecció mensual d''equips i instal·lacions',      TIMESTAMPTZ '2024-03-22 14:00+00', TIMESTAMPTZ '2024-03-22 16:00+00', FALSE, 'revisio', NULL,      'usr_admin_001', '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Insert sample checklists
INSERT INTO checklists (id, project_id, task_id, name, description, created_by_id)
VALUES
  ('chk_001', 'prj_001', 'tsk_002', 'Punts de reparació casc',       'Llista de verificació per a la reparació estructural', 'usr_pm_001'),
  ('chk_002', 'prj_003', NULL,      'Checklist manteniment motors',  'Verificacions estàndard per al manteniment de motors', 'usr_pm_001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample checklist items
INSERT INTO checklist_items (id, checklist_id, content, is_completed, completed_by_id, completed_at, position)
VALUES
  ('chi_001', 'chk_001', 'Identificar totes les zones afectades', TRUE,  'usr_op_001', NOW(), 0),
  ('chi_002', 'chk_001', 'Documentar amb fotografies',            TRUE,  'usr_op_001', NOW(), 1),
  ('chi_003', 'chk_001', 'Retirar material danyat',               TRUE,  'usr_op_001', NOW(), 2),
  ('chi_004', 'chk_001', 'Preparar superfícies',                  FALSE, NULL,          NULL,  3),
  ('chi_005', 'chk_001', 'Aplicar resina epoxy',                  FALSE, NULL,          NULL,  4),
  ('chi_006', 'chk_001', 'Verificar curat complet',               FALSE, NULL,          NULL,  5),
  ('chi_007', 'chk_002', 'Comprovar nivell d''oli',               TRUE,  'usr_op_003', NOW(), 0),
  ('chi_008', 'chk_002', 'Revisar filtres',                       TRUE,  'usr_op_003', NOW(), 1),
  ('chi_009', 'chk_002', 'Comprovar corretges',                   FALSE, NULL,          NULL,  2),
  ('chi_010', 'chk_002', 'Verificar sistema refrigeració',        FALSE, NULL,          NULL,  3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, user_id, type, title, message, link, is_read)
VALUES
  ('not_001', 'usr_op_001', 'task_assigned', 'Nova tasca assignada',    'Se t''ha assignat la tasca "Reparació estructural del casc"',  '/projects/prj_001/tasks/tsk_002', FALSE),
  ('not_002', 'usr_op_002', 'deadline',      'Termini proper',          'La tasca "Tractament anti-corrosió" venç en 5 dies',           '/projects/prj_001/tasks/tsk_003', FALSE),
  ('not_003', 'usr_pm_001', 'forum_reply',   'Nova resposta al fòrum',  'Marc Puig ha respost al teu fil sobre laminat de fibra',       '/forum/threads/thr_002',          TRUE)
ON CONFLICT (id) DO NOTHING;
