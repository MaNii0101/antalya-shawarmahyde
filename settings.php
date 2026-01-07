<?php
/**
 * ANTALYA SHAWARMA - Settings & Bank API
 * Handles restaurant settings and bank configuration
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        switch ($action) {
            case 'bank':
                updateBankSettings();
                break;
            case 'settings':
                updateSettings();
                break;
            case 'owner-login':
                ownerLogin();
                break;
            case 'staff-login':
                staffLogin();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    case 'GET':
        switch ($action) {
            case 'bank':
                getBankSettings();
                break;
            case 'settings':
                getSettings();
                break;
            case 'menu':
                getMenu();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

// Owner login
function ownerLogin() {
    $data = getPostData();
    $required = ['email', 'password', 'pin'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    $db = getDB();
    
    // Get owner credentials from settings
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('owner_email', 'owner_password', 'owner_pin')");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    
    if ($data['email'] === $settings['owner_email'] && 
        $data['password'] === $settings['owner_password'] && 
        $data['pin'] === $settings['owner_pin']) {
        jsonResponse(['success' => true, 'message' => 'Owner login successful', 'role' => 'owner']);
    }
    
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

// Staff login
function staffLogin() {
    $data = getPostData();
    $required = ['email', 'password'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }
    
    $db = getDB();
    
    // Get staff credentials from settings
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('staff_email', 'staff_password', 'owner_email', 'owner_password')");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    
    // Check staff credentials
    if ($data['email'] === $settings['staff_email'] && $data['password'] === $settings['staff_password']) {
        jsonResponse(['success' => true, 'message' => 'Staff login successful', 'role' => 'staff']);
    }
    
    // Also allow owner to login as staff
    if ($data['email'] === $settings['owner_email'] && $data['password'] === $settings['owner_password']) {
        jsonResponse(['success' => true, 'message' => 'Login successful', 'role' => 'owner']);
    }
    
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

// Get bank settings
function getBankSettings() {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM bank_settings LIMIT 1");
    $bank = $stmt->fetch();
    
    jsonResponse(['success' => true, 'bank' => $bank ?: []]);
}

// Update bank settings
function updateBankSettings() {
    $data = getPostData();
    
    $db = getDB();
    
    // Check if record exists
    $stmt = $db->query("SELECT id FROM bank_settings LIMIT 1");
    $existing = $stmt->fetch();
    
    if ($existing) {
        $stmt = $db->prepare("UPDATE bank_settings SET bank_name = ?, account_holder = ?, account_number = ?, sort_code = ?, iban = ? WHERE id = ?");
        $stmt->execute([
            sanitize($data['bank_name'] ?? ''),
            sanitize($data['account_holder'] ?? ''),
            sanitize($data['account_number'] ?? ''),
            sanitize($data['sort_code'] ?? ''),
            sanitize($data['iban'] ?? ''),
            $existing['id']
        ]);
    } else {
        $stmt = $db->prepare("INSERT INTO bank_settings (bank_name, account_holder, account_number, sort_code, iban) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            sanitize($data['bank_name'] ?? ''),
            sanitize($data['account_holder'] ?? ''),
            sanitize($data['account_number'] ?? ''),
            sanitize($data['sort_code'] ?? ''),
            sanitize($data['iban'] ?? '')
        ]);
    }
    
    jsonResponse(['success' => true, 'message' => 'Bank settings updated']);
}

// Get all settings
function getSettings() {
    $db = getDB();
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        // Don't expose passwords
        if (!str_contains($row['setting_key'], 'password') && !str_contains($row['setting_key'], 'pin')) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }
    
    jsonResponse(['success' => true, 'settings' => $settings]);
}

// Update settings
function updateSettings() {
    $data = getPostData();
    
    if (empty($data['key']) || !isset($data['value'])) {
        jsonResponse(['error' => 'Key and value required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
    $stmt->execute([sanitize($data['key']), sanitize($data['value']), sanitize($data['value'])]);
    
    jsonResponse(['success' => true, 'message' => 'Setting updated']);
}

// Get menu from database
function getMenu() {
    $db = getDB();
    
    // Get categories
    $stmt = $db->query("SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order");
    $categories = $stmt->fetchAll();
    
    // Get items for each category
    $menu = [];
    foreach ($categories as $cat) {
        $stmt = $db->prepare("SELECT * FROM menu_items WHERE category_id = ? AND is_available = TRUE ORDER BY display_order");
        $stmt->execute([$cat['id']]);
        $items = $stmt->fetchAll();
        
        // Parse options JSON
        foreach ($items as &$item) {
            $item['options'] = json_decode($item['options'], true) ?? [];
        }
        
        $menu[$cat['slug']] = [
            'category' => $cat,
            'items' => $items
        ];
    }
    
    jsonResponse(['success' => true, 'menu' => $menu, 'categories' => $categories]);
}
