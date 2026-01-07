<?php
/**
 * ANTALYA SHAWARMA - Drivers API
 * Handles driver management and authentication
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        switch ($action) {
            case 'login':
                loginDriver();
                break;
            case 'add':
                addDriver();
                break;
            case 'update':
                updateDriver();
                break;
            case 'delete':
                deleteDriver();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    case 'GET':
        switch ($action) {
            case 'all':
                getAllDrivers();
                break;
            case 'available':
                getAvailableDrivers();
                break;
            case 'profile':
                getDriverProfile();
                break;
            case 'orders':
                getDriverOrders();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

// Driver login (by email or secret code)
function loginDriver() {
    $data = getPostData();
    
    $db = getDB();
    
    // Check by secret code first
    if (!empty($data['secret_code'])) {
        $stmt = $db->prepare("SELECT * FROM drivers WHERE secret_code = ? AND is_active = TRUE");
        $stmt->execute([sanitize($data['secret_code'])]);
        $driver = $stmt->fetch();
        
        if ($driver) {
            unset($driver['password']); // Don't send password
            jsonResponse(['success' => true, 'message' => 'Login successful', 'driver' => $driver]);
        }
    }
    
    // Check by email/password
    if (!empty($data['email']) && !empty($data['password'])) {
        $stmt = $db->prepare("SELECT * FROM drivers WHERE email = ? AND is_active = TRUE");
        $stmt->execute([sanitize($data['email'])]);
        $driver = $stmt->fetch();
        
        if ($driver && ($driver['password'] === null || password_verify($data['password'], $driver['password']))) {
            unset($driver['password']);
            jsonResponse(['success' => true, 'message' => 'Login successful', 'driver' => $driver]);
        }
    }
    
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

// Add new driver (owner only)
function addDriver() {
    $data = getPostData();
    $required = ['name', 'email', 'phone'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }
    
    $db = getDB();
    
    // Check if email exists
    $stmt = $db->prepare("SELECT id FROM drivers WHERE email = ?");
    $stmt->execute([sanitize($data['email'])]);
    
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 400);
    }
    
    // Generate secret code
    $stmt = $db->query("SELECT COUNT(*) as count FROM drivers");
    $count = $stmt->fetch()['count'] + 1;
    $initials = strtoupper(implode('', array_map(fn($word) => $word[0], explode(' ', $data['name']))));
    $secretCode = sprintf("DRV-%03d-%s", $count, $initials);
    
    // Insert driver
    $stmt = $db->prepare("INSERT INTO drivers (name, email, phone, secret_code, password) VALUES (?, ?, ?, ?, ?)");
    $password = !empty($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;
    $stmt->execute([
        sanitize($data['name']),
        sanitize($data['email']),
        sanitize($data['phone']),
        $secretCode,
        $password
    ]);
    
    $driverId = $db->lastInsertId();
    
    // Get created driver
    $stmt = $db->prepare("SELECT id, name, email, phone, secret_code, deliveries, rating, is_available, created_at FROM drivers WHERE id = ?");
    $stmt->execute([$driverId]);
    $driver = $stmt->fetch();
    
    jsonResponse([
        'success' => true,
        'message' => 'Driver added successfully',
        'driver' => $driver,
        'secret_code' => $secretCode
    ]);
}

// Update driver
function updateDriver() {
    $data = getPostData();
    
    if (empty($data['id'])) {
        jsonResponse(['error' => 'Driver ID required'], 400);
    }
    
    $db = getDB();
    
    $updates = [];
    $params = [];
    
    if (isset($data['name'])) {
        $updates[] = "name = ?";
        $params[] = sanitize($data['name']);
    }
    if (isset($data['email'])) {
        $updates[] = "email = ?";
        $params[] = sanitize($data['email']);
    }
    if (isset($data['phone'])) {
        $updates[] = "phone = ?";
        $params[] = sanitize($data['phone']);
    }
    if (isset($data['is_available'])) {
        $updates[] = "is_available = ?";
        $params[] = $data['is_available'] ? 1 : 0;
    }
    if (isset($data['is_active'])) {
        $updates[] = "is_active = ?";
        $params[] = $data['is_active'] ? 1 : 0;
    }
    if (isset($data['rating'])) {
        $updates[] = "rating = ?";
        $params[] = floatval($data['rating']);
    }
    
    if (empty($updates)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }
    
    $params[] = intval($data['id']);
    
    $sql = "UPDATE drivers SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    jsonResponse(['success' => true, 'message' => 'Driver updated']);
}

// Delete driver
function deleteDriver() {
    $data = getPostData();
    
    if (empty($data['id'])) {
        jsonResponse(['error' => 'Driver ID required'], 400);
    }
    
    $db = getDB();
    
    // Soft delete - just mark as inactive
    $stmt = $db->prepare("UPDATE drivers SET is_active = FALSE WHERE id = ?");
    $stmt->execute([intval($data['id'])]);
    
    jsonResponse(['success' => true, 'message' => 'Driver removed']);
}

// Get all drivers
function getAllDrivers() {
    $db = getDB();
    $stmt = $db->query("SELECT id, name, email, phone, secret_code, deliveries, rating, is_available, is_active, created_at FROM drivers WHERE is_active = TRUE ORDER BY created_at DESC");
    $drivers = $stmt->fetchAll();
    
    jsonResponse(['success' => true, 'drivers' => $drivers]);
}

// Get available drivers
function getAvailableDrivers() {
    $db = getDB();
    $stmt = $db->query("SELECT id, name, phone, deliveries, rating FROM drivers WHERE is_active = TRUE AND is_available = TRUE ORDER BY rating DESC");
    $drivers = $stmt->fetchAll();
    
    jsonResponse(['success' => true, 'drivers' => $drivers]);
}

// Get driver profile
function getDriverProfile() {
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        jsonResponse(['error' => 'Driver ID required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email, phone, secret_code, deliveries, rating, is_available, created_at FROM drivers WHERE id = ? AND is_active = TRUE");
    $stmt->execute([intval($id)]);
    $driver = $stmt->fetch();
    
    if (!$driver) {
        jsonResponse(['error' => 'Driver not found'], 404);
    }
    
    jsonResponse(['success' => true, 'driver' => $driver]);
}

// Get driver's assigned orders
function getDriverOrders() {
    $driverId = $_GET['driver_id'] ?? '';
    
    if (empty($driverId)) {
        jsonResponse(['error' => 'Driver ID required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM orders WHERE driver_id = ? AND status IN ('out_for_delivery', 'delivered') ORDER BY created_at DESC");
    $stmt->execute([intval($driverId)]);
    $orders = $stmt->fetchAll();
    
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
    }
    
    jsonResponse(['success' => true, 'orders' => $orders]);
}
