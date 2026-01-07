# Antalya Shawarma - Database Setup Guide

## MySQL Database Setup

### Requirements
- MySQL 5.7+ or MariaDB 10.3+
- PHP 7.4+ with PDO MySQL extension
- Web server (Apache/Nginx)

### Installation Steps

#### 1. Create the Database
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/database/schema.sql
```

Or using phpMyAdmin:
1. Open phpMyAdmin
2. Create new database: `antalya_shawarma`
3. Import `schema.sql` file

#### 2. Configure PHP Connection
Edit `api/config.php` and update these values:
```php
define('DB_HOST', 'localhost');      // Your MySQL host
define('DB_NAME', 'antalya_shawarma');
define('DB_USER', 'your_username');  // Your MySQL username
define('DB_PASS', 'your_password');  // Your MySQL password
```

#### 3. Upload API Files
Upload the `api/` folder to your web server:
```
your-website.com/
├── api/
│   ├── config.php
│   ├── users.php
│   ├── orders.php
│   ├── drivers.php
│   └── settings.php
├── index.html
├── script.js
├── style.css
└── mobile.css
```

#### 4. Configure JavaScript API URL
In `script.js`, update the API_URL constant:
```javascript
const API_URL = 'https://your-website.com/api';
```

### API Endpoints

#### Users API (`/api/users.php`)
| Action | Method | Parameters |
|--------|--------|------------|
| Register | POST | `?action=register` + email, password, name, phone, age |
| Login | POST | `?action=login` + email, password |
| Verify Code | POST | `?action=verify` + email, code, type |
| Update Profile | POST | `?action=update` + email, name, phone, age, address, profile_picture |
| Change Email | POST | `?action=change-email` + current_email, current_password, new_email |
| Change Password | POST | `?action=change-password` + email, current_password, new_password |
| Get Profile | GET | `?action=profile&email=...` |
| Get All Users | GET | `?action=all` |

#### Orders API (`/api/orders.php`)
| Action | Method | Parameters |
|--------|--------|------------|
| Create Order | POST | `?action=create` + user_email, items, total, address, payment_method |
| Accept Order | POST | `?action=accept` + order_id |
| Reject Order | POST | `?action=reject` + order_id, reason |
| Assign Driver | POST | `?action=assign-driver` + order_id, driver_id |
| Complete Order | POST | `?action=complete` + order_id |
| Get Pending | GET | `?action=pending` |
| Get History | GET | `?action=history` |
| Get User Orders | GET | `?action=user&email=...` |
| Get Stats | GET | `?action=stats` |
| Get Monthly Stats | GET | `?action=monthly` |

#### Drivers API (`/api/drivers.php`)
| Action | Method | Parameters |
|--------|--------|------------|
| Login | POST | `?action=login` + secret_code OR email+password |
| Add Driver | POST | `?action=add` + name, email, phone |
| Update Driver | POST | `?action=update` + id, name, email, phone, is_available |
| Delete Driver | POST | `?action=delete` + id |
| Get All | GET | `?action=all` |
| Get Available | GET | `?action=available` |
| Get Profile | GET | `?action=profile&id=...` |
| Get Orders | GET | `?action=orders&driver_id=...` |

#### Settings API (`/api/settings.php`)
| Action | Method | Parameters |
|--------|--------|------------|
| Owner Login | POST | `?action=owner-login` + email, password, pin |
| Staff Login | POST | `?action=staff-login` + email, password |
| Get Bank | GET | `?action=bank` |
| Update Bank | POST | `?action=bank` + bank_name, account_holder, account_number, sort_code, iban |
| Get Settings | GET | `?action=settings` |
| Get Menu | GET | `?action=menu` |

### Default Credentials

**Owner Access:**
- Email: `admin@antalyashawarma.com`
- Password: `admin2024`
- PIN: `1234`

**Staff Access:**
- Email: `staff@antalyashawarma.com`
- Password: `staff2024`

**Demo Drivers:**
| Name | Secret Code |
|------|-------------|
| Mohammed Ali | DRV-001-MA |
| Ahmed Hassan | DRV-002-AH |
| Fatima Khan | DRV-003-FK |

### Database Tables

| Table | Description |
|-------|-------------|
| `users` | Customer accounts with profile data |
| `orders` | All orders with status tracking |
| `drivers` | Delivery driver accounts |
| `categories` | Menu categories |
| `menu_items` | Food items with options |
| `favorites` | User favorites |
| `notifications` | User notifications |
| `bank_settings` | Payment configuration |
| `verification_codes` | Email verification codes |
| `settings` | System settings |

### Security Notes

1. **Change default credentials** in production
2. **Use HTTPS** for all API calls
3. **Set DEBUG_MODE to false** in production
4. **Restrict database user permissions** (only SELECT, INSERT, UPDATE, DELETE)
5. **Implement rate limiting** for login endpoints
6. **Hash passwords** (already implemented with password_hash())

### Troubleshooting

**Connection Error:**
- Verify MySQL is running
- Check credentials in config.php
- Ensure database exists

**CORS Error:**
- Headers are set in config.php
- Check your web server configuration

**500 Error:**
- Enable DEBUG_MODE in config.php
- Check PHP error logs
- Verify file permissions
