<?php
class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function login() {
        $data = getJsonInput();
        
        if (!isset($data['email']) || !isset($data['password'])) {
            jsonResponse(['error' => 'Email and password are required'], 400);
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }

        $token = generateToken($user);
        jsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    }

    public function register() {
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
        $role = isset($data['role']) ? $data['role'] : 'client';

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $role,
            $data['phone'] ?? null
        ]);

        $userId = $this->db->lastInsertId();
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        $token = generateToken($user);
        jsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ], 201);
    }

    public function logout() {
        jsonResponse(['message' => 'Logged out successfully']);
    }
}