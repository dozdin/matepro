-- MatePro Seed Data
-- Migration 002: Insert initial data

-- Insert admin user (password: admin123)
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, department, is_active, created_at, updated_at)
VALUES (
  'usr_admin_001',
  'admin@matepro.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m',
  'Administrador Sistema',
  'admin',
  'Direcció',
  1,
  unixepoch() * 1000,
  unixepoch() * 1000
);

-- Insert project manager
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, department, is_active, created_at, updated_at)
VALUES (
  'usr_pm_001',
  'jordi.garcia@matepro.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m',
  'Jordi García',
  'cap_projecte',
  'Producció',
  1,
  unixepoch() * 1000,
  unixepoch() * 1000
);

-- Insert operators
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, department, is_active, created_at, updated_at)
VALUES 
  ('usr_op_001', 'marc.puig@matepro.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Marc Puig', 'operari', 'Fusteria', 1, unixepoch() * 1000, unixepoch() * 1000),
  ('usr_op_002', 'anna.vidal@matepro.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Anna Vidal', 'operari', 'Pintura', 1, unixepoch() * 1000, unixepoch() * 1000),
  ('usr_op_003', 'pere.font@matepro.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Pere Font', 'operari', 'Electrònica', 1, unixepoch() * 1000, unixepoch() * 1000),
  ('usr_op_004', 'laura.serra@matepro.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.x8XLXK1HvM1tG5m', 'Laura Serra', 'operari', 'Fibra', 1, unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample projects
INSERT OR IGNORE INTO projects (id, name, code, description, client_name, boat_model, status, priority, start_date, estimated_end_date, progress, manager_id, created_at, updated_at)
VALUES 
  ('prj_001', 'Restauració Velero Clàssic', 'PRJ-2024-001', 'Restauració completa d''un velero clàssic de fusta de 12 metres', 'Família Martínez', 'Velero 12m', 'en_curs', 'alta', unixepoch('2024-01-15') * 1000, unixepoch('2024-06-30') * 1000, 45.5, 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000),
  ('prj_002', 'Construcció Iot Luxe 18m', 'PRJ-2024-002', 'Nova construcció d''un iot de luxe personalitzat de 18 metres', 'Sr. Johnson', 'Custom Yacht 18m', 'planificacio', 'critica', unixepoch('2024-03-01') * 1000, unixepoch('2025-03-01') * 1000, 10.0, 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000),
  ('prj_003', 'Manteniment Anual Flota', 'PRJ-2024-003', 'Manteniment preventiu de la flota de lloguer', 'Club Nàutic Barcelona', 'Diversos', 'en_curs', 'normal', unixepoch('2024-02-01') * 1000, unixepoch('2024-04-30') * 1000, 75.0, 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000),
  ('prj_004', 'Reparació Motor Diesel', 'PRJ-2024-004', 'Reparació urgent del sistema de propulsió', 'Pescadors de Blanes', 'Llaüt 8m', 'completat', 'alta', unixepoch('2024-01-10') * 1000, unixepoch('2024-02-15') * 1000, 100.0, 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample tasks for project 1
INSERT OR IGNORE INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position, created_at, updated_at)
VALUES 
  ('tsk_001', 'prj_001', 'Desmuntatge de la coberta', 'Retirar tots els elements de la coberta per avaluació', 'completat', 'alta', 'usr_op_001', 24, unixepoch('2024-01-25') * 1000, 0, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_002', 'prj_001', 'Reparació estructural del casc', 'Reparar les zones afectades del casc de fusta', 'en_curs', 'critica', 'usr_op_001', 80, unixepoch('2024-03-15') * 1000, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_003', 'prj_001', 'Tractament anti-corrosió', 'Aplicar tractament a totes les parts metàl·liques', 'pendent', 'alta', 'usr_op_002', 32, unixepoch('2024-04-01') * 1000, 2, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_004', 'prj_001', 'Pintura exterior', 'Preparació i pintura de l''exterior del casc', 'pendent', 'normal', 'usr_op_002', 48, unixepoch('2024-05-15') * 1000, 3, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_005', 'prj_001', 'Instal·lació electrònica', 'Instal·lar nous sistemes de navegació i comunicació', 'pendent', 'normal', 'usr_op_003', 40, unixepoch('2024-06-01') * 1000, 4, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_006', 'prj_001', 'Muntatge final coberta', 'Reinstal·lar i acabar la coberta', 'pendent', 'normal', 'usr_op_001', 32, unixepoch('2024-06-20') * 1000, 5, unixepoch() * 1000, unixepoch() * 1000);

-- Insert tasks for project 2
INSERT OR IGNORE INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position, created_at, updated_at)
VALUES 
  ('tsk_007', 'prj_002', 'Disseny i plànols', 'Finalitzar els plànols tècnics amb el client', 'en_curs', 'critica', 'usr_pm_001', 120, unixepoch('2024-04-15') * 1000, 0, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_008', 'prj_002', 'Construcció motlle casc', 'Fabricar el motlle per al casc de fibra', 'pendent', 'alta', 'usr_op_004', 200, unixepoch('2024-06-01') * 1000, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_009', 'prj_002', 'Laminat del casc', 'Laminat i curat del casc en fibra de carboni', 'pendent', 'alta', 'usr_op_004', 300, unixepoch('2024-09-01') * 1000, 2, unixepoch() * 1000, unixepoch() * 1000);

-- Insert tasks for project 3
INSERT OR IGNORE INTO tasks (id, project_id, title, description, status, priority, assignee_id, estimated_hours, due_date, position, created_at, updated_at)
VALUES 
  ('tsk_010', 'prj_003', 'Revisió motors vaixell 1', 'Manteniment complet del motor', 'completat', 'normal', 'usr_op_003', 8, unixepoch('2024-02-10') * 1000, 0, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_011', 'prj_003', 'Revisió motors vaixell 2', 'Manteniment complet del motor', 'completat', 'normal', 'usr_op_003', 8, unixepoch('2024-02-15') * 1000, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_012', 'prj_003', 'Neteja i pintura cascs', 'Neteja antifouling i repintat', 'en_curs', 'normal', 'usr_op_002', 24, unixepoch('2024-03-01') * 1000, 2, unixepoch() * 1000, unixepoch() * 1000),
  ('tsk_013', 'prj_003', 'Revisió equips seguretat', 'Verificar i substituir equips de seguretat caducats', 'pendent', 'alta', 'usr_op_001', 16, unixepoch('2024-04-15') * 1000, 3, unixepoch() * 1000, unixepoch() * 1000);

-- Insert forum categories
INSERT OR IGNORE INTO forum_categories (id, name, description, slug, color, icon, position, created_at)
VALUES 
  ('cat_001', 'Anuncis', 'Comunicats oficials i novetats de l''empresa', 'anuncis', '#ef4444', 'megaphone', 0, unixepoch() * 1000),
  ('cat_002', 'Tècnic', 'Discussions tècniques sobre construcció i reparació', 'tecnic', '#3b82f6', 'wrench', 1, unixepoch() * 1000),

-- Insert sample forum threads
INSERT OR IGNORE INTO forum_threads (id, category_id, author_id, title, content, is_pinned, view_count, reply_count, created_at, updated_at)
VALUES 
  ('thr_001', 'cat_001', 'usr_admin_001', 'Benvinguts al nou sistema de comunicació', 'Us presentem el nou fòrum intern de MatePro. Aquí podreu compartir coneixements, fer preguntes i mantenir-vos informats de les novetats.', 1, 45, 3, unixepoch() * 1000, unixepoch() * 1000),
  ('thr_002', 'cat_002', 'usr_pm_001', 'Millors pràctiques per al laminat de fibra de carboni', 'Comparteixo algunes tècniques que hem anat perfeccionant per al laminat de fibra de carboni en cascos de iots.', 0, 32, 5, unixepoch() * 1000, unixepoch() * 1000),
  ('thr_003', 'cat_003', 'usr_admin_001', 'Actualització protocol EPIs', 'Recordeu que a partir d''aquest mes és obligatori l''ús de mascaretes FFP2 durant els treballs de pintura i laminat.', 1, 28, 2, unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample forum replies
INSERT OR IGNORE INTO forum_replies (id, thread_id, author_id, content, upvotes, created_at, updated_at)
VALUES 
  ('rep_001', 'thr_001', 'usr_op_001', 'Excel·lent iniciativa! Ja era hora de tenir un espai així.', 5, unixepoch() * 1000, unixepoch() * 1000),
  ('rep_002', 'thr_002', 'usr_op_004', 'Molt útil la informació, especialment la part de la temperatura de curat.', 8, unixepoch() * 1000, unixepoch() * 1000),
  ('rep_003', 'thr_002', 'usr_pm_001', 'Gràcies pel feedback! Afegeixo que també és important controlar la humitat.', 3, unixepoch() * 1000, unixepoch() * 1000);

-- Insert chat rooms
INSERT OR IGNORE INTO chat_rooms (id, name, description, type, project_id, created_by_id, created_at, updated_at)
VALUES 
  ('room_001', 'General', 'Canal general de l''astillero', 'public', NULL, 'usr_admin_001', unixepoch() * 1000, unixepoch() * 1000),
  ('room_002', 'Velero Clàssic - Equip', 'Comunicació de l''equip del projecte de restauració', 'private', 'prj_001', 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000),
  ('room_003', 'Caps de Projecte', 'Canal privat per a caps de projecte', 'private', NULL, 'usr_admin_001', unixepoch() * 1000, unixepoch() * 1000);

-- Insert chat room members
INSERT OR IGNORE INTO chat_room_members (id, room_id, user_id, role, joined_at)
VALUES 
  ('mem_001', 'room_001', 'usr_admin_001', 'admin', unixepoch() * 1000),
  ('mem_002', 'room_001', 'usr_pm_001', 'member', unixepoch() * 1000),
  ('mem_003', 'room_001', 'usr_op_001', 'member', unixepoch() * 1000),
  ('mem_004', 'room_001', 'usr_op_002', 'member', unixepoch() * 1000),
  ('mem_005', 'room_002', 'usr_pm_001', 'admin', unixepoch() * 1000),
  ('mem_006', 'room_002', 'usr_op_001', 'member', unixepoch() * 1000),
  ('mem_007', 'room_002', 'usr_op_002', 'member', unixepoch() * 1000);

-- Insert sample chat messages
INSERT OR IGNORE INTO chat_messages (id, room_id, sender_id, content, message_type, created_at, updated_at)
VALUES 
  ('msg_001', 'room_001', 'usr_admin_001', 'Bon dia a tothom! Benvinguts al nou sistema de xat.', 'text', unixepoch() * 1000, unixepoch() * 1000),
  ('msg_002', 'room_001', 'usr_pm_001', 'Perfecte! Això facilitarà molt la comunicació.', 'text', unixepoch() * 1000, unixepoch() * 1000),
  ('msg_003', 'room_002', 'usr_pm_001', 'Equip, recordeu que demà tenim reunió a les 9h per revisar l''estat del casc.', 'text', unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample calendar events
INSERT OR IGNORE INTO calendar_events (id, title, description, start_date, end_date, all_day, type, project_id, created_by_id, color, created_at, updated_at)
VALUES 
  ('evt_001', 'Reunió setmanal d''equip', 'Revisió de l''estat dels projectes', unixepoch('2024-03-18 09:00') * 1000, unixepoch('2024-03-18 10:00') * 1000, 0, 'reunio', NULL, 'usr_pm_001', '#3b82f6', unixepoch() * 1000, unixepoch() * 1000),
  ('evt_002', 'Entrega Velero Clàssic', 'Data prevista d''entrega del projecte', unixepoch('2024-06-30') * 1000, unixepoch('2024-06-30') * 1000, 1, 'entrega', 'prj_001', 'usr_pm_001', '#f97316', unixepoch() * 1000, unixepoch() * 1000),
  ('evt_003', 'Revisió de seguretat', 'Inspecció mensual d''equips i instal·lacions', unixepoch('2024-03-22 14:00') * 1000, unixepoch('2024-03-22 16:00') * 1000, 0, 'revisio', NULL, 'usr_admin_001', '#8b5cf6', unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample checklists
INSERT OR IGNORE INTO checklists (id, project_id, task_id, name, description, created_by_id, created_at, updated_at)
VALUES 
  ('chk_001', 'prj_001', 'tsk_002', 'Punts de reparació casc', 'Llista de verificació per a la reparació estructural', 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000),
  ('chk_002', 'prj_003', NULL, 'Checklist manteniment motors', 'Verificacions estàndard per al manteniment de motors', 'usr_pm_001', unixepoch() * 1000, unixepoch() * 1000);

-- Insert sample checklist items
INSERT OR IGNORE INTO checklist_items (id, checklist_id, content, is_completed, completed_by_id, completed_at, position, created_at)
VALUES 
  ('chi_001', 'chk_001', 'Identificar totes les zones afectades', 1, 'usr_op_001', unixepoch() * 1000, 0, unixepoch() * 1000),
  ('chi_002', 'chk_001', 'Documentar amb fotografies', 1, 'usr_op_001', unixepoch() * 1000, 1, unixepoch() * 1000),
  ('chi_003', 'chk_001', 'Retirar material danyat', 1, 'usr_op_001', unixepoch() * 1000, 2, unixepoch() * 1000),
  ('chi_004', 'chk_001', 'Preparar superfícies', 0, NULL, NULL, 3, unixepoch() * 1000),
  ('chi_005', 'chk_001', 'Aplicar resina epoxy', 0, NULL, NULL, 4, unixepoch() * 1000),
  ('chi_006', 'chk_001', 'Verificar curat complet', 0, NULL, NULL, 5, unixepoch() * 1000),
  ('chi_007', 'chk_002', 'Comprovar nivell d''oli', 1, 'usr_op_003', unixepoch() * 1000, 0, unixepoch() * 1000),
  ('chi_008', 'chk_002', 'Revisar filtres', 1, 'usr_op_003', unixepoch() * 1000, 1, unixepoch() * 1000),
  ('chi_009', 'chk_002', 'Comprovar corretges', 0, NULL, NULL, 2, unixepoch() * 1000),
  ('chi_010', 'chk_002', 'Verificar sistema refrigeració', 0, NULL, NULL, 3, unixepoch() * 1000);

-- Insert sample notifications
INSERT OR IGNORE INTO notifications (id, user_id, type, title, message, link, is_read, created_at)
VALUES 
  ('not_001', 'usr_op_001', 'task_assigned', 'Nova tasca assignada', 'Se t''ha assignat la tasca "Reparació estructural del casc"', '/projects/prj_001/tasks/tsk_002', 0, unixepoch() * 1000),
  ('not_002', 'usr_op_002', 'deadline', 'Termini proper', 'La tasca "Tractament anti-corrosió" venç en 5 dies', '/projects/prj_001/tasks/tsk_003', 0, unixepoch() * 1000),
  ('not_003', 'usr_pm_001', 'forum_reply', 'Nova resposta al fòrum', 'Marc Puig ha respost al teu fil sobre laminat de fibra', '/forum/threads/thr_002', 1, unixepoch() * 1000);
