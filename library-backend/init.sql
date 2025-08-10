-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    year_of_publication INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_deleted_at ON books(deleted_at);

-- Insert some sample data
INSERT INTO books (isbn, title, author, publisher, year_of_publication, category, image_url) VALUES
('9780134190440', 'The Go Programming Language', 'Alan Donovan', 'Addison-Wesley', 2015, 'Programming', 'https://example.com/go-book.jpg'),
('9780135957059', 'The Pragmatic Programmer', 'David Thomas', 'Addison-Wesley', 2019, 'Programming', 'https://example.com/pragmatic-programmer.jpg'),
('9780134052199', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'Programming', 'https://example.com/clean-code.jpg')
ON CONFLICT (isbn) DO NOTHING;