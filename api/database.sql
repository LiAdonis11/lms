-- Library Management System Database
-- Run this SQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    cover_image VARCHAR(255),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings table
CREATE TABLE IF NOT EXISTS borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@library.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample clients
INSERT INTO users (name, email, password, role, phone) VALUES 
('John Doe', 'john@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '555-0101'),
('Jane Smith', 'jane@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '555-0102');

-- Insert sample books
INSERT INTO books (title, author, isbn, description, category, cover_image, total_copies, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'A classic American novel about the Jazz Age', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', 5, 3),
('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'A story of racial injustice and childhood innocence', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg', 3, 2),
('1984', 'George Orwell', '978-0451524935', 'A dystopian social science fiction', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg', 4, 4),
('The Hobbit', 'J.R.R. Tolkien', '978-0547928227', 'A fantasy novel about Bilbo Baggins', 'Fantasy', 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg', 2, 2),
('Pride and Prejudice', 'Jane Austen', '978-0141439518', 'A romantic novel of manners', 'Romance', 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg', 3, 3),
('The Catcher in the Rye', 'J.D. Salinger', '978-0316769488', 'A story of teenage rebellion and alienation', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780316769488-M.jpg', 4, 1),
('Brave New World', 'Aldous Huxley', '978-0060850524', 'A dystopian novel about a futuristic society', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9780060850524-M.jpg', 3, 3),
('The Lord of the Rings', 'J.R.R. Tolkien', '978-0618640157', 'An epic fantasy adventure', 'Fantasy', 'https://covers.openlibrary.org/b/isbn/9780618640157-M.jpg', 2, 0),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', '978-0590353427', 'The first book in the Harry Potter series', 'Fantasy', 'https://covers.openlibrary.org/b/isbn/9780590353427-M.jpg', 5, 4),
('The Alchemist', 'Paulo Coelho', '978-0062315007', 'A philosophical novel about following your dreams', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg', 3, 3);