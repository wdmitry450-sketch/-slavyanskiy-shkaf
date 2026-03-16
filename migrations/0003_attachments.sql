-- Add attachments field to messages
ALTER TABLE messages ADD COLUMN attachments TEXT;
-- attachments stores JSON: [{"type":"image","url":"/api/media/abc123.jpg","name":"photo.jpg"}]
