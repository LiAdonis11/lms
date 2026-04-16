<?php
class BookController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';
        
        $sql = "SELECT * FROM books WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)";
            $searchParam = "%{$search}%";
            $params = array_merge($params, [$searchParam, $searchParam, $searchParam]);
        }

        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $books = $stmt->fetchAll();

        jsonResponse(['books' => $books]);
    }

    public function show($id) {
        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        $book = $stmt->fetch();

        if (!$book) {
            jsonResponse(['error' => 'Book not found'], 404);
        }

        jsonResponse(['book' => $book]);
    }

    public function store() {
        $data = getJsonInput();

        if (!isset($data['title']) || !isset($data['author'])) {
            jsonResponse(['error' => 'Title and author are required'], 400);
        }

        $stmt = $this->db->prepare("INSERT INTO books (title, author, isbn, description, category, cover_image, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['author'],
            $data['isbn'] ?? null,
            $data['description'] ?? null,
            $data['category'] ?? null,
            $data['cover_image'] ?? null,
            $data['total_copies'] ?? 1,
            $data['available_copies'] ?? $data['total_copies'] ?? 1
        ]);

        $bookId = $this->db->lastInsertId();
        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch();

        jsonResponse(['book' => $book, 'message' => 'Book created successfully'], 201);
    }

    public function update($id) {
        $data = getJsonInput();

        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'Book not found'], 404);
        }

        $fields = [];
        $params = [];

        $allowedFields = ['title', 'author', 'isbn', 'description', 'category', 'cover_image', 'total_copies', 'available_copies'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $sql = "UPDATE books SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        $book = $stmt->fetch();

        jsonResponse(['book' => $book, 'message' => 'Book updated successfully']);
    }

    public function destroy($id) {
        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'Book not found'], 404);
        }

        $stmt = $this->db->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['message' => 'Book deleted successfully']);
    }
}