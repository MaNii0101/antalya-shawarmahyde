<?php
/**
 * ANTALYA SHAWARMA - Users API
 * Handles user registration, login, profile management
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        switch ($action) {
            case 'register':
                registerUser();
                break;
            case 'login':
                loginUser();
                break;
            case 'verify':
                verifyCode();
                break;
            case 'update':
                updateProfile();
                break;
            case 'change-email':
                changeEmail();
                break;
            case 'change-password':
                changePassword();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    case 'GET':
        switch ($action) {
            case 'profile':
                getProfile();
                break;
            case 'all':
                getAllUsers();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

// Register new user
function registerUser() {
    $data = getPostData();
    $required = ['email', 'password', 'name'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }
    
    $db = getDB();
    
    // Check if email exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['email'])]);
    
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 400);
    }
    
    // Generate verification code
    $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    
    // Store verification code
    $stmt = $db->prepare("INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
    $stmt->execute([sanitize($data['email']), $code]);
    
    // Return code (in production, send via email)
    jsonResponse([
        'success' => true,
        'message' => 'Verification code sent',
        'code' => $code, // Remove in production!
        'email' => $data['email']
    ]);
}

// Verify registration/login code
function verifyCode() {
    $data = getPostData();
    $required = ['email', 'code', 'type'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    $db = getDB();
    
    // Verify code
    $stmt = $db->prepare("SELECT * FROM verification_codes WHERE email = ? AND code = ? AND type = ? AND expires_at > NOW() AND is_used = FALSE ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([sanitize($data['email']), sanitize($data['code']), sanitize($data['type'])]);
    $verification = $stmt->fetch();
    
    if (!$verification) {
        jsonResponse(['error' => 'Invalid or expired code'], 400);
    }
    
    // Mark code as used
    $stmt = $db->prepare("UPDATE verification_codes SET is_used = TRUE WHERE id = ?");
    $stmt->execute([$verification['id']]);
    
    if ($data['type'] === 'signup') {
        // Create user account
        $stmt = $db->prepare("INSERT INTO users (email, password, name, phone, age, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)");
        $stmt->execute([
            sanitize($data['email']),
            password_hash($data['password'], PASSWORD_DEFAULT),
            sanitize($data['name']),
            sanitize($data['phone'] ?? ''),
            intval($data['age'] ?? 0)
        ]);
        
        $userId = $db->lastInsertId();
        
        // Get created user
        $stmt = $db->prepare("SELECT id, email, name, phone, age, profile_picture, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        jsonResponse([
            'success' => true,
            'message' => 'Account created successfully',
            'user' => $user
        ]);
    } else {
        // Login verification
        $stmt = $db->prepare("SELECT id, email, name, phone, age, address, profile_picture, created_at FROM users WHERE email = ?");
        $stmt->execute([sanitize($data['email'])]);
        $user = $stmt->fetch();
        
        jsonResponse([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user
        ]);
    }
}

// Login user
function loginUser() {
    $data = getPostData();
    $required = ['email', 'password'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    $db = getDB();
    
    // Check credentials
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['email'])]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['password'], $user['password'])) {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }
    
    // Generate verification code for 2FA
    $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    
    $stmt = $db->prepare("INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, 'login', DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
    $stmt->execute([sanitize($data['email']), $code]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Verification code sent',
        'code' => $code, // Remove in production!
        'email' => $data['email']
    ]);
}

// Get user profile
function getProfile() {
    $email = $_GET['email'] ?? '';
    
    if (empty($email)) {
        jsonResponse(['error' => 'Email required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, name, phone, age, address, profile_picture, created_at FROM users WHERE email = ?");
    $stmt->execute([sanitize($email)]);
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonResponse(['error' => 'User not found'], 404);
    }
    
    jsonResponse(['success' => true, 'user' => $user]);
}

// Update user profile
function updateProfile() {
    $data = getPostData();
    
    if (empty($data['email'])) {
        jsonResponse(['error' => 'Email required'], 400);
    }
    
    $db = getDB();
    
    // Build update query
    $updates = [];
    $params = [];
    
    if (isset($data['name'])) {
        $updates[] = "name = ?";
        $params[] = sanitize($data['name']);
    }
    if (isset($data['phone'])) {
        $updates[] = "phone = ?";
        $params[] = sanitize($data['phone']);
    }
    if (isset($data['age'])) {
        $updates[] = "age = ?";
        $params[] = intval($data['age']);
    }
    if (isset($data['address'])) {
        $updates[] = "address = ?";
        $params[] = sanitize($data['address']);
    }
    if (isset($data['profile_picture'])) {
        $updates[] = "profile_picture = ?";
        $params[] = $data['profile_picture'];
    }
    
    if (empty($updates)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }
    
    $params[] = sanitize($data['email']);
    
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE email = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    // Return updated user
    $stmt = $db->prepare("SELECT id, email, name, phone, age, address, profile_picture, created_at FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['email'])]);
    $user = $stmt->fetch();
    
    jsonResponse(['success' => true, 'message' => 'Profile updated', 'user' => $user]);
}

// Change email with security verification
function changeEmail() {
    $data = getPostData();
    $required = ['current_email', 'current_password', 'new_email'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    $db = getDB();
    
    // Verify current password
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['current_email'])]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['current_password'], $user['password'])) {
        jsonResponse(['error' => 'Current password is incorrect'], 401);
    }
    
    // Check if new email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['new_email'])]);
    
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'New email already registered'], 400);
    }
    
    // Update email
    $stmt = $db->prepare("UPDATE users SET email = ? WHERE email = ?");
    $stmt->execute([sanitize($data['new_email']), sanitize($data['current_email'])]);
    
    // Update related records (orders, favorites, notifications)
    $stmt = $db->prepare("UPDATE orders SET user_email = ? WHERE user_email = ?");
    $stmt->execute([sanitize($data['new_email']), sanitize($data['current_email'])]);
    
    jsonResponse(['success' => true, 'message' => 'Email changed successfully']);
}

// Change password with security verification
function changePassword() {
    $data = getPostData();
    $required = ['email', 'current_password', 'new_password'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    if (strlen($data['new_password']) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }
    
    $db = getDB();
    
    // Verify current password
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['email'])]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['current_password'], $user['password'])) {
        jsonResponse(['error' => 'Current password is incorrect'], 401);
    }
    
    // Update password
    $stmt = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->execute([password_hash($data['new_password'], PASSWORD_DEFAULT), sanitize($data['email'])]);
    
    jsonResponse(['success' => true, 'message' => 'Password changed successfully']);
}

// Get all users (for owner dashboard)
function getAllUsers() {
    $db = getDB();
    $stmt = $db->query("SELECT id, email, name, phone, age, profile_picture, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    
    jsonResponse(['success' => true, 'users' => $users]);
}
