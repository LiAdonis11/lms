<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

if ($uri[0] === 'api') {
    if (isset($uri[1]) && $uri[1] === 'auth') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $auth = new AuthController($db);

        if ($method === 'POST' && isset($uri[2])) {
            if ($uri[2] === 'login') {
                $auth->login();
            } elseif ($uri[2] === 'register') {
                $auth->register();
            } elseif ($uri[2] === 'logout') {
                $auth->logout();
            }
        } elseif ($method === 'GET' && isset($uri[2]) && $uri[2] === 'me') {
            $user = requireAuth();
            jsonResponse(['user' => $user]);
        }
    }
    elseif ($uri[1] === 'books') {
        require_once __DIR__ . '/controllers/BookController.php';
        $book = new BookController($db);

        if ($method === 'GET') {
            $book->index();
        }
    }
    elseif ($uri[1] === 'borrowings') {
        require_once __DIR__ . '/controllers/BorrowingController.php';
        $borrowing = new BorrowingController($db);

        if ($method === 'GET') {
            $user = requireAuth();
            if ($user['role'] === 'admin') {
                $borrowing->adminIndex();
            } else {
                $borrowing->index();
            }
        } elseif ($method === 'POST') {
            $user = requireAuth();
            $borrowing->create($user);
        }
    }
    elseif ($uri[1] === 'admin') {
        requireAdmin();

        if (isset($uri[2]) && $uri[2] === 'books') {
            require_once __DIR__ . '/controllers/BookController.php';
            $book = new BookController($db);

            if ($method === 'GET' && isset($uri[3])) {
                $book->show($uri[3]);
            } elseif ($method === 'POST') {
                $book->store();
            } elseif ($method === 'PUT' && isset($uri[3])) {
                $book->update($uri[3]);
            } elseif ($method === 'DELETE' && isset($uri[3])) {
                $book->destroy($uri[3]);
            }
        }
        elseif (isset($uri[2]) && $uri[2] === 'users') {
            require_once __DIR__ . '/controllers/UserController.php';
            $userCtrl = new UserController($db);

            if ($method === 'GET' && isset($uri[3])) {
                $userCtrl->show($uri[3]);
            } elseif ($method === 'GET') {
                $userCtrl->index();
            } elseif ($method === 'POST') {
                $userCtrl->store();
            } elseif ($method === 'PUT' && isset($uri[3])) {
                $userCtrl->update($uri[3]);
            } elseif ($method === 'DELETE' && isset($uri[3])) {
                $userCtrl->destroy($uri[3]);
            }
        }
        elseif (isset($uri[2]) && $uri[2] === 'borrowings') {
            require_once __DIR__ . '/controllers/BorrowingController.php';
            $borrowing = new BorrowingController($db);

            if ($method === 'PUT' && isset($uri[3])) {
                $borrowing->adminUpdate($uri[3]);
            }
        }
        elseif (isset($uri[2]) && $uri[2] === 'dashboard') {
            require_once __DIR__ . '/controllers/DashboardController.php';
            $dashboard = new DashboardController($db);
            $dashboard->index();
        }
        elseif (isset($uri[2]) && $uri[2] === 'categories') {
            require_once __DIR__ . '/controllers/CategoryController.php';
            $category = new CategoryController($db);
            $category->index();
        }
    }
}

jsonResponse(['error' => 'Not Found'], 404);