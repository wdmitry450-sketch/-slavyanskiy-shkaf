-- Languages support
ALTER TABLE users ADD COLUMN native_language TEXT;
ALTER TABLE users ADD COLUMN additional_languages TEXT;

-- Order attachments
ALTER TABLE orders ADD COLUMN attachments TEXT;

-- Profile avatar and portfolio
ALTER TABLE users ADD COLUMN avatar_url TEXT;
