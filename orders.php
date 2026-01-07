<?php
/**
 * ANTALYA SHAWARMA - Orders API
 * Handles order creation, management, and status updates
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        switch ($action) {
            case 'create':
                createOrder();
                break;
            case 'accept':
                acceptOrder();
                break;
            case 'reject':
                rejectOrder();
                break;
            case 'assign-driver':
                assignDriver();
                break;
            case 'complete':
                completeOrder();
                break;
            case 'update-status':
                updateOrderStatus();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    case 'GET':
        switch ($action) {
            case 'pending':
                getPendingOrders();
                break;
            case 'history':
                getOrderHistory();
                break;
            case 'user':
                getUserOrders();
                break;
            case 'stats':
                getOrderStats();
                break;
            case 'monthly':
                getMonthlyStats();
                break;
            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

// Create new order
function createOrder() {
    $data = getPostData();
    $required = ['user_email', 'items', 'total'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }
    
    $db = getDB();
    
    // Get user info
    $stmt = $db->prepare("SELECT id, name, phone FROM users WHERE email = ?");
    $stmt->execute([sanitize($data['user_email'])]);
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonResponse(['error' => 'User not found'], 404);
    }
    
    // Generate order ID
    $orderId = 'ORD-' . time() . '-' . rand(1000, 9999);
    
    // Insert order
    $stmt = $db->prepare("INSERT INTO orders (id, user_id, user_email, user_name, user_phone, address, items, subtotal, delivery_fee, total, payment_method, special_instructions, delivery_distance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $orderId,
        $user['id'],
        sanitize($data['user_email']),
        $user['name'],
        $data['user_phone'] ?? $user['phone'],
        sanitize($data['address'] ?? ''),
        json_encode($data['items']),
        floatval($data['subtotal'] ?? $data['total']),
        floatval($data['delivery_fee'] ?? 0),
        floatval($data['total']),
        sanitize($data['payment_method'] ?? 'cash'),
        sanitize($data['special_instructions'] ?? ''),
        floatval($data['delivery_distance'] ?? 0)
    ]);
    
    // Create notification for user
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'order_placed', '📦 Order Placed!', ?, ?)");
    $stmt->execute([$user['id'], "Your order #$orderId has been received!", $orderId]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $orderId
    ]);
}

// Accept order
function acceptOrder() {
    $data = getPostData();
    
    if (empty($data['order_id'])) {
        jsonResponse(['error' => 'Order ID required'], 400);
    }
    
    $db = getDB();
    
    // Update status
    $stmt = $db->prepare("UPDATE orders SET status = 'accepted' WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    
    // Get order for notification
    $stmt = $db->prepare("SELECT user_id FROM orders WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    $order = $stmt->fetch();
    
    // Create notification
    if ($order) {
        $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'order_accepted', '✅ Order Accepted!', ?, ?)");
        $stmt->execute([$order['user_id'], "Your order #{$data['order_id']} has been accepted and is being prepared.", $data['order_id']]);
    }
    
    jsonResponse(['success' => true, 'message' => 'Order accepted']);
}

// Reject order
function rejectOrder() {
    $data = getPostData();
    
    if (empty($data['order_id'])) {
        jsonResponse(['error' => 'Order ID required'], 400);
    }
    
    $db = getDB();
    
    // Update status
    $stmt = $db->prepare("UPDATE orders SET status = 'rejected', rejection_reason = ? WHERE id = ?");
    $stmt->execute([sanitize($data['reason'] ?? 'Order cancelled'), sanitize($data['order_id'])]);
    
    // Get order for notification
    $stmt = $db->prepare("SELECT user_id FROM orders WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    $order = $stmt->fetch();
    
    // Create notification
    if ($order) {
        $reason = $data['reason'] ?? 'No reason provided';
        $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'order_rejected', '❌ Order Rejected', ?, ?)");
        $stmt->execute([$order['user_id'], "Your order #{$data['order_id']} was rejected. Reason: $reason", $data['order_id']]);
    }
    
    jsonResponse(['success' => true, 'message' => 'Order rejected']);
}

// Assign driver to order
function assignDriver() {
    $data = getPostData();
    
    if (empty($data['order_id']) || empty($data['driver_id'])) {
        jsonResponse(['error' => 'Order ID and Driver ID required'], 400);
    }
    
    $db = getDB();
    
    // Get driver name
    $stmt = $db->prepare("SELECT name FROM drivers WHERE id = ?");
    $stmt->execute([intval($data['driver_id'])]);
    $driver = $stmt->fetch();
    
    if (!$driver) {
        jsonResponse(['error' => 'Driver not found'], 404);
    }
    
    // Update order
    $stmt = $db->prepare("UPDATE orders SET driver_id = ?, status = 'out_for_delivery' WHERE id = ?");
    $stmt->execute([intval($data['driver_id']), sanitize($data['order_id'])]);
    
    // Get order for notification
    $stmt = $db->prepare("SELECT user_id FROM orders WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    $order = $stmt->fetch();
    
    // Create notification
    if ($order) {
        $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'driver_assigned', '🚗 Driver Assigned!', ?, ?)");
        $stmt->execute([$order['user_id'], "Driver {$driver['name']} is on the way with your order!", $data['order_id']]);
    }
    
    jsonResponse(['success' => true, 'message' => 'Driver assigned']);
}

// Complete order
function completeOrder() {
    $data = getPostData();
    
    if (empty($data['order_id'])) {
        jsonResponse(['error' => 'Order ID required'], 400);
    }
    
    $db = getDB();
    
    // Get order details
    $stmt = $db->prepare("SELECT user_id, driver_id FROM orders WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    $order = $stmt->fetch();
    
    if (!$order) {
        jsonResponse(['error' => 'Order not found'], 404);
    }
    
    // Update order status
    $stmt = $db->prepare("UPDATE orders SET status = 'completed' WHERE id = ?");
    $stmt->execute([sanitize($data['order_id'])]);
    
    // Increment driver deliveries
    if ($order['driver_id']) {
        $stmt = $db->prepare("UPDATE drivers SET deliveries = deliveries + 1 WHERE id = ?");
        $stmt->execute([$order['driver_id']]);
    }
    
    // Create notification
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'order_completed', '🎉 Order Delivered!', ?, ?)");
    $stmt->execute([$order['user_id'], "Your order #{$data['order_id']} has been delivered. Enjoy your meal!", $data['order_id']]);
    
    jsonResponse(['success' => true, 'message' => 'Order completed']);
}

// Get pending orders
function getPendingOrders() {
    $db = getDB();
    $stmt = $db->query("SELECT o.*, u.profile_picture as user_picture FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.status IN ('pending', 'accepted', 'preparing', 'out_for_delivery') ORDER BY o.created_at DESC");
    $orders = $stmt->fetchAll();
    
    // Parse JSON items
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
    }
    
    jsonResponse(['success' => true, 'orders' => $orders]);
}

// Get order history
function getOrderHistory() {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM orders WHERE status IN ('completed', 'rejected', 'cancelled') ORDER BY created_at DESC LIMIT 100");
    $orders = $stmt->fetchAll();
    
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
    }
    
    jsonResponse(['success' => true, 'orders' => $orders]);
}

// Get user's orders
function getUserOrders() {
    $email = $_GET['email'] ?? '';
    
    if (empty($email)) {
        jsonResponse(['error' => 'Email required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC");
    $stmt->execute([sanitize($email)]);
    $orders = $stmt->fetchAll();
    
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
    }
    
    jsonResponse(['success' => true, 'orders' => $orders]);
}

// Get order statistics (for owner dashboard)
function getOrderStats() {
    $db = getDB();
    
    $stats = [];
    
    // Total revenue
    $stmt = $db->query("SELECT COALESCE(SUM(total), 0) as total_revenue FROM orders WHERE status = 'completed'");
    $stats['total_revenue'] = floatval($stmt->fetch()['total_revenue']);
    
    // Total orders
    $stmt = $db->query("SELECT COUNT(*) as total_orders FROM orders");
    $stats['total_orders'] = intval($stmt->fetch()['total_orders']);
    
    // Pending orders
    $stmt = $db->query("SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'");
    $stats['pending_orders'] = intval($stmt->fetch()['pending_orders']);
    
    // Total users
    $stmt = $db->query("SELECT COUNT(*) as total_users FROM users");
    $stats['total_users'] = intval($stmt->fetch()['total_users']);
    
    // Total drivers
    $stmt = $db->query("SELECT COUNT(*) as total_drivers FROM drivers WHERE is_active = TRUE");
    $stats['total_drivers'] = intval($stmt->fetch()['total_drivers']);
    
    jsonResponse(['success' => true, 'stats' => $stats]);
}

// Get monthly statistics (for restaurant dashboard)
function getMonthlyStats() {
    $db = getDB();
    
    $stats = [];
    
    // Monthly revenue
    $stmt = $db->query("SELECT COALESCE(SUM(total), 0) as monthly_revenue FROM orders WHERE status = 'completed' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['monthly_revenue'] = floatval($stmt->fetch()['monthly_revenue']);
    
    // Monthly orders
    $stmt = $db->query("SELECT COUNT(*) as monthly_orders FROM orders WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['monthly_orders'] = intval($stmt->fetch()['monthly_orders']);
    
    // Pending orders
    $stmt = $db->query("SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'");
    $stats['pending_orders'] = intval($stmt->fetch()['pending_orders']);
    
    // Monthly completed
    $stmt = $db->query("SELECT COUNT(*) as completed_orders FROM orders WHERE status = 'completed' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['completed_orders'] = intval($stmt->fetch()['completed_orders']);
    
    jsonResponse(['success' => true, 'stats' => $stats]);
}

// Update order status
function updateOrderStatus() {
    $data = getPostData();
    
    if (empty($data['order_id']) || empty($data['status'])) {
        jsonResponse(['error' => 'Order ID and status required'], 400);
    }
    
    $validStatuses = ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'rejected', 'cancelled'];
    
    if (!in_array($data['status'], $validStatuses)) {
        jsonResponse(['error' => 'Invalid status'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([sanitize($data['status']), sanitize($data['order_id'])]);
    
    jsonResponse(['success' => true, 'message' => 'Status updated']);
}
