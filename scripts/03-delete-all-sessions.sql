-- Script to delete all existing chat sessions and messages
-- Delete all messages first (foreign key constraint)
DELETE FROM chat_messages;

-- Delete all chat sessions
DELETE FROM chat_sessions;

-- Reset any auto-increment sequences if needed
-- This ensures we start fresh with clean IDs
