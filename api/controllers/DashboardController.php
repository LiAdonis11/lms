<?php
class DashboardController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM books");
        $totalBooks = $stmt->fetch();

        $stmt = $this->db->query("SELECT COUNT(*) as count FROM users WHERE role = 'client'");
        $totalUsers = $stmt->fetch();

        $stmt = $this->db->query("SELECT COUNT(*) as count FROM borrowings WHERE status = 'borrowed'");
        $activeBorrowings = $stmt->fetch();

        $stmt = $this->db->query("SELECT COUNT(*) as count FROM borrowings WHERE status = 'overdue'");
        $overdueBorrowings = $stmt->fetch();

        $stmt = $this->db->query("SELECT COUNT(*) as count FROM books WHERE available_copies > 0");
        $availableBooks = $stmt->fetch();

        jsonResponse([
            'stats' => [
                'total_books' => $totalBooks['count'],
                'total_users' => $totalUsers['count'],
                'active_borrowings' => $activeBorrowings['count'],
                'overdue_borrowings' => $overdueBorrowings['count'],
                'available_books' => $availableBooks['count']
            ]
        ]);
    }
}