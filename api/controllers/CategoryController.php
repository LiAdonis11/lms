<?php
class CategoryController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $stmt = $this->db->query("SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != '' ORDER BY category");
        $categories = $stmt->fetchAll();

        jsonResponse(['categories' => array_column($categories, 'category')]);
    }
}