<?php
/**
 * ANTALYA SHAWARMA - Database Configuration
 * 
 * Update these values with your MySQL server details
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'antalya_shawarma');
define('DB_USER', 'root');           // Change to your MySQL username
define('DB_PASS', '');               // Change to your MySQL password
define('DB_CHARSET', 'utf8mb4');

// Enable error reporting for development (disable in production)
define('DEBUG_MODE', true);

// CORS Headers for API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection class
class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
            } else {
                die(json_encode(['error' => 'Database connection failed']));
            }
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
}

// Helper function to get database connection
function getDB() {
    return Database::getInstance()->getConnection();
}

// Helper function to send JSON response
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper function to get POST data
function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?? $_POST;
}

// Helper function to validate required fields
function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing[] = $field;
        }
    }
    return $missing;
}

// Helper function to sanitize input
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
