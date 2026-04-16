<?php
class JWT {
    private static $secret_key = 'library_ms_secret_key_2024';
    private static $algorithm = 'HS256';

    public static function encode($payload) {
        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => self::$algorithm]));
        $payload['iat'] = time();
        $payload['exp'] = time() + (86400 * 7);
        $payload_encoded = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', $header . "." . $payload_encoded, self::$secret_key, true));
        return $header . "." . $payload_encoded . "." . $signature;
    }

    public static function decode($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];

        $expected_signature = base64_encode(hash_hmac('sha256', $header . "." . $payload, self::$secret_key, true));
        if ($signature !== $expected_signature) return null;

        $decoded = json_decode(base64_decode($payload), true);
        if (!$decoded || isset($decoded['exp']) && $decoded['exp'] < time()) return null;

        return $decoded;
    }
}

function generateToken($user) {
    $payload = [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role']
    ];
    return JWT::encode($payload);
}

function getAuthUser() {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? null;

    if (!$auth_header) return null;

    $token = str_replace('Bearer ', '', $auth_header);
    return JWT::decode($token);
}

function requireAuth() {
    $user = getAuthUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    return $user;
}

function requireAdmin() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit;
    }
    return $user;
}