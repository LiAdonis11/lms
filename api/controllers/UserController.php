<?php
class UserController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $search = $_GET['search'] ?? '';
        
        $sql = "SELECT id, name, email, role, phone, address, created_at FROM users WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (name LIKE ? OR email LIKE ?)";
            $searchParam = "%{$search}%";
            $params = array_merge($params, [$searchParam, $searchParam]);
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();

        jsonResponse(['users' => $users]);
    }

    public function show($id) {
        $stmt = $this->db->prepare("SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }

        $stmt = $this->db->prepare("SELECT b.*, br.borrow_date, br.due_date, br.return_date, br.status as borrowing_status 
            FROM borrowings br 
            JOIN books b ON br.book_id = b.id 
            WHERE br.user_id = ? 
            ORDER BY br.borrow_date DESC");
        $stmt->execute([$id]);
        $borrowings = $stmt->fetchAll();

        $user['borrowings'] = $borrowings;
        jsonResponse(['user' => $user]);
    }

    public function store() {
        $data = getJsonInput();

        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            jsonResponse(['error' => 'Name, email and password are required'], 400);
        }

        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            jsonResponse(['error' => 'Email already exists'], 400);
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $data['role'] ?? 'client',
            $data['phone'] ?? null,
            $data['address'] ?? null
        ]);

        $userId = $this->db->lastInsertId();
        $stmt = $this->db->prepare("SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        jsonResponse(['user' => $user, 'message' => 'User created successfully'], 201);
    }

    public function update($id) {
        $data = getJsonInput();

        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'User not found'], 404);
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $params[] = $data['name'];
        }
        if (isset($data['email'])) {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->execute([$data['email'], $id]);
            if ($stmt->fetch()) {
                jsonResponse(['error' => 'Email already exists'], 400);
            }
            $fields[] = "email = ?";
            $params[] = $data['email'];
        }
        if (isset($data['password'])) {
            $fields[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        if (isset($data['role'])) {
            $fields[] = "role = ?";
            $params[] = $data['role'];
        }
        if (isset($data['phone'])) {
            $fields[] = "phone = ?";
            $params[] = $data['phone'];
        }
        if (isset($data['address'])) {
            $fields[] = "address = ?";
            $params[] = $data['address'];
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $stmt = $this->db->prepare("SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        jsonResponse(['user' => $user, 'message' => 'User updated successfully']);
    }

    public function destroy($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'User not found'], 404);
        }

        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['message' => 'User deleted successfully']);
    }
}