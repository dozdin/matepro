-- Update user emails from maximyachts.com to matepro.com
-- Migration 003: Update email domains

-- Update all emails from maximyachts.com to matepro.com
UPDATE users 
SET email = REPLACE(email, '@maximyachts.com', '@matepro.com')
WHERE email LIKE '%@maximyachts.com';

-- Verify the changes
SELECT id, email, name, role FROM users;
