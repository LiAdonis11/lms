<?php
class BorrowingController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $user = getAuthUser();
        
        $stmt = $this->db->prepare("SELECT b.*, br.id as borrowing_id, br.borrow_date, br.due_date, br.return_date, br.status as borrowing_status 
            FROM borrowings br 
            JOIN books b ON br.book_id = b.id 
            WHERE br.user_id = ? 
            ORDER BY br.borrow_date DESC");
        $stmt->execute([$user['id']]);
        $borrowings = $stmt->fetchAll();

        $this->updateOverdueStatus($user['id']);

        jsonResponse(['borrowings' => $borrowings]);
    }

    public function adminIndex() {
        $status = $_GET['status'] ?? '';
        
        $sql = "SELECT br.*, b.title as book_title, b.author as book_author, u.name as user_name, u.email as user_email 
            FROM borrowings br 
            JOIN books b ON br.book_id = b.id 
            JOIN users u ON br.user_id = u.id 
            WHERE 1=1";
        $params = [];

        if ($status) {
            $sql .= " AND br.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY br.borrow_date DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $borrowings = $stmt->fetchAll();

        $this->updateAllOverdueStatus();

        jsonResponse(['borrowings' => $borrowings]);
    }

    public function create($user) {
        $data = getJsonInput();

        if (!isset($data['book_id'])) {
            jsonResponse(['error' => 'Book ID is required'], 400);
        }

        $stmt = $this->db->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$data['book_id']]);
        $book = $stmt->fetch();

        if (!$book) {
            jsonResponse(['error' => 'Book not found'], 404);
        }

        if ($book['available_copies'] <= 0) {
            jsonResponse(['error' => 'Book not available'], 400);
        }

        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM borrowings WHERE user_id = ? AND status IN ('borrowed', 'overdue')");
        $stmt->execute([$user['id']]);
        $activeBorrowings = $stmt->fetch();

        if ($activeBorrowings['count'] >= 5) {
            jsonResponse(['error' => 'You have reached the maximum number of borrowed books (5)'], 400);
        }

        $borrowDate = date('Y-m-d');
        $dueDate = date('Y-m-d', strtotime('+14 days'));

        $stmt = $this->db->prepare("INSERT INTO borrowings (user_id, book_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, 'borrowed')");
        $stmt->execute([$user['id'], $data['book_id'], $borrowDate, $dueDate]);

        $stmt = $this->db->prepare("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?");
        $stmt->execute([$data['book_id']]);

        $borrowingId = $this->db->lastInsertId();
        $stmt = $this->db->prepare("SELECT br.*, b.title, b.author FROM borrowings br JOIN books b ON br.book_id = b.id WHERE br.id = ?");
        $stmt->execute([$borrowingId]);
        $borrowing = $stmt->fetch();

        jsonResponse(['borrowing' => $borrowing, 'message' => 'Book borrowed successfully'], 201);
    }

    public function returnBook($id) {
        $user = getAuthUser();
        
        $stmt = $this->db->prepare("SELECT * FROM borrowings WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        $borrowing = $stmt->fetch();

        if (!$borrowing) {
            jsonResponse(['error' => 'Borrowing not found'], 404);
        }

        if ($borrowing['status'] === 'returned') {
            jsonResponse(['error' => 'Book already returned'], 400);
        }

        $returnDate = date('Y-m-d');
        $stmt = $this->db->prepare("UPDATE borrowings SET return_date = ?, status = 'returned' WHERE id = ?");
        $stmt->execute([$returnDate, $id]);

        $stmt = $this->db->prepare("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?");
        $stmt->execute([$borrowing['book_id']]);

        jsonResponse(['message' => 'Book returned successfully']);
    }

    public function adminUpdate($id) {
        $data = getJsonInput();

        $stmt = $this->db->prepare("SELECT * FROM borrowings WHERE id = ?");
        $stmt->execute([$id]);
        $borrowing = $stmt->fetch();

        if (!$borrowing) {
            jsonResponse(['error' => 'Borrowing not found'], 404);
        }

        if (isset($data['status'])) {
            $stmt = $this->db->prepare("UPDATE borrowings SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $id]);

            if ($data['status'] === 'returned' && $borrowing['status'] !== 'returned') {
                $stmt = $this->db->prepare("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?");
                $stmt->execute([$borrowing['book_id']]);
            }
        }

        $stmt = $this->db->prepare("SELECT br.*, b.title, b.author, u.name as user_name FROM borrowings br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id WHERE br.id = ?");
        $stmt->execute([$id]);
        $borrowing = $stmt->fetch();

        jsonResponse(['borrowing' => $borrowing, 'message' => 'Borrowing updated successfully']);
    }

    private function updateOverdueStatus($userId) {
        $today = date('Y-m-d');
        $stmt = $this->db->prepare("UPDATE borrowings SET status = 'overdue' WHERE user_id = ? AND status = 'borrowed' AND due_date < ?");
        $stmt->execute([$userId, $today]);
    }

    private function updateAllOverdueStatus() {
        $today = date('Y-m-d');
        $stmt = $this->db->prepare("UPDATE borrowings SET status = 'overdue' WHERE status = 'borrowed' AND due_date < ?");
        $stmt->execute([$today]);
    }
}