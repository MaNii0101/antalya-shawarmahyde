// ========================================
// ANTALYA SHAWARMA UK - COMPLETE SYSTEM
// VERSION: 3.0.0 - FULLY FEATURED UK SYSTEM
// All 163 Features + Complete Menu
// ========================================

// ========================================
// UK DELIVERY CONFIGURATION
// ========================================
const UK_CONFIG = {
    restaurant: {
        name: 'Antalya Shawarma',
        address: '181 Market St, Hyde SK14 1HF',
        phone: '+44 161 536 1862',
        lat: 53.4514,
        lng: -2.0839,
        openTime: 11, // 11:00 AM
        closeTime: 23, // 11:00 PM
        lastOrderTime: 22.5 // 10:30 PM (22:30)
    },
    deliveryZones: {
        free: { max: 1, price: 0 },
        zone1: { min: 1, max: 3, price: 3.99 },
        zone2: { min: 3, max: 6, price: 5.99 }
    },
    maxDeliveryDistance: 6,
    currency: '£'
};

// Get UK time (handles BST/GMT automatically)
function getUKTime() {
    const now = new Date();
    // Convert to UK timezone
    const ukTime = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    return ukTime;
}

function getUKHour() {
    const ukTime = getUKTime();
    return ukTime.getHours() + (ukTime.getMinutes() / 60);
}

// Check if restaurant is open for orders (UK TIME)
function isRestaurantOpen() {
    const currentHour = getUKHour();
    return currentHour >= UK_CONFIG.restaurant.openTime && currentHour < UK_CONFIG.restaurant.lastOrderTime;
}

function getRestaurantStatus() {
    const currentHour = getUKHour();
    const ukTime = getUKTime();
    const timeStr = ukTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    if (currentHour < UK_CONFIG.restaurant.openTime) {
        return { open: false, message: `Opens at 11:00 (UK time: ${timeStr})` };
    } else if (currentHour >= UK_CONFIG.restaurant.closeTime) {
        return { open: false, message: `Closed for today (UK time: ${timeStr})` };
    } else if (currentHour >= UK_CONFIG.restaurant.lastOrderTime) {
        return { open: false, message: `Kitchen closed - Last orders at 22:30 (UK time: ${timeStr})` };
    }
    return { open: true, message: 'Open for orders' };
}

// Reset all website data
function resetAllData() {
    if (!confirm('⚠️ Are you sure you want to delete ALL data?\n\nThis will remove:\n- All user accounts\n- All order history\n- All driver data\n- All favorites & notifications\n\nThis cannot be undone!')) {
        return;
    }
    
    // Clear all localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset global variables
    cart = [];
    currentUser = null;
    userDatabase = [];
    orderHistory = [];
    pendingOrders = [];
    userFavorites = {};
    userNotifications = {};
    selectedLocation = null;
    isOwnerLoggedIn = false;
    isRestaurantLoggedIn = false;
    
    // Reset driver system
    if (window.driverSystem) {
        window.driverSystem.drivers = {};
    }
    
    alert('✅ All data has been reset!\n\nThe page will now reload.');
    location.reload();
}

// ========================================
// CREDENTIALS
// ========================================
const OWNER_CREDENTIALS = {
    email: 'admin@antalyashawarma.com',
    password: 'admin2024',
    pin: '1234'
};

const RESTAURANT_CREDENTIALS = {
    email: 'staff@antalyashawarma.com',
    password: 'staff2024'
};

// ========================================
// COMPLETE ANTALYA SHAWARMA MENU DATA
// ========================================
// Using let so owner can modify menu
let menuData = {
    // SHAWARMA WRAPS & SANDWICHES
    shawarma: [
        { 
            id: 101, 
            name: 'Chicken Shawarma Wrap', 
            price: 6.99, 
            icon: '🌯',
            image: '', // Custom image URL (empty = use icon)
            available: true,
            desc: 'Tender marinated chicken with garlic sauce, salad & pickles in fresh naan',
            options: [
                {name: 'Extra Meat', price: 2.00},
                {name: 'Extra Garlic Sauce', price: 0.50},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Add Hummus', price: 1.00},
                {name: 'Make it Spicy', price: 0},
                {name: 'Extra Pickles', price: 0.50}
            ]
        },
        { 
            id: 102, 
            name: 'Lamb Shawarma Wrap', 
            price: 7.99, 
            icon: '🌯',
            image: '',
            available: true,
            desc: 'Juicy lamb shawarma with tahini sauce, fresh salad in naan bread',
            options: [
                {name: 'Extra Meat', price: 2.50},
                {name: 'Extra Tahini', price: 0.50},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Add Hummus', price: 1.00},
                {name: 'Make it Spicy', price: 0}
            ]
        },
        { 
            id: 103, 
            name: 'Mixed Shawarma Wrap', 
            price: 8.99, 
            icon: '🌯',
            image: '',
            available: true,
            desc: 'Best of both - chicken & lamb shawarma combo with all sauces',
            options: [
                {name: 'Extra Meat', price: 3.00},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Extra Sauce', price: 0.50},
                {name: 'Add Hummus', price: 1.00}
            ]
        },
        { 
            id: 104, 
            name: 'Chicken Shawarma Sandwich', 
            price: 5.99, 
            icon: '🥪', 
            desc: 'Chicken shawarma in Turkish bread with salad and sauce',
            options: [
                {name: 'Extra Meat', price: 2.00},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Extra Sauce', price: 0.50}
            ]
        },
        { 
            id: 105, 
            name: 'Lamb Shawarma Sandwich', 
            price: 6.99, 
            icon: '🥪', 
            desc: 'Lamb shawarma in Turkish bread with salad and tahini',
            options: [
                {name: 'Extra Meat', price: 2.50},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Extra Tahini', price: 0.50}
            ]
        },
        { 
            id: 106, 
            name: 'Falafel Wrap', 
            price: 5.99, 
            icon: '🌯', 
            desc: 'Crispy falafel with hummus, salad and tahini in fresh naan',
            options: [
                {name: 'Extra Falafel (3pc)', price: 1.50},
                {name: 'Extra Hummus', price: 1.00},
                {name: 'Add Halloumi', price: 2.00}
            ]
        }
    ],
    
    // SHAWARMA PORTIONS - CHIPS
    portions_chips: [
        { 
            id: 201, 
            name: 'Chicken Shawarma & Chips', 
            price: 8.99, 
            icon: '🍟', 
            desc: 'Savoury chicken shawarma served with crispy chips, salad and sauce',
            options: [
                {name: 'Extra Meat', price: 2.50},
                {name: 'Large Chips', price: 1.50},
                {name: 'Extra Sauce', price: 0.50},
                {name: 'Add Cheese on Chips', price: 1.00}
            ]
        },
        { 
            id: 202, 
            name: 'Lamb Shawarma & Chips', 
            price: 9.99, 
            icon: '🍟', 
            desc: 'Tender lamb shawarma served with crispy chips, salad and sauce',
            options: [
                {name: 'Extra Meat', price: 3.00},
                {name: 'Large Chips', price: 1.50},
                {name: 'Extra Sauce', price: 0.50},
                {name: 'Add Cheese on Chips', price: 1.00}
            ]
        },
        { 
            id: 203, 
            name: 'Mixed Shawarma & Chips', 
            price: 10.99, 
            icon: '🍟', 
            desc: 'Chicken & lamb shawarma combo with chips, salad and sauce',
            options: [
                {name: 'Extra Meat', price: 3.50},
                {name: 'Large Chips', price: 1.50},
                {name: 'Extra Sauce', price: 0.50}
            ]
        }
    ],
    
    // SHAWARMA PORTIONS - RICE
    portions_rice: [
        { 
            id: 301, 
            name: 'Chicken Shawarma & Rice', 
            price: 9.99, 
            icon: '🍚', 
            desc: 'Juicy chicken shawarma with basmati rice, soup, naan, and salad',
            options: [
                {name: 'Extra Meat', price: 2.50},
                {name: 'Biryani Rice', price: 1.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 302, 
            name: 'Lamb Shawarma & Rice', 
            price: 10.99, 
            icon: '🍚', 
            desc: 'Tender lamb shawarma with basmati rice, soup, naan, and salad',
            options: [
                {name: 'Extra Meat', price: 3.00},
                {name: 'Biryani Rice', price: 1.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 303, 
            name: 'Mixed Shawarma & Rice', 
            price: 11.99, 
            icon: '🍚', 
            desc: 'Chicken & lamb shawarma with rice or biryani, soup, naan and salad',
            options: [
                {name: 'Extra Meat', price: 3.50},
                {name: 'Biryani Rice', price: 1.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        }
    ],
    
    // GRILL PORTIONS
    grill: [
        { 
            id: 401, 
            name: 'Grill Mix Chicken & Lamb', 
            price: 14.99, 
            icon: '🍖', 
            desc: 'Boneless chicken & lamb pieces, served with salad, sauce & naan',
            options: [
                {name: 'Extra Meat', price: 4.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 402, 
            name: 'Lamb Back Strap Fillet', 
            price: 16.99, 
            icon: '🥩', 
            desc: 'Premium lamb fillet served with salad, sauce & naan',
            options: [
                {name: 'Extra Fillet', price: 5.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 403, 
            name: 'Chicken Tikka Portion', 
            price: 11.99, 
            icon: '🍗', 
            desc: 'Marinated chicken tikka served with salad, sauce & naan',
            options: [
                {name: 'Extra Tikka', price: 3.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 404, 
            name: 'Lamb Tikka Portion', 
            price: 13.99, 
            icon: '🍖', 
            desc: 'Tender lamb tikka served with salad, sauce & naan',
            options: [
                {name: 'Extra Tikka', price: 4.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 405, 
            name: 'Adana Kebab', 
            price: 12.99, 
            icon: '🥙', 
            desc: 'Spicy minced lamb kebab served with salad, sauce & naan',
            options: [
                {name: 'Extra Kebab', price: 4.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Spicy', price: 0}
            ]
        },
        { 
            id: 406, 
            name: 'Kofta Kebab', 
            price: 11.99, 
            icon: '🥙', 
            desc: 'Minced lamb kofta served with salad, sauce & naan',
            options: [
                {name: 'Extra Kofta', price: 3.50},
                {name: 'Add Rice', price: 2.00},
                {name: 'Extra Naan', price: 1.00}
            ]
        },
        { 
            id: 407, 
            name: 'Chicken Wings (5pc)', 
            price: 6.99, 
            icon: '🍗', 
            desc: 'Crispy marinated chicken wings served with sauce',
            options: [
                {name: 'Extra Wings (5pc)', price: 5.00},
                {name: 'Extra Spicy', price: 0},
                {name: 'Add Chips', price: 2.50}
            ]
        }
    ],
    
    // FAMILY PLATTERS
    platters: [
        { 
            id: 501, 
            name: 'Antalya Platter 1', 
            price: 24.99, 
            icon: '🍽️', 
            desc: 'Adana kebab, lamb tikka, chicken tikka, 5 wings, large chips. With salad, hummus, rice, bulgur & 3 naans',
            options: [
                {name: 'Extra Naans (3pc)', price: 2.00},
                {name: 'Extra Hummus', price: 1.50},
                {name: '2 Extra Drinks', price: 3.00}
            ]
        },
        { 
            id: 502, 
            name: 'Antalya Platter 2', 
            price: 34.99, 
            icon: '🍽️', 
            desc: 'Adana, kofta, lamb tikka, chicken tikka, 5 wings, shawarma, large chips. With salad, hummus, rice & 3 naans & 2 drinks',
            options: [
                {name: 'Extra Naans (3pc)', price: 2.00},
                {name: 'Extra Hummus', price: 1.50},
                {name: 'Upgrade Drinks', price: 2.00}
            ]
        },
        { 
            id: 503, 
            name: 'Family Mix Grill', 
            price: 44.99, 
            icon: '🍽️', 
            desc: 'Lamb shish, chicken shish, lamb kofta, wings, ribs, lamb chops, shawarma. With salads and 4 naans',
            options: [
                {name: 'Extra Portion', price: 8.00},
                {name: 'Extra Naans (4pc)', price: 3.00}
            ]
        }
    ],
    
    // RICE & BIRYANI
    rice: [
        { 
            id: 601, 
            name: 'Lamb Biryani', 
            price: 12.99, 
            icon: '🍚', 
            desc: 'Spring juicy pure lamb served with rice or biryani, soup, naan, and salad',
            options: [
                {name: 'Extra Lamb', price: 4.00},
                {name: 'Extra Naan', price: 1.00},
                {name: 'Large Portion', price: 3.00}
            ]
        },
        { 
            id: 602, 
            name: 'Chicken Biryani', 
            price: 10.99, 
            icon: '🍚', 
            desc: 'Half chicken served with rice or biryani, soup, naan, and salad',
            options: [
                {name: 'Full Chicken', price: 5.00},
                {name: 'Extra Naan', price: 1.00},
                {name: 'Extra Rice', price: 2.00}
            ]
        },
        { 
            id: 603, 
            name: 'Vegetable Biryani', 
            price: 8.99, 
            icon: '🍚', 
            desc: 'Mixed vegetable biryani with soup, naan, and salad',
            options: [
                {name: 'Extra Vegetables', price: 2.00},
                {name: 'Extra Naan', price: 1.00},
                {name: 'Add Halloumi', price: 2.50}
            ]
        }
    ],
    
    // ROASTED CHICKEN
    chicken: [
        { 
            id: 701, 
            name: 'Half Roasted Chicken', 
            price: 9.99, 
            icon: '🍗', 
            desc: 'Half chicken served with chips or rice, salad and sauce',
            options: [
                {name: 'Upgrade to Full', price: 5.00},
                {name: 'Extra Chips', price: 2.00},
                {name: 'Extra Sauce', price: 0.50}
            ]
        },
        { 
            id: 702, 
            name: 'Full Roasted Chicken', 
            price: 14.99, 
            icon: '🍗', 
            desc: 'Whole roasted chicken with chips or rice, salad and sauce',
            options: [
                {name: 'Large Chips', price: 2.00},
                {name: 'Extra Sauce', price: 0.50},
                {name: 'Add Naan (2pc)', price: 1.50}
            ]
        },
        { 
            id: 703, 
            name: 'Chicken Tenders (6pc)', 
            price: 7.99, 
            icon: '🍗', 
            desc: 'Crispy chicken strips served with chips and dip',
            options: [
                {name: 'Extra Tenders (3pc)', price: 3.00},
                {name: 'Extra Dip', price: 0.50},
                {name: 'Large Chips', price: 1.50}
            ]
        },
        { 
            id: 704, 
            name: 'Hot Wings (6pc)', 
            price: 6.99, 
            icon: '🍗', 
            desc: 'Spicy buffalo wings served with chips and blue cheese dip',
            options: [
                {name: 'Extra Wings (6pc)', price: 5.00},
                {name: 'Extra Hot', price: 0},
                {name: 'Ranch Dip', price: 0.75}
            ]
        }
    ],
    
    // FATAYER (Turkish Pastries)
    fatayer: [
        { 
            id: 801, 
            name: 'Chicken Cheese Fatayer', 
            price: 4.99, 
            icon: '🥟', 
            desc: 'Turkish pastry filled with chicken and melted cheese',
            options: [
                {name: 'Extra Cheese', price: 1.00},
                {name: 'Add Jalapeños', price: 0.50}
            ]
        },
        { 
            id: 802, 
            name: 'Lamb Cheese Fatayer', 
            price: 5.49, 
            icon: '🥟', 
            desc: 'Pastry filled with a blend of lamb and cheese',
            options: [
                {name: 'Extra Cheese', price: 1.00},
                {name: 'Extra Spicy', price: 0}
            ]
        },
        { 
            id: 803, 
            name: 'Spinach Fatayer', 
            price: 3.99, 
            icon: '🥟', 
            desc: 'Vegetarian pastry with spinach and onion filling',
            options: [
                {name: 'Add Feta Cheese', price: 1.00}
            ]
        },
        { 
            id: 804, 
            name: 'Cheese Fatayer', 
            price: 3.99, 
            icon: '🥟', 
            desc: 'A blend of cheeses combined for mild flavour',
            options: [
                {name: 'Extra Cheese', price: 1.00}
            ]
        }
    ],
    
    // PIZZA
    pizza: [
        { 
            id: 901, 
            name: 'Margherita Pizza 10"', 
            price: 8.99, 
            icon: '🍕', 
            desc: 'Classic pizza with tomato, mozzarella, and basil',
            options: [
                {name: 'Extra Cheese', price: 2.00},
                {name: 'Add Toppings (2)', price: 2.00},
                {name: '12" Size', price: 3.00}
            ]
        },
        { 
            id: 902, 
            name: 'Chicken Pizza 10"', 
            price: 10.99, 
            icon: '🍕', 
            desc: 'Chicken pizza with your choice of two toppings',
            options: [
                {name: 'Extra Chicken', price: 2.50},
                {name: 'Extra Toppings (2)', price: 2.00},
                {name: '12" Size', price: 3.00}
            ]
        },
        { 
            id: 903, 
            name: 'Lamb Pizza 10"', 
            price: 11.99, 
            icon: '🍕', 
            desc: 'Pizza topped with lamb and two additional toppings',
            options: [
                {name: 'Extra Lamb', price: 3.00},
                {name: 'Extra Toppings (2)', price: 2.00},
                {name: '12" Size', price: 3.00}
            ]
        },
        { 
            id: 904, 
            name: 'Pepperoni Pizza 10"', 
            price: 10.99, 
            icon: '🍕', 
            desc: 'Classic topped with pepperoni and two toppings',
            options: [
                {name: 'Extra Pepperoni', price: 2.00},
                {name: 'Extra Cheese', price: 2.00},
                {name: '12" Size', price: 3.00}
            ]
        },
        { 
            id: 905, 
            name: 'Vegetarian Pizza 10"', 
            price: 9.99, 
            icon: '🍕', 
            desc: 'Pizza topped with variety of vegetables',
            options: [
                {name: 'Extra Veggies', price: 2.00},
                {name: 'Add Halloumi', price: 2.50},
                {name: '12" Size', price: 3.00}
            ]
        },
        { 
            id: 906, 
            name: 'Garlic Bread with Cheese', 
            price: 4.99, 
            icon: '🥖', 
            desc: 'Soft bread topped with garlic and melted cheese',
            options: [
                {name: 'Extra Cheese', price: 1.00},
                {name: 'Add Mushrooms', price: 1.00}
            ]
        }
    ],
    
    // KEBABS (Halal)
    kebabs: [
        { 
            id: 1001, 
            name: 'Adana Kebab', 
            price: 9.99, 
            icon: '🥙', 
            desc: 'Spiced minced lamb kebab served with salad, rice & naan',
            options: [
                {name: 'Extra Meat', price: 2.50},
                {name: 'Add Hummus', price: 1.00},
                {name: 'Extra Naan', price: 1.50}
            ]
        },
        { 
            id: 1002, 
            name: 'Lamb Tikka Kebab', 
            price: 10.99, 
            icon: '🥙', 
            desc: 'Tender lamb tikka pieces with salad & fresh naan',
            options: [
                {name: 'Extra Meat', price: 3.00},
                {name: 'Add Rice', price: 2.00},
                {name: 'Add Hummus', price: 1.00}
            ]
        },
        { 
            id: 1003, 
            name: 'Chicken Tikka Kebab', 
            price: 9.49, 
            icon: '🥙', 
            desc: 'Marinated chicken tikka with salad & naan bread',
            options: [
                {name: 'Extra Chicken', price: 2.50},
                {name: 'Add Rice', price: 2.00},
                {name: 'Make it Spicy', price: 0}
            ]
        },
        { 
            id: 1004, 
            name: 'Kofte Kebab', 
            price: 8.99, 
            icon: '🥙', 
            desc: 'Traditional lamb kofte with fresh salad & sauce',
            options: [
                {name: 'Extra Kofte', price: 2.00},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Extra Naan', price: 1.50}
            ]
        },
        { 
            id: 1005, 
            name: 'Lamb Back Strap Fillet', 
            price: 12.99, 
            icon: '🥩', 
            desc: 'Premium lamb fillet served with salad, sauce & naan',
            options: [
                {name: 'Extra Fillet', price: 4.00},
                {name: 'Add Rice', price: 2.00}
            ]
        }
    ],
    
    // MEAL DEALS
    meals: [
        { 
            id: 1101, 
            name: 'Shawarma Meal Deal', 
            price: 10.99, 
            icon: '🌯', 
            desc: 'Chicken shawarma wrap with chips and drink',
            options: [
                {name: 'Upgrade to Lamb', price: 1.00},
                {name: 'Large Chips', price: 1.50}
            ]
        },
        { 
            id: 1102, 
            name: 'Kebab Meal Deal', 
            price: 12.99, 
            icon: '🥙', 
            desc: 'Choice of kebab with chips and drink',
            options: [
                {name: 'Upgrade Drink', price: 1.00},
                {name: 'Large Chips', price: 1.50}
            ]
        },
        { 
            id: 1103, 
            name: 'Grill Meal Deal', 
            price: 14.99, 
            icon: '🍖', 
            desc: 'Mixed grill portion with chips and drink',
            options: [
                {name: 'Extra Meat', price: 3.00},
                {name: 'Upgrade Drink', price: 1.00}
            ]
        },
        { 
            id: 1104, 
            name: 'Family Sharing Deal', 
            price: 29.99, 
            icon: '🍽️', 
            desc: '2 shawarma wraps, 2 portions chips, hummus & 2 drinks',
            options: [
                {name: 'Add Extra Wrap', price: 5.00},
                {name: 'Add Falafel', price: 3.00}
            ]
        }
    ],
    
    // SIDES & EXTRAS
    sides: [
        { 
            id: 1201, 
            name: 'Regular Chips', 
            price: 2.99, 
            icon: '🍟', 
            desc: 'Crispy golden chips',
            options: [
                {name: 'Large Size', price: 1.50},
                {name: 'Add Cheese', price: 1.00},
                {name: 'Cajun Seasoning', price: 0.50}
            ]
        },
        { 
            id: 1202, 
            name: 'Cheese Chips', 
            price: 4.99, 
            icon: '🍟', 
            desc: 'Chips covered in melted cheese',
            options: [
                {name: 'Extra Cheese', price: 1.00},
                {name: 'Add Jalapeños', price: 0.75}
            ]
        },
        { 
            id: 1203, 
            name: 'Hummus', 
            price: 3.49, 
            icon: '🥣', 
            desc: 'Creamy chickpea dip with olive oil',
            options: [
                {name: 'Large Portion', price: 1.50},
                {name: 'Add Naan', price: 1.00}
            ]
        },
        { 
            id: 1204, 
            name: 'Large Salad', 
            price: 4.99, 
            icon: '🥗', 
            desc: 'Fresh mixed salad with dressing',
            options: [
                {name: 'Add Feta Cheese', price: 1.50},
                {name: 'Add Halloumi', price: 2.00}
            ]
        },
        { 
            id: 1205, 
            name: 'Naan Bread (3pc)', 
            price: 1.50, 
            icon: '🫓', 
            desc: 'Freshly baked soft naan bread',
            options: [
                {name: 'Extra Naan (3pc)', price: 1.50}
            ]
        },
        { 
            id: 1206, 
            name: 'Rice Portion', 
            price: 2.99, 
            icon: '🍚', 
            desc: 'Basmati rice portion',
            options: [
                {name: 'Biryani Rice', price: 1.00},
                {name: 'Large Portion', price: 1.50}
            ]
        },
        { 
            id: 1207, 
            name: 'Soup of the Day', 
            price: 3.49, 
            icon: '🍲', 
            desc: 'Fresh homemade soup with bread',
            options: [
                {name: 'Large Bowl', price: 1.50}
            ]
        },
        { 
            id: 1208, 
            name: 'Falafel (5pc)', 
            price: 4.49, 
            icon: '🧆', 
            desc: 'Crispy homemade falafel',
            options: [
                {name: 'Extra Falafel (5pc)', price: 3.50},
                {name: 'Add Hummus', price: 1.00}
            ]
        }
    ],
    
    // SAUCES
    sauces: [
        { id: 1301, name: 'Garlic Sauce', price: 0.99, icon: '🧄', desc: 'Creamy garlic mayo sauce' },
        { id: 1302, name: 'Chilli Sauce', price: 0.99, icon: '🌶️', desc: 'Hot chilli sauce' },
        { id: 1303, name: 'Tahini Sauce', price: 0.99, icon: '🥜', desc: 'Traditional sesame tahini' },
        { id: 1304, name: 'Yoghurt Sauce', price: 0.99, icon: '🥛', desc: 'Cool yoghurt dip' },
        { id: 1305, name: 'BBQ Sauce', price: 0.99, icon: '🍖', desc: 'Smoky BBQ sauce' },
        { id: 1306, name: 'Mayo', price: 0.79, icon: '🥄', desc: 'Classic mayonnaise' },
        { id: 1307, name: 'Ketchup', price: 0.79, icon: '🍅', desc: 'Tomato ketchup' }
    ],
    
    // DRINKS
    drinks: [
        { id: 1401, name: 'Coca Cola', price: 1.99, icon: '🥤', desc: 'Ice cold 330ml can' },
        { id: 1402, name: 'Pepsi', price: 1.99, icon: '🥤', desc: 'Ice cold 330ml can' },
        { id: 1403, name: 'Fanta', price: 1.99, icon: '🥤', desc: 'Orange 330ml can' },
        { id: 1404, name: 'Sprite', price: 1.99, icon: '🥤', desc: 'Lemon-lime 330ml can' },
        { id: 1405, name: 'Water', price: 1.49, icon: '💧', desc: 'Still water 500ml' },
        { id: 1406, name: 'Fresh Orange Juice', price: 3.49, icon: '🧃', desc: 'Freshly squeezed orange' },
        { id: 1407, name: 'Ayran', price: 2.49, icon: '🥛', desc: 'Traditional Turkish yoghurt drink' },
        { id: 1408, name: '1.5L Coca Cola', price: 3.49, icon: '🍾', desc: 'Large bottle for sharing' },
        { id: 1409, name: '1.5L Pepsi', price: 3.49, icon: '🍾', desc: 'Large bottle for sharing' }
    ]
};

// ========================================
// CATEGORY NAMES & ICONS (can be modified by owner)
// ========================================
let categories = {
    shawarma: { name: 'Shawarma Wraps', icon: '🌯', image: '' },
    portions_chips: { name: 'Portions (Chips)', icon: '🍟', image: '' },
    portions_rice: { name: 'Portions (Rice)', icon: '🍚', image: '' },
    grill: { name: 'Grill Portions', icon: '🍖', image: '' },
    platters: { name: 'Family Platters', icon: '🍽️', image: '' },
    rice: { name: 'Rice & Biryani', icon: '🍚', image: '' },
    chicken: { name: 'Roasted Chicken', icon: '🍗', image: '' },
    fatayer: { name: 'Fatayer', icon: '🥟', image: '' },
    pizza: { name: 'Pizza', icon: '🍕', image: '' },
    kebabs: { name: 'Kebabs', icon: '🥙', image: '' },
    meals: { name: 'Meal Deals', icon: '🎁', image: '' },
    sides: { name: 'Sides & Extras', icon: '🥗', image: '' },
    sauces: { name: 'Sauces', icon: '🧄', image: '' },
    drinks: { name: 'Drinks', icon: '🥤', image: '' }
};

// Load saved menu data from localStorage
function loadMenuData() {
    const savedMenu = localStorage.getItem('menuData');
    const savedCategories = localStorage.getItem('categories');
    if (savedMenu) {
        try {
            const parsed = JSON.parse(savedMenu);
            // Merge with default menu to preserve structure
            Object.keys(parsed).forEach(key => {
                if (menuData[key]) {
                    menuData[key] = parsed[key];
                }
            });
        } catch(e) { console.log('Error loading menu data'); }
    }
    if (savedCategories) {
        try {
            const parsed = JSON.parse(savedCategories);
            Object.keys(parsed).forEach(key => {
                if (categories[key]) {
                    categories[key] = { ...categories[key], ...parsed[key] };
                } else {
                    categories[key] = parsed[key];
                }
            });
        } catch(e) { console.log('Error loading categories'); }
    }
}

function saveMenuData() {
    localStorage.setItem('menuData', JSON.stringify(menuData));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// ========================================
// GLOBAL STATE
// ========================================
let cart = [];
let currentUser = null;
let selectedFood = null;
let selectedCustomizations = [];
let quantity = 1;
let isSignUpMode = false;
let currentCategory = 'shawarma';
let userDatabase = [];
let orderHistory = [];
let userFavorites = {};
let userNotifications = {};
let selectedLocation = null;
let googleMap = null;
let mapMarker = null;
let isEditingLocation = false;
let pendingOrders = [];
let isOwnerLoggedIn = false;
let isRestaurantLoggedIn = false;
let pendingVerification = null;
let drivers = [];
let currentDriver = null;

let ownerBankDetails = {
    bankName: 'Barclays Bank UK',
    accountNumber: '12345678',
    sortCode: '20-00-00',
    iban: 'GB29 NWBK 6016 1331 9268 19',
    cardNumber: '4532 **** **** 1234'
};

// ========================================
// DRIVER SYSTEM
// ========================================
window.driverSystem = {
    drivers: {
        'driver-001': {
            id: 'driver-001',
            name: 'Mohammed Ali',
            email: 'mohammed@antalya.com',
            phone: '+44 7700 900123',
            password: 'driver123',
            dob: '1990-05-15',
            gender: 'male',
            secretCode: 'DRV-001-MA',
            deliveries: 247,
            rating: 4.9,
            active: true,      // Can login
            available: true,   // Can receive orders
            profilePicture: null,
            currentLocation: null
        },
        'driver-002': {
            id: 'driver-002',
            name: 'Ahmed Hassan',
            email: 'ahmed@antalya.com',
            phone: '+44 7700 900124',
            password: 'driver123',
            dob: '1988-08-20',
            gender: 'male',
            secretCode: 'DRV-002-AH',
            deliveries: 189,
            rating: 4.8,
            active: true,
            available: true,
            profilePicture: null,
            currentLocation: null
        },
        'driver-003': {
            id: 'driver-003',
            name: 'Fatima Khan',
            email: 'fatima@antalya.com',
            phone: '+44 7700 900125',
            password: 'driver123',
            dob: '1992-12-10',
            gender: 'female',
            secretCode: 'DRV-003-FK',
            deliveries: 156,
            rating: 4.95,
            active: true,
            available: true,
            profilePicture: null,
            currentLocation: null
        }
    },
    get: function(id) {
        return this.drivers[id] || null;
    },
    getByCode: function(code) {
        return Object.values(this.drivers).find(d => d.secretCode === code.toUpperCase());
    },
    getByEmail: function(email) {
        return Object.values(this.drivers).find(d => d.email === email);
    },
    getAll: function() {
        return Object.values(this.drivers);
    },
    getActive: function() {
        return Object.values(this.drivers).filter(d => d.active);
    },
    getAvailable: function() {
        return Object.values(this.drivers).filter(d => d.active && d.available);
    },
    add: function(driver) {
        this.drivers[driver.id] = driver;
        this.save();
    },
    update: function(id, data) {
        if (this.drivers[id]) {
            Object.assign(this.drivers[id], data);
            this.save();
        }
    },
    delete: function(id) {
        delete this.drivers[id];
        this.save();
    },
    save: function() {
        localStorage.setItem('driverSystem', JSON.stringify(this.drivers));
    },
    load: function() {
        const saved = localStorage.getItem('driverSystem');
        if (saved) {
            this.drivers = JSON.parse(saved);
        }
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Calculate distance in miles (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Get delivery cost based on distance
function getDeliveryCost(distance) {
    if (distance > UK_CONFIG.maxDeliveryDistance) {
        return { 
            available: false, 
            cost: 0, 
            message: `❌ Outside delivery area (max ${UK_CONFIG.maxDeliveryDistance} miles)`,
            distance: distance.toFixed(1)
        };
    }
    if (distance <= UK_CONFIG.deliveryZones.free.max) {
        return { 
            available: true, 
            cost: 0, 
            message: '✅ FREE Delivery!',
            distance: distance.toFixed(1)
        };
    }
    if (distance <= UK_CONFIG.deliveryZones.zone1.max) {
        return { 
            available: true, 
            cost: UK_CONFIG.deliveryZones.zone1.price, 
            message: `📍 ${distance.toFixed(1)} miles - £${UK_CONFIG.deliveryZones.zone1.price}`,
            distance: distance.toFixed(1)
        };
    }
    if (distance <= UK_CONFIG.deliveryZones.zone2.max) {
        return { 
            available: true, 
            cost: UK_CONFIG.deliveryZones.zone2.price,
            message: `📍 ${distance.toFixed(1)} miles - £${UK_CONFIG.deliveryZones.zone2.price}`,
            distance: distance.toFixed(1)
        };
    }
    return { available: false, cost: 0, message: '❌ Outside delivery area' };
}

// Format price in GBP
function formatPrice(amount) {
    return UK_CONFIG.currency + parseFloat(amount).toFixed(2);
}

// Email Verification System
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationEmail(email, code) {
    console.log(`📧 Verification code for ${email}: ${code}`);
    alert(`📧 Verification Code Sent!\n\nA 6-digit code has been sent to:\n${email}\n\n(Demo: Code is ${code})`);
}

// Validation functions
function isValidEmail(email) {
    email = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, message: '❌ Invalid email format' };
    }
    
    if (email.endsWith('@gmail.com')) {
        return { valid: true, provider: 'Gmail' };
    } else if (email.endsWith('@icloud.com')) {
        return { valid: true, provider: 'iCloud' };
    } else {
        return { valid: true, provider: 'Other' };
    }
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const ukPhoneRegex = /^(\+44|44|0)?[1-9]\d{9,10}$/;
    return ukPhoneRegex.test(cleanPhone);
}

function isValidCardNumber(cardNumber) {
    cardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) return false;
    
    let sum = 0, isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return (sum % 10) === 0;
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function isValidExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(num => parseInt(num));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    return true;
}

function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch(e) {
        console.log('Audio not supported');
    }
}

// ========================================
// STORAGE FUNCTIONS
// ========================================
function saveData() {
    localStorage.setItem('restaurantUsers', JSON.stringify(userDatabase));
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
    localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    localStorage.setItem('ownerBankDetails', JSON.stringify(ownerBankDetails));
    localStorage.setItem('drivers', JSON.stringify(drivers));
}

function loadData() {
    const savedUsers = localStorage.getItem('restaurantUsers');
    if (savedUsers) userDatabase = JSON.parse(savedUsers);
    
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) orderHistory = JSON.parse(savedOrders);
    
    const savedPending = localStorage.getItem('pendingOrders');
    if (savedPending) pendingOrders = JSON.parse(savedPending);
    
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) userFavorites = JSON.parse(savedFavorites);
    
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) userNotifications = JSON.parse(savedNotifications);
    
    const savedBankDetails = localStorage.getItem('ownerBankDetails');
    if (savedBankDetails) ownerBankDetails = JSON.parse(savedBankDetails);
    
    const savedDrivers = localStorage.getItem('drivers');
    if (savedDrivers) drivers = JSON.parse(savedDrivers);
    
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
        updateHeaderForLoggedInUser();
        
        const savedCart = localStorage.getItem('cart_' + currentUser.email);
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartBadge();
        }
        updateFavoritesBadge();
        updateNotificationBadge();
        updateOrdersBadge();
    }
    
    window.driverSystem.load();
}

function saveCart() {
    if (currentUser) {
        localStorage.setItem('cart_' + currentUser.email, JSON.stringify(cart));
    }
}

function saveDrivers() {
    localStorage.setItem('drivers', JSON.stringify(drivers));
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateFavoritesBadge() {
    const badge = document.getElementById('favoritesBadge');
    if (!badge) return;
    if (currentUser && userFavorites[currentUser.email]) {
        const count = userFavorites[currentUser.email].length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    } else {
        badge.style.display = 'none';
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    if (currentUser && userNotifications[currentUser.email]) {
        const unread = userNotifications[currentUser.email].filter(n => !n.read).length;
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'flex' : 'none';
    } else {
        badge.style.display = 'none';
    }
}

function updateHeaderForLoggedInUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (!loginBtn) return;
    
    if (currentUser) {
        loginBtn.textContent = currentUser.name.split(' ')[0];
        loginBtn.style.background = 'rgba(255, 107, 107, 0.2)';
        loginBtn.style.border = '2px solid #ff6b6b';
        loginBtn.onclick = showAccount;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a6f)';
        loginBtn.style.border = 'none';
        loginBtn.onclick = showLogin;
    }
}

// ========================================
// MENU DISPLAY FUNCTIONS
// ========================================
function displayMenu(category) {
    currentCategory = category;
    const menuGrid = document.getElementById('menuGrid');
    const menuTitle = document.getElementById('menuTitle');
    
    if (!menuGrid) return;
    
    const catInfo = categories[category] || { name: category, icon: '🍽️' };
    if (menuTitle) menuTitle.textContent = catInfo.name;
    
    menuGrid.innerHTML = '';
    
    const items = menuData[category] || [];
    items.forEach(item => {
        // Skip unavailable items for regular users (show for owner)
        if (item.available === false && !isOwnerLoggedIn) return;
        
        const isFavorite = currentUser && userFavorites[currentUser.email]?.includes(item.id);
        
        // Determine image display: custom image > icon
        const imageDisplay = item.image 
            ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
            : item.icon;
        
        const unavailableStyle = item.available === false ? 'opacity: 0.5;' : '';
        const unavailableBadge = item.available === false ? '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(239,68,68,0.9); color: white; padding: 0.3rem 0.6rem; border-radius: 5px; font-size: 0.7rem; font-weight: 700;">UNAVAILABLE</span>' : '';
        
        const card = document.createElement('div');
        card.className = 'food-card';
        card.style.cssText = unavailableStyle;
        card.innerHTML = `
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${item.id}, event)">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
            <div class="food-image" style="position: relative;">
                ${imageDisplay}
                ${unavailableBadge}
            </div>
            <div class="food-info">
                <div class="food-name">${item.name}</div>
                <div class="food-desc">${item.desc}</div>
                <div class="food-footer">
                    <div class="food-price">${formatPrice(item.price)}</div>
                    ${item.available !== false ? `<button class="add-btn" onclick="openFoodModal(${item.id})">Order</button>` : '<span style="color: #ef4444; font-size: 0.8rem;">Not Available</span>'}
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

function filterCategory(category) {
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    if (event && event.target) {
        const catItem = event.target.closest('.category-item');
        if (catItem) catItem.classList.add('active');
    }
    displayMenu(category);
}

function renderCategories() {
    const categoriesContainer = document.querySelector('.categories');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '';
    
    Object.entries(categories).forEach(([key, cat], index) => {
        // Only show categories that have items
        if (!menuData[key] || menuData[key].length === 0) return;
        
        // Determine category image display
        const catImageDisplay = cat.image 
            ? `<img src="${cat.image}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
            : cat.icon;
        
        const catEl = document.createElement('div');
        catEl.className = `category-item ${index === 0 ? 'active' : ''}`;
        catEl.onclick = () => filterCategory(key);
        catEl.innerHTML = `
            <div class="category-icon">${catImageDisplay}</div>
            <div class="category-name">${cat.name}</div>
        `;
        categoriesContainer.appendChild(catEl);
    });
}

// ========================================
// FOOD MODAL FUNCTIONS
// ========================================
function findFood(foodId) {
    for (let cat of Object.keys(menuData)) {
        const found = menuData[cat].find(item => item.id === foodId);
        if (found) return found;
    }
    return null;
}

function openFoodModal(foodId) {
    selectedFood = findFood(foodId);
    if (!selectedFood) return;
    
    // Check if food is available
    if (selectedFood.available === false) {
        alert('❌ Sorry, this item is currently not available.');
        return;
    }
    
    quantity = 1;
    selectedCustomizations = [];
    
    document.getElementById('modalFoodName').textContent = selectedFood.name;
    
    // Show image or icon
    const iconContainer = document.getElementById('modalFoodIcon');
    if (selectedFood.image) {
        iconContainer.innerHTML = `<img src="${selectedFood.image}" alt="${selectedFood.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px;">`;
    } else {
        iconContainer.innerHTML = selectedFood.icon;
    }
    
    document.getElementById('modalFoodDesc').textContent = selectedFood.desc;
    document.getElementById('modalFoodPrice').textContent = formatPrice(selectedFood.price);
    document.getElementById('quantity').textContent = '1';
    document.getElementById('specialInstructions').value = '';
    
    // Customization options
    const customSection = document.getElementById('customizationSection');
    const customOptions = document.getElementById('customOptions');
    
    if (selectedFood.options && selectedFood.options.length > 0) {
        customSection.style.display = 'block';
        customOptions.innerHTML = selectedFood.options.map((opt, i) => `
            <label style="display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer;">
                <input type="checkbox" id="opt_${i}" onchange="toggleCustomization(${i})" style="width: 20px; height: 20px; accent-color: #ff6b6b;">
                <span style="flex: 1;">${opt.name}</span>
                <span style="color: ${opt.price > 0 ? '#ff6b6b' : '#10b981'}; font-weight: 600;">
                    ${opt.price > 0 ? '+' + formatPrice(opt.price) : 'FREE'}
                </span>
            </label>
        `).join('');
    } else {
        customSection.style.display = 'none';
    }
    
    updateTotalPrice();
    openModal('foodModal');
}

function toggleCustomization(index) {
    const checkbox = document.getElementById('opt_' + index);
    if (checkbox.checked) {
        if (!selectedCustomizations.includes(index)) {
            selectedCustomizations.push(index);
        }
    } else {
        selectedCustomizations = selectedCustomizations.filter(i => i !== index);
    }
    updateTotalPrice();
}

function changeQuantity(delta) {
    quantity = Math.max(1, Math.min(20, quantity + delta));
    document.getElementById('quantity').textContent = quantity;
    updateTotalPrice();
}

function updateTotalPrice() {
    if (!selectedFood) return;
    
    let total = selectedFood.price;
    
    if (selectedFood.options) {
        selectedCustomizations.forEach(i => {
            if (selectedFood.options[i]) {
                total += selectedFood.options[i].price;
            }
        });
    }
    
    total *= quantity;
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

function addToCart() {
    if (!currentUser) {
        alert('⚠️ Please login to add items to cart');
        showLogin();
        return;
    }
    
    if (!selectedFood) return;
    
    let itemPrice = selectedFood.price;
    const extras = [];
    
    if (selectedFood.options) {
        selectedCustomizations.forEach(i => {
            if (selectedFood.options[i]) {
                extras.push(selectedFood.options[i].name);
                itemPrice += selectedFood.options[i].price;
            }
        });
    }
    
    const cartItem = {
        id: selectedFood.id,
        name: selectedFood.name,
        icon: selectedFood.icon,
        basePrice: selectedFood.price,
        extras: extras,
        finalPrice: itemPrice,
        quantity: quantity,
        instructions: document.getElementById('specialInstructions').value,
        addedAt: new Date().toISOString()
    };
    
    // Check if similar item exists
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        JSON.stringify(item.extras) === JSON.stringify(cartItem.extras) &&
        item.instructions === cartItem.instructions
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    saveCart();
    updateCartBadge();
    closeModal('foodModal');
    
    playNotificationSound();
    alert(`✅ Added to cart!\n\n${quantity}x ${selectedFood.name}\n${extras.length > 0 ? 'Extras: ' + extras.join(', ') : ''}`);
}

// ========================================
// FAVORITES FUNCTIONS
// ========================================
function toggleFavorite(foodId, event) {
    event.stopPropagation();
    
    if (!currentUser) {
        alert('⚠️ Please login to add favorites');
        showLogin();
        return;
    }
    
    if (!userFavorites[currentUser.email]) {
        userFavorites[currentUser.email] = [];
    }
    
    const favorites = userFavorites[currentUser.email];
    const index = favorites.indexOf(foodId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        event.target.innerHTML = '🤍';
        event.target.classList.remove('active');
    } else {
        favorites.push(foodId);
        event.target.innerHTML = '❤️';
        event.target.classList.add('active');
    }
    
    localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    updateFavoritesBadge();
}

function showFavorites() {
    if (!currentUser) {
        alert('⚠️ Please login to view favorites');
        showLogin();
        return;
    }
    
    const modal = document.getElementById('favoritesModal');
    const content = document.getElementById('favoritesContent');
    
    if (!modal || !content) return;
    
    const favIds = userFavorites[currentUser.email] || [];
    
    // Get existing items only (clean up deleted ones)
    const favItems = [];
    const validIds = [];
    for (let cat of Object.keys(menuData)) {
        menuData[cat].forEach(item => {
            if (favIds.includes(item.id)) {
                favItems.push(item);
                validIds.push(item.id);
            }
        });
    }
    
    // Clean up favorites if items were deleted
    if (validIds.length !== favIds.length) {
        userFavorites[currentUser.email] = validIds;
        localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
        updateFavoritesBadge();
    }
    
    if (favItems.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
                <div style="font-size: 4rem;">💔</div>
                <p>No favorites yet</p>
                <p style="font-size: 0.9rem;">Tap ❤️ on items to add them here</p>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="menu-grid" style="grid-template-columns: 1fr;">
                ${favItems.map(item => {
                    const isUnavailable = item.available === false;
                    const imageDisplay = item.image 
                        ? `<img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` 
                        : `<span style="font-size: 2.5rem;">${item.icon}</span>`;
                    
                    return `
                    <div class="food-card" style="display: grid; grid-template-columns: 70px 1fr auto; align-items: center; padding: 1rem; ${isUnavailable ? 'opacity: 0.5;' : ''}">
                        <div style="display: flex; align-items: center; justify-content: center;">${imageDisplay}</div>
                        <div>
                            <div class="food-name" style="${isUnavailable ? 'text-decoration: line-through;' : ''}">${item.name}</div>
                            <div class="food-price">${formatPrice(item.price)}</div>
                            ${isUnavailable ? '<div style="color: #ef4444; font-size: 0.75rem; font-weight: 600;">NOT AVAILABLE</div>' : ''}
                        </div>
                        ${isUnavailable 
                            ? '<span style="color: #ef4444; font-size: 0.8rem;">Unavailable</span>'
                            : `<button class="add-btn" onclick="openFoodModal(${item.id}); closeModal('favoritesModal');">Order</button>`
                        }
                    </div>
                `}).join('')}
            </div>
        `;
    }
    
    openModal('favoritesModal');
}

// ========================================
// CART FUNCTIONS
// ========================================
function showCart() {
    if (!currentUser) {
        alert('⚠️ Please login to view cart');
        showLogin();
        return;
    }
    
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!modal || !cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
                <div style="font-size: 4rem;">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem;">Add some delicious items!</p>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '£0.00';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map((item, index) => {
            const itemTotal = item.finalPrice * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <span>${item.icon} ${item.name} x${item.quantity}</span>
                        <span style="color: #ff6b6b;">${formatPrice(itemTotal)}</span>
                    </div>
                    ${item.extras.length > 0 ? `<div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">+ ${item.extras.join(', ')}</div>` : ''}
                    ${item.instructions ? `<div style="font-size: 0.85rem; color: rgba(255,255,255,0.5); font-style: italic;">Note: ${item.instructions}</div>` : ''}
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.8rem;">
                        <button onclick="updateCartItem(${index}, -1)" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">-</button>
                        <button onclick="updateCartItem(${index}, 1)" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">+</button>
                        <button onclick="removeCartItem(${index})" style="background: rgba(239,68,68,0.2); border: none; color: #ef4444; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer; margin-left: auto;">🗑️ Remove</button>
                    </div>
                </div>
            `;
        }).join('');
        
        if (cartTotal) cartTotal.textContent = formatPrice(total);
    }
    
    openModal('cartModal');
}

function updateCartItem(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartBadge();
        showCart();
    }
}

function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    showCart();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('❌ Your cart is empty!');
        return;
    }
    
    // Check if restaurant is open
    const status = getRestaurantStatus();
    if (!status.open) {
        alert(`⚠️ Sorry, we're not accepting orders right now.\n\n${status.message}\n\nOpening hours: 11:00 - 23:00\nLast orders: 22:30`);
        return;
    }
    
    if (!currentUser) {
        alert('❌ Please login first');
        showLogin();
        return;
    }
    
    // Check if user has an active order
    const activeOrder = pendingOrders.find(o => 
        o.userId === currentUser.email && 
        ['pending', 'accepted', 'waiting_driver', 'out_for_delivery'].includes(o.status)
    );
    
    if (activeOrder) {
        alert(`⚠️ You already have an active order!\n\nOrder #${activeOrder.id}\nStatus: ${activeOrder.status.replace('_', ' ').toUpperCase()}\n\nPlease wait until your current order is delivered before placing a new one.`);
        return;
    }
    
    if (!currentUser.address && !selectedLocation) {
        alert('❌ Please set your delivery address first');
        pickLocation();
        return;
    }
    
    closeModal('cartModal');
    
    // Show location confirmation modal first
    showLocationConfirmation();
}

// Check if user can order (no active orders)
function userCanOrder() {
    if (!currentUser) return false;
    
    const activeOrder = pendingOrders.find(o => 
        o.userId === currentUser.email && 
        ['pending', 'accepted', 'waiting_driver', 'out_for_delivery'].includes(o.status)
    );
    
    return !activeOrder;
}

function showLocationConfirmation() {
    const modal = document.getElementById('locationConfirmModal');
    const addressDisplay = document.getElementById('confirmLocationAddress');
    
    if (modal && addressDisplay) {
        const currentAddress = selectedLocation?.address || currentUser.address || 'No address set';
        addressDisplay.textContent = currentAddress;
        openModal('locationConfirmModal');
    }
}

function confirmCurrentLocation() {
    closeModal('locationConfirmModal');
    openCheckoutModal();
}

function changeDeliveryLocation() {
    closeModal('locationConfirmModal');
    pickLocation();
}

function openCheckoutModal() {
    // Calculate totals
    let subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    let deliveryFee = 0;
    
    if (selectedLocation) {
        const distance = calculateDistance(
            UK_CONFIG.restaurant.lat,
            UK_CONFIG.restaurant.lng,
            selectedLocation.lat,
            selectedLocation.lng
        );
        const deliveryInfo = getDeliveryCost(distance);
        if (!deliveryInfo.available) {
            alert(deliveryInfo.message);
            return;
        }
        deliveryFee = deliveryInfo.cost;
    }
    
    const total = subtotal + deliveryFee;
    
    // Populate checkout modal
    const checkoutAddress = document.getElementById('checkoutAddress');
    const checkoutItems = document.getElementById('checkoutItems');
    const paymentTotal = document.getElementById('paymentTotal');
    
    if (checkoutAddress) {
        checkoutAddress.textContent = selectedLocation?.address || currentUser.address || 'No address set';
    }
    
    if (checkoutItems) {
        checkoutItems.innerHTML = `
            ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.icon} ${item.name} x${item.quantity}</span>
                    <span>${formatPrice(item.finalPrice * item.quantity)}</span>
                </div>
            `).join('')}
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem; margin-top: 0.5rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Delivery</span>
                    <span>${deliveryFee > 0 ? formatPrice(deliveryFee) : 'FREE'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem; margin-top: 0.5rem; color: #ff6b6b;">
                    <span>Total</span>
                    <span>${formatPrice(total)}</span>
                </div>
            </div>
        `;
    }
    
    if (paymentTotal) {
        paymentTotal.textContent = formatPrice(total);
    }
    
    openModal('checkoutModal');
}

function handlePayment(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        alert('❌ Please select a payment method');
        return false;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('paymentCardNumber').value;
        const cardName = document.getElementById('paymentCardName').value;
        const expiry = document.getElementById('paymentExpiry').value;
        const cvv = document.getElementById('paymentCVV').value;
        
        if (!isValidCardNumber(cardNumber)) {
            alert('❌ Invalid card number');
            return false;
        }
        if (!cardName || cardName.length < 2) {
            alert('❌ Please enter name on card');
            return false;
        }
        if (!isValidExpiry(expiry)) {
            alert('❌ Invalid expiry date');
            return false;
        }
        if (!isValidCVV(cvv)) {
            alert('❌ Invalid CVV');
            return false;
        }
    }
    
    // Create order
    const orderId = 'ORD-' + Date.now();
    const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    let deliveryFee = 0;
    
    // Calculate distance
    let distance = 0;
    if (selectedLocation) {
        distance = calculateDistance(
            UK_CONFIG.restaurant.lat,
            UK_CONFIG.restaurant.lng,
            selectedLocation.lat,
            selectedLocation.lng
        );
        deliveryFee = getDeliveryCost(distance).cost;
    }
    
    const order = {
        id: orderId,
        userId: currentUser.email,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        items: [...cart],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: subtotal + deliveryFee,
        address: selectedLocation?.address || currentUser.address,
        deliveryLocation: selectedLocation, // Save location for distance calculation
        distance: distance, // Save distance in miles
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save order
    orderHistory.push(order);
    pendingOrders.push(order);
    
    // Add notification
    addNotification(currentUser.email, {
        type: 'order_placed',
        title: '📦 Order Placed!',
        message: `Your order #${orderId} has been placed successfully.`,
        orderId: orderId
    });
    
    saveData();
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();
    updateOrdersBadge();
    
    // Force close checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
        checkoutModal.classList.remove('active');
    }
    
    playNotificationSound();
    
    alert(`✅ Order Placed Successfully!\n\nOrder ID: ${orderId}\nTotal: ${formatPrice(order.total)}\n\nYou will receive updates on your order status.`);
    
    return false;
}

// ========================================
// NOTIFICATION FUNCTIONS
// ========================================
function addNotification(userId, notification) {
    if (!userNotifications[userId]) {
        userNotifications[userId] = [];
    }
    
    userNotifications[userId].unshift({
        ...notification,
        id: 'NOTIF-' + Date.now(),
        read: false,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    updateNotificationBadge();
}

function showNotifications() {
    if (!currentUser) {
        alert('⚠️ Please login to view notifications');
        showLogin();
        return;
    }
    
    const modal = document.getElementById('notificationsModal');
    const content = document.getElementById('notificationsContent');
    
    if (!modal || !content) return;
    
    const notifications = userNotifications[currentUser.email] || [];
    
    // Mark all as read
    notifications.forEach(n => n.read = true);
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    updateNotificationBadge();
    
    if (notifications.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
                <div style="font-size: 4rem;">🔔</div>
                <p>No notifications yet</p>
            </div>
        `;
    } else {
        content.innerHTML = notifications.map(n => {
            // Special styling for driver on way notifications
            if (n.type === 'driver_on_way') {
                return `
                    <div style="background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2)); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border: 2px solid rgba(16,185,129,0.4);">
                        <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.1rem; color: #10b981;">${n.title}</div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 0.8rem;">
                            <div style="margin-bottom: 0.5rem;">🚗 <strong>${n.driverName || 'Driver'}</strong></div>
                            ${n.driverPhone ? `<div style="margin-bottom: 0.5rem;">📞 <a href="tel:${n.driverPhone}" style="color: #3b82f6;">${n.driverPhone}</a></div>` : ''}
                            ${n.estimatedTime ? `<div style="color: #f59e0b; font-weight: 600; font-size: 1.1rem;">⏱️ Arriving in ~${n.estimatedTime} minutes</div>` : ''}
                        </div>
                        <button onclick="trackDriver('${n.orderId}'); closeModal('notificationsModal');" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 0.5rem;">
                            📍 Track Driver Live
                        </button>
                        <div style="color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 0.5rem;">${new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                `;
            }
            
            // Order completed notification with rate button
            if (n.type === 'order_completed' && n.driverId) {
                return `
                    <div style="background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2)); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border: 2px solid rgba(59,130,246,0.4);">
                        <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.1rem; color: #3b82f6;">${n.title}</div>
                        <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; white-space: pre-line; margin-bottom: 1rem;">${n.message}</div>
                        <button onclick="openDriverRating('${n.orderId}', '${n.driverId}', '${n.driverName || 'Driver'}'); closeModal('notificationsModal');" style="background: linear-gradient(45deg, #f59e0b, #d97706); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%;">
                            ⭐ Rate Driver
                        </button>
                        <div style="color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 0.5rem;">${new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                `;
            }
            
            // Default notification style
            const borderColor = n.type === 'order_accepted' ? '#10b981' : 
                               n.type === 'order_rejected' ? '#ef4444' : 
                               n.type === 'order_completed' ? '#3b82f6' : '#ff6b6b';
            
            return `
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-bottom: 0.8rem; border-left: 3px solid ${borderColor};">
                    <div style="font-weight: 600; margin-bottom: 0.3rem;">${n.title}</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; white-space: pre-line;">${n.message}</div>
                    <div style="color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 0.5rem;">${new Date(n.createdAt).toLocaleString()}</div>
                </div>
            `;
        }).join('');
    }
    
    openModal('notificationsModal');
}

// ========================================
// ACCOUNT FUNCTIONS
// ========================================
function showAccount() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const modal = document.getElementById('accountModal');
    const content = document.getElementById('accountContent');
    
    if (!modal || !content) return;
    
    const userOrders = orderHistory.filter(o => o.userId === currentUser.email);
    const activeOrders = pendingOrders.filter(o => o.userId === currentUser.email && o.status === 'out_for_delivery');
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    
    // Profile picture display
    const profilePic = currentUser.profilePicture 
        ? `<img src="${currentUser.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`
        : '👤';
    
    content.innerHTML = `
        <div style="background: linear-gradient(135deg, #e63946, #c1121f); padding: 1.5rem; border-radius: 15px; text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 0.8rem; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                ${profilePic}
            </div>
            <h3 style="margin: 0; color: white; font-size: 1.2rem;">${currentUser.name}</h3>
            <p style="margin: 0.3rem 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">${currentUser.email}</p>
            ${currentUser.age ? `<p style="margin: 0.2rem 0 0; color: rgba(255,255,255,0.7); font-size: 0.85rem;">Age: ${currentUser.age}</p>` : ''}
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem;">
            <div style="background: rgba(42,157,143,0.15); padding: 0.8rem; border-radius: 10px; text-align: center; border: 1px solid rgba(42,157,143,0.3);">
                <div style="font-size: 1.3rem; font-weight: 700; color: #2a9d8f;">${userOrders.length}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Orders</div>
            </div>
            <div style="background: rgba(230,57,70,0.15); padding: 0.8rem; border-radius: 10px; text-align: center; border: 1px solid rgba(230,57,70,0.3);">
                <div style="font-size: 1.3rem; font-weight: 700; color: #e63946;">${formatPrice(totalSpent)}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Total Spent</div>
            </div>
        </div>
        
        <!-- User Details -->
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-bottom: 1.2rem; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                <span style="color: rgba(255,255,255,0.6);">📞 Phone</span>
                <span>${currentUser.phone || 'Not set'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                <span style="color: rgba(255,255,255,0.6);">📍 Address</span>
                <span style="text-align: right; max-width: 60%;">${currentUser.address || 'Not set'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: rgba(255,255,255,0.6);">📅 Member</span>
                <span>${currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
        </div>
        
        <!-- Active Deliveries -->
        ${activeOrders.length > 0 ? `
            <div style="background: linear-gradient(135deg, rgba(42,157,143,0.2), rgba(42,157,143,0.1)); padding: 1rem; border-radius: 12px; margin-bottom: 1.2rem; border: 2px solid rgba(42,157,143,0.4);">
                <h4 style="margin: 0 0 0.8rem 0; color: #2a9d8f; font-size: 0.95rem;">🚗 Active Delivery</h4>
                ${activeOrders.map(o => `
                    <div style="background: rgba(0,0,0,0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem;">
                        <div style="font-weight: 600; margin-bottom: 0.3rem;">#${o.id}</div>
                        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Driver: ${o.driverName || 'Assigned'}</div>
                        ${o.estimatedTime ? `<div style="font-size: 0.85rem; color: #f4a261;">ETA: ~${o.estimatedTime} mins</div>` : ''}
                    </div>
                    <button onclick="trackDriver('${o.id}')" style="background: linear-gradient(45deg, #2a9d8f, #218373); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; font-size: 0.9rem;">
                        📍 Track Driver Live
                    </button>
                `).join('')}
            </div>
        ` : ''}
        
        <!-- Action Buttons -->
        <div style="display: grid; gap: 0.6rem;">
            <button onclick="openEditProfile()" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 0.9rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.95rem;">
                ✏️ Edit Profile
            </button>
            <button onclick="openChangeEmail()" style="background: linear-gradient(45deg, #f4a261, #e76f51); color: white; border: none; padding: 0.9rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.95rem;">
                📧 Change Email
            </button>
            <button onclick="openChangePassword()" style="background: linear-gradient(45deg, #ef4444, #dc2626); color: white; border: none; padding: 0.9rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.95rem;">
                🔒 Change Password
            </button>
        </div>
        
        <button onclick="logout()" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 2px solid #ef4444; padding: 0.9rem; border-radius: 10px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 1rem; font-size: 0.95rem;">
            🚪 Logout
        </button>
    `;
    
    openModal('accountModal');
}

// ========================================
// ========================================
// ORDER HISTORY (Separate from Account)
// ========================================
function showOrderHistory() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const modal = document.getElementById('orderHistoryModal');
    const content = document.getElementById('orderHistoryContent');
    
    if (!modal || !content) return;
    
    const userOrders = [...orderHistory.filter(o => o.userId === currentUser.email)];
    const pendingUserOrders = pendingOrders.filter(o => o.userId === currentUser.email);
    const allOrders = [...pendingUserOrders, ...userOrders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    if (allOrders.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                <p>No orders yet</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">Your order history will appear here</p>
            </div>
        `;
    } else {
        content.innerHTML = allOrders.map(o => {
            const statusColor = o.status === 'completed' ? '#2a9d8f' : 
                               o.status === 'pending' ? '#f4a261' : 
                               o.status === 'out_for_delivery' ? '#3b82f6' : 
                               o.status === 'accepted' || o.status === 'waiting_driver' ? '#2a9d8f' : '#ef4444';
            
            const statusText = o.status.replace(/_/g, ' ').toUpperCase();
            const paymentIcon = o.paymentMethod === 'cash' ? '💷' : o.paymentMethod === 'applepay' ? '🍎' : '💳';
            
            // Get driver info for active deliveries only
            const driver = o.status === 'out_for_delivery' && o.driverId ? window.driverSystem.get(o.driverId) : null;
            
            return `
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; margin-bottom: 0.8rem; border-left: 3px solid ${statusColor};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                        <span style="font-weight: 700; font-size: 0.95rem;">#${o.id}</span>
                        <span style="color: ${statusColor}; font-size: 0.75rem; font-weight: 600; background: ${statusColor}20; padding: 0.2rem 0.6rem; border-radius: 10px;">${statusText}</span>
                    </div>
                    
                    <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem;">
                        ${o.items.map(i => `${i.name}`).join(', ')}
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">${o.items.length} items</span>
                        <span style="font-weight: 700; color: #2a9d8f;">${formatPrice(o.total)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${new Date(o.createdAt).toLocaleString()}</span>
                        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.5);">${paymentIcon} ${o.paymentMethod || 'N/A'}</span>
                    </div>
                    
                    ${o.driverRated ? `<div style="font-size: 0.75rem; color: #f4a261; margin-top: 0.4rem;">⭐ Rated ${o.driverRating}/5 ${o.driverRatingComment ? '- "' + o.driverRatingComment + '"' : ''}</div>` : ''}
                    
                    ${o.status === 'out_for_delivery' && driver ? `
                        <div style="display: flex; align-items: center; gap: 0.8rem; margin-top: 0.8rem; padding: 0.8rem; background: rgba(59,130,246,0.1); border-radius: 8px;">
                            ${driver.profilePic ? `<img src="${driver.profilePic}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">` : '<div style="width: 45px; height: 45px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🚗</div>'}
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 0.9rem;">${driver.name || o.driverName || 'Driver'}</div>
                                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6);">On the way to you</div>
                            </div>
                        </div>
                        <button onclick="trackDriver('${o.id}'); closeModal('orderHistoryModal');" style="background: linear-gradient(45deg, #2a9d8f, #218373); color: white; border: none; padding: 0.7rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 0.5rem; font-size: 0.9rem;">
                            📍 Track Driver Live
                        </button>
                    ` : ''}
                    
                    ${o.status === 'completed' && o.driverId && !o.driverRated ? `
                        <button onclick="openDriverRating('${o.id}', '${o.driverId}', '${o.driverName || 'Driver'}'); closeModal('orderHistoryModal');" style="background: linear-gradient(45deg, #f4a261, #e76f51); color: white; border: none; padding: 0.7rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 0.8rem; font-size: 0.9rem;">
                            ⭐ Rate Driver
                        </button>
                    ` : ''}
                    
                    <button onclick="reorderFromHistory('${o.id}'); closeModal('orderHistoryModal');" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 0.6rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 0.5rem; font-size: 0.85rem;">
                        🔄 Reorder
                    </button>
                </div>
            `;
        }).join('');
    }
    
    openModal('orderHistoryModal');
}

function updateOrdersBadge() {
    const badge = document.getElementById('ordersBadge');
    if (badge && currentUser) {
        const activeOrders = pendingOrders.filter(o => 
            o.userId === currentUser.email && 
            ['pending', 'accepted', 'waiting_driver', 'out_for_delivery'].includes(o.status)
        ).length;
        badge.textContent = activeOrders;
        badge.style.display = activeOrders > 0 ? 'flex' : 'none';
    }
}

// ========================================
// REORDER FUNCTIONS
// ========================================
let reorderData = null;

function reorderFromHistory(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) {
        alert('❌ Order not found');
        return;
    }
    
    reorderData = order;
    
    // Show reorder modal
    const modal = document.getElementById('reorderModal');
    const itemsList = document.getElementById('reorderItemsList');
    const totalDisplay = document.getElementById('reorderTotal');
    
    if (modal && itemsList && totalDisplay) {
        itemsList.innerHTML = order.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${item.icon} ${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.finalPrice * item.quantity)}</span>
            </div>
        `).join('');
        
        totalDisplay.querySelector('span:last-child').textContent = formatPrice(order.total);
        
        closeModal('accountModal');
        openModal('reorderModal');
    }
}

function confirmReorder() {
    if (!reorderData) return;
    
    // Check if any items are unavailable
    const unavailableItems = [];
    reorderData.items.forEach(item => {
        const currentItem = findFood(item.id);
        if (!currentItem || currentItem.available === false) {
            unavailableItems.push(item.name);
        }
    });
    
    if (unavailableItems.length > 0) {
        alert(`❌ Some items are no longer available:\n\n${unavailableItems.join('\n')}\n\nPlease order from the menu.`);
        closeModal('reorderModal');
        return;
    }
    
    // Clear current cart
    cart = [];
    
    // Add all items from the order to cart
    reorderData.items.forEach(item => {
        cart.push({
            ...item,
            addedAt: new Date().toISOString()
        });
    });
    
    // Save cart
    if (currentUser) {
        localStorage.setItem('cart_' + currentUser.email, JSON.stringify(cart));
    }
    
    updateCartBadge();
    
    closeModal('reorderModal');
    
    // Show location confirmation
    showLocationConfirmation();
}

// ========================================
// PROFILE EDITING FUNCTIONS
// ========================================
function openEditProfile() {
    closeModal('accountModal');
    
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    
    // Pre-fill form with current data
    document.getElementById('editName').value = currentUser.name || '';
    document.getElementById('editAge').value = currentUser.age || '';
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editAddress').value = currentUser.address || '';
    
    // Show profile picture
    const preview = document.getElementById('profilePicPreview');
    if (currentUser.profilePicture) {
        preview.innerHTML = `<img src="${currentUser.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        preview.innerHTML = '👤';
    }
    
    openModal('editProfileModal');
}

function previewProfilePic(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profilePicPreview');
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            // Store temporarily
            preview.dataset.newPic = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveProfileChanges(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const name = document.getElementById('editName').value.trim();
    const age = document.getElementById('editAge').value;
    const phone = document.getElementById('editPhone').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const preview = document.getElementById('profilePicPreview');
    const newPic = preview.dataset.newPic;
    
    if (!name) {
        alert('❌ Name is required');
        return false;
    }
    
    // Update current user
    currentUser.name = name;
    currentUser.age = age ? parseInt(age) : null;
    currentUser.phone = phone;
    currentUser.address = address || (selectedLocation ? selectedLocation.address : currentUser.address);
    
    // Update location if selected
    if (selectedLocation) {
        currentUser.location = selectedLocation;
    }
    
    if (newPic) {
        currentUser.profilePicture = newPic;
    }
    
    // Update in database
    const userIndex = userDatabase.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        userDatabase[userIndex] = { ...userDatabase[userIndex], ...currentUser };
    }
    
    // Save
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveData();
    
    // Force close modal
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
    
    // Show success and refresh account
    alert('✅ Profile updated successfully!');
    showAccount();
    
    return false;
}

function openChangeEmail() {
    closeModal('accountModal');
    
    const modal = document.getElementById('changeEmailModal');
    if (modal) {
        // Clear form
        document.getElementById('emailCurrentPassword').value = '';
        document.getElementById('newEmail').value = '';
        document.getElementById('confirmNewEmail').value = '';
        
        openModal('changeEmailModal');
    }
}

function verifyAndChangeEmail(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('emailCurrentPassword').value;
    const newEmail = document.getElementById('newEmail').value.trim();
    const confirmEmail = document.getElementById('confirmNewEmail').value.trim();
    
    // Verify current password
    if (currentPassword !== currentUser.password) {
        alert('❌ Current password is incorrect');
        return;
    }
    
    // Check email match
    if (newEmail !== confirmEmail) {
        alert('❌ Emails do not match');
        return;
    }
    
    // Check if email already exists
    if (userDatabase.some(u => u.email === newEmail && u.email !== currentUser.email)) {
        alert('❌ This email is already registered');
        return;
    }
    
    // Update email
    const oldEmail = currentUser.email;
    
    // Update in database
    const userIndex = userDatabase.findIndex(u => u.email === oldEmail);
    if (userIndex !== -1) {
        userDatabase[userIndex].email = newEmail;
    }
    
    // Update current user
    currentUser.email = newEmail;
    
    // Update related data (favorites, notifications, cart)
    if (userFavorites[oldEmail]) {
        userFavorites[newEmail] = userFavorites[oldEmail];
        delete userFavorites[oldEmail];
    }
    
    if (userNotifications[oldEmail]) {
        userNotifications[newEmail] = userNotifications[oldEmail];
        delete userNotifications[oldEmail];
    }
    
    const oldCart = localStorage.getItem('cart_' + oldEmail);
    if (oldCart) {
        localStorage.setItem('cart_' + newEmail, oldCart);
        localStorage.removeItem('cart_' + oldEmail);
    }
    
    // Save all changes
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveData();
    
    closeModal('changeEmailModal');
    showAccount();
    
    alert('✅ Email changed successfully to: ' + newEmail);
}

function openChangePassword() {
    closeModal('accountModal');
    
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        openModal('changePasswordModal');
    }
}

function verifyAndChangePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    // Verify current password
    if (currentPassword !== currentUser.password) {
        alert('❌ Current password is incorrect');
        return;
    }
    
    // Check password length
    if (newPassword.length < 6) {
        alert('❌ New password must be at least 6 characters');
        return;
    }
    
    // Check password match
    if (newPassword !== confirmPassword) {
        alert('❌ New passwords do not match');
        return;
    }
    
    // Check if new password is same as old
    if (newPassword === currentPassword) {
        alert('❌ New password must be different from current password');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    
    // Update in database
    const userIndex = userDatabase.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        userDatabase[userIndex].password = newPassword;
    }
    
    // Save
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveData();
    
    closeModal('changePasswordModal');
    showAccount();
    
    alert('✅ Password changed successfully!');
}

function logout() {
    if (!confirm('Are you sure you want to logout?')) return;
    
    currentUser = null;
    cart = [];
    localStorage.removeItem('currentUser');
    updateHeaderForLoggedInUser();
    updateCartBadge();
    updateFavoritesBadge();
    updateNotificationBadge();
    closeModal('accountModal');
    
    alert('✅ Logged out successfully');
}

// ========================================
// AUTH FUNCTIONS
// ========================================
function showLogin() {
    if (isSignUpMode) toggleAuthMode();
    openModal('loginModal');
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    
    const title = document.getElementById('authTitle');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const ageGroup = document.getElementById('ageGroup');
    const addressGroup = document.getElementById('addressGroup');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('authToggleText');
    
    if (isSignUpMode) {
        if (title) title.textContent = '📝 Create Account';
        if (nameGroup) nameGroup.style.display = 'block';
        if (phoneGroup) phoneGroup.style.display = 'block';
        if (ageGroup) ageGroup.style.display = 'block';
        if (addressGroup) addressGroup.style.display = 'block';
        if (submitBtn) submitBtn.textContent = 'Sign Up';
        if (toggleText) toggleText.textContent = 'Already have an account?';
    } else {
        if (title) title.textContent = '🔐 Login';
        if (nameGroup) nameGroup.style.display = 'none';
        if (phoneGroup) phoneGroup.style.display = 'none';
        if (ageGroup) ageGroup.style.display = 'none';
        if (addressGroup) addressGroup.style.display = 'none';
        if (submitBtn) submitBtn.textContent = 'Login';
        if (toggleText) toggleText.textContent = "Don't have an account?";
    }
}

function handleEmailAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName')?.value.trim();
    const phone = document.getElementById('authPhone')?.value.trim();
    const age = document.getElementById('authAge')?.value;
    
    const emailValidation = isValidEmail(email);
    if (!emailValidation.valid) {
        alert(emailValidation.message);
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }
    
    if (isSignUpMode) {
        const existingUser = userDatabase.find(u => u.email === email);
        if (existingUser) {
            alert('❌ Email already registered!');
            return;
        }
        
        if (!name || name.length < 2) {
            alert('❌ Name must be at least 2 characters');
            return;
        }
        
        if (phone && !isValidPhone(phone)) {
            alert('❌ Invalid phone number');
            return;
        }
        
        // Generate verification code
        const verificationCode = generateVerificationCode();
        pendingVerification = {
            email: email,
            password: password,
            name: name,
            phone: phone,
            age: age ? parseInt(age) : null,
            code: verificationCode,
            type: 'signup'
        };
        
        sendVerificationEmail(email, verificationCode);
        
        document.getElementById('authFormSection').style.display = 'none';
        document.getElementById('emailVerificationSection').style.display = 'block';
        document.getElementById('verifyEmailDisplay').textContent = email;
        
    } else {
        // Login
        const existingUser = userDatabase.find(u => u.email === email);
        if (!existingUser) {
            alert('❌ Account not found!');
            return;
        }
        
        if (existingUser.password !== password) {
            alert('❌ Incorrect password!');
            return;
        }
        
        // Send verification code for login
        const verificationCode = generateVerificationCode();
        pendingVerification = {
            user: existingUser,
            code: verificationCode,
            type: 'login'
        };
        
        sendVerificationEmail(email, verificationCode);
        
        document.getElementById('authFormSection').style.display = 'none';
        document.getElementById('emailVerificationSection').style.display = 'block';
        document.getElementById('verifyEmailDisplay').textContent = email;
    }
}

function verifyCode() {
    const enteredCode = document.getElementById('verificationCode').value;
    
    if (!pendingVerification) {
        alert('❌ No verification pending');
        return;
    }
    
    if (enteredCode !== pendingVerification.code) {
        alert('❌ Invalid verification code');
        return;
    }
    
    if (pendingVerification.type === 'signup') {
        // Create new user
        const newUser = {
            name: pendingVerification.name,
            email: pendingVerification.email,
            password: pendingVerification.password,
            phone: pendingVerification.phone,
            age: pendingVerification.age,
            address: selectedLocation?.address || null,
            location: selectedLocation,
            verified: true,
            createdAt: new Date().toISOString()
        };
        
        userDatabase.push(newUser);
        currentUser = newUser;
        
    } else if (pendingVerification.type === 'login') {
        currentUser = pendingVerification.user;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('restaurantUsers', JSON.stringify(userDatabase));
    
    pendingVerification = null;
    
    // Reset form
    document.getElementById('authFormSection').style.display = 'block';
    document.getElementById('emailVerificationSection').style.display = 'none';
    document.getElementById('verificationCode').value = '';
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    if (document.getElementById('authName')) document.getElementById('authName').value = '';
    if (document.getElementById('authPhone')) document.getElementById('authPhone').value = '';
    
    updateHeaderForLoggedInUser();
    updateFavoritesBadge();
    updateNotificationBadge();
    
    closeModal('loginModal');
    
    alert(`✅ Welcome${currentUser.name ? ', ' + currentUser.name : ''}!\n\nYou are now logged in.`);
}

function resendCode() {
    if (!pendingVerification) return;
    
    const newCode = generateVerificationCode();
    pendingVerification.code = newCode;
    
    const email = pendingVerification.email || pendingVerification.user?.email;
    sendVerificationEmail(email, newCode);
}

function loginWithGoogle() {
    alert(`🔵 Google Sign-In\n\nGoogle authentication would be configured here.\n\nFor demo, use email signup with Gmail.`);
}

function loginWithApple() {
    alert(`🍎 Apple Sign-In\n\nApple authentication would be configured here.\n\nFor demo, use email signup with iCloud.`);
}

// ========================================
// RESTAURANT DASHBOARD (FOR EMPLOYERS)
// ========================================
function showRestaurantLogin() {
    openModal('restaurantLoginModal');
}

function handleRestaurantLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('restaurantEmail').value;
    const password = document.getElementById('restaurantPassword').value;
    
    if (email === RESTAURANT_CREDENTIALS.email && password === RESTAURANT_CREDENTIALS.password) {
        isRestaurantLoggedIn = true;
        closeModal('restaurantLoginModal');
        closeModal('loginModal');
        
        setTimeout(() => {
            showRestaurantDashboard();
        }, 300);
    } else if (email === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
        // Also allow owner credentials for restaurant dashboard
        isRestaurantLoggedIn = true;
        closeModal('restaurantLoginModal');
        closeModal('loginModal');
        
        setTimeout(() => {
            showRestaurantDashboard();
        }, 300);
    } else {
        alert('❌ Invalid credentials!\n\nDemo: staff@antalyashawarma.com / staff2024');
    }
}

function showRestaurantDashboard() {
    const modal = document.getElementById('restaurantDashboard');
    if (!modal) return;
    
    // Calculate DAILY stats (today only)
    const now = new Date();
    const today = now.toDateString();
    
    // Filter orders from today
    const dailyOrders = [...pendingOrders, ...orderHistory].filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today;
    });
    
    const dailyRevenue = dailyOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = pendingOrders.filter(o => o.status === 'pending').length;
    const completedCount = dailyOrders.filter(o => o.status === 'completed').length;
    
    // Update stats - Daily only (no total revenue for staff)
    const dailyRevenueEl = document.getElementById('monthlyRevenueStat');
    const dailyOrdersEl = document.getElementById('monthlyOrdersStat');
    const pendingOrdersEl = document.getElementById('pendingOrdersStat');
    const completedOrdersEl = document.getElementById('completedOrdersStat');
    
    if (dailyRevenueEl) dailyRevenueEl.textContent = formatPrice(dailyRevenue);
    if (dailyOrdersEl) dailyOrdersEl.textContent = dailyOrders.length;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingCount;
    if (completedOrdersEl) completedOrdersEl.textContent = completedCount;
    
    // Render pending orders
    const ordersContainer = document.getElementById('restaurantPendingOrders');
    if (ordersContainer) {
        if (pendingOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
                    <div style="font-size: 4rem;">📦</div>
                    <p>No pending orders</p>
                </div>
            `;
        } else {
            ordersContainer.innerHTML = pendingOrders.map(order => {
                // Get user profile picture
                const user = userDatabase.find(u => u.email === order.userId);
                const profilePic = user && user.profilePicture 
                    ? `<img src="${user.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : '👤';
                
                return `
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid ${order.status === 'pending' ? '#f59e0b' : order.status === 'accepted' ? '#10b981' : '#3b82f6'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-weight: 700; font-size: 1.1rem;">#${order.id}</span>
                        <span style="background: ${order.status === 'pending' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${order.status === 'pending' ? '#f59e0b' : '#10b981'}; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">${order.status.toUpperCase()}</span>
                    </div>
                    
                    <!-- Customer Info with Profile Picture -->
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; overflow: hidden; flex-shrink: 0; border: 3px solid rgba(255,255,255,0.2);">
                            ${profilePic}
                        </div>
                        <div style="flex: 1; font-size: 0.95rem;">
                            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.3rem;">${order.userName}</div>
                            <div style="color: rgba(255,255,255,0.7);">📞 ${order.userPhone || 'N/A'}</div>
                            <div style="color: rgba(255,255,255,0.7);">📍 ${order.address || 'N/A'}</div>
                            ${user && user.age ? `<div style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">Age: ${user.age}</div>` : ''}
                        </div>
                    </div>
                    
                    <div style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-bottom: 1rem;">🕐 ${new Date(order.createdAt).toLocaleString()}</div>
                    
                    <!-- Payment Method Badge -->
                    <div style="background: ${order.paymentMethod === 'cash' ? 'rgba(245,158,11,0.2)' : order.paymentMethod === 'applepay' ? 'rgba(0,0,0,0.3)' : 'rgba(59,130,246,0.2)'}; padding: 0.5rem 1rem; border-radius: 8px; margin-bottom: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                        ${order.paymentMethod === 'cash' ? '💷 CASH' : order.paymentMethod === 'applepay' ? '🍎 Apple Pay' : '💳 CARD'} ${order.paymentMethod === 'cash' ? '- Collect Payment' : '- PAID'}
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">Items:</div>
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.3rem;">
                                <span>${item.icon} ${item.name} x${item.quantity}</span>
                                <span>${formatPrice(item.finalPrice * item.quantity)}</span>
                            </div>
                        `).join('')}
                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem; margin-top: 0.5rem; font-weight: 700; display: flex; justify-content: space-between;">
                            <span>Total:</span>
                            <span style="color: #ff6b6b;">${formatPrice(order.total)}</span>
                        </div>
                    </div>
                    
                    ${order.status === 'pending' ? `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                            <button onclick="acceptOrder('${order.id}')" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600;">✅ Accept</button>
                            <button onclick="rejectOrder('${order.id}')" style="background: linear-gradient(45deg, #ef4444, #dc2626); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600;">❌ Reject</button>
                        </div>
                    ` : order.status === 'accepted' ? `
                        <div style="display: grid; gap: 0.5rem;">
                            <button onclick="notifyAllAvailableDrivers('${order.id}')" style="background: linear-gradient(45deg, #f59e0b, #d97706); color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                                📢 Notify All Drivers
                            </button>
                            <button onclick="assignDriver('${order.id}')" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600;">🚗 Assign Specific Driver</button>
                        </div>
                    ` : order.status === 'driver_assigned' || order.status === 'out_for_delivery' ? `
                        <div style="background: rgba(16,185,129,0.2); padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-weight: 600; color: #10b981;">🚗 Driver: ${order.driverName || 'Assigned'}</div>
                            ${order.estimatedTime ? `<div style="font-size: 0.9rem; color: rgba(255,255,255,0.7);">ETA: ${order.estimatedTime} mins</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `}).join('');
        }
    }
    
    modal.style.display = 'block';
}

function acceptOrder(orderId) {
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = 'accepted';
    order.acceptedAt = new Date().toISOString();
    saveData();
    
    // Send notification to customer
    addNotification(order.userId, {
        type: 'order_accepted',
        title: '✅ Order Accepted!',
        message: `Your order #${orderId} has been accepted and is being prepared.`,
        orderId: orderId
    });
    
    playNotificationSound();
    showRestaurantDashboard();
    
    alert(`✅ Order #${orderId} accepted!\n\nClick "Notify All Drivers" to alert available drivers.`);
}

function notifyAllAvailableDrivers(orderId) {
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (order.driverId) {
        alert('⚠️ This order already has a driver assigned!');
        return;
    }
    
    const availableDrivers = window.driverSystem.getAvailable();
    
    if (availableDrivers.length === 0) {
        alert('⚠️ No available drivers at the moment!');
        return;
    }
    
    // Mark order as waiting for driver
    order.status = 'waiting_driver';
    order.notifiedDrivers = availableDrivers.map(d => d.id);
    saveData();
    
    // Store available order for drivers
    if (!window.availableOrdersForDrivers) {
        window.availableOrdersForDrivers = {};
    }
    window.availableOrdersForDrivers[orderId] = {
        orderId: orderId,
        order: order,
        notifiedAt: new Date().toISOString(),
        claimedBy: null
    };
    
    // Save to localStorage
    localStorage.setItem('availableOrdersForDrivers', JSON.stringify(window.availableOrdersForDrivers));
    
    let notifiedList = '📢 Notification sent to available drivers:\n\n';
    availableDrivers.forEach(driver => {
        notifiedList += `✅ ${driver.name} (${driver.phone})\n`;
    });
    
    playNotificationSound();
    showRestaurantDashboard();
    alert(notifiedList + `\n${availableDrivers.length} driver(s) notified!\n\nFirst driver to accept will get the order.`);
}

// Calculate delivery time based on distance
function calculateDeliveryTime(distanceMiles) {
    // Base time: 10 minutes per mile
    // Plus 5 minutes for preparation
    const timePerMile = 10; // minutes
    const prepTime = 5; // minutes
    
    const deliveryTime = Math.ceil(distanceMiles * timePerMile) + prepTime;
    return deliveryTime;
}

// Calculate distance between two coordinates
function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Driver accepts order
function driverAcceptOrder(orderId) {
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (!driverId) {
        alert('❌ Please login first');
        return;
    }
    
    const driver = window.driverSystem.get(driverId);
    if (!driver) return;
    
    // Check if order is still available
    const availableOrder = window.availableOrdersForDrivers?.[orderId];
    if (!availableOrder) {
        alert('❌ This order is no longer available!');
        showDriverDashboard();
        return;
    }
    
    if (availableOrder.claimedBy && availableOrder.claimedBy !== driverId) {
        alert('❌ Sorry, another driver already accepted this order!');
        showDriverDashboard();
        return;
    }
    
    // Find the actual order
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) {
        alert('❌ Order not found!');
        return;
    }
    
    // Mark order as claimed by this driver
    availableOrder.claimedBy = driverId;
    
    // Calculate distance from restaurant to customer
    let distanceMiles = 2; // Default
    let estimatedTime = 25; // Default
    
    if (order.deliveryLocation && order.deliveryLocation.lat) {
        distanceMiles = getDistanceFromLatLng(
            UK_CONFIG.restaurant.lat,
            UK_CONFIG.restaurant.lng,
            order.deliveryLocation.lat,
            order.deliveryLocation.lng
        );
        estimatedTime = calculateDeliveryTime(distanceMiles);
    } else if (order.distance) {
        distanceMiles = order.distance;
        estimatedTime = calculateDeliveryTime(distanceMiles);
    }
    
    // Update order
    order.driverId = driverId;
    order.driverName = driver.name;
    order.driverPhone = driver.phone;
    order.status = 'out_for_delivery';
    order.driverAcceptedAt = new Date().toISOString();
    order.estimatedTime = estimatedTime;
    order.distanceMiles = distanceMiles.toFixed(1);
    
    // Remove from available orders
    delete window.availableOrdersForDrivers[orderId];
    localStorage.setItem('availableOrdersForDrivers', JSON.stringify(window.availableOrdersForDrivers));
    
    saveData();
    
    // Notify customer with driver info and ETA
    addNotification(order.userId, {
        type: 'driver_on_way',
        title: '🚗 Driver On The Way!',
        message: `${driver.name} is delivering your order #${orderId}.\n📞 ${driver.phone}\n⏱️ Estimated arrival: ${estimatedTime} minutes\n📍 Distance: ${distanceMiles.toFixed(1)} miles`,
        orderId: orderId,
        driverName: driver.name,
        driverPhone: driver.phone,
        estimatedTime: estimatedTime
    });
    
    playNotificationSound();
    
    alert(`✅ Order #${orderId} accepted!\n\n📍 Distance: ${distanceMiles.toFixed(1)} miles\n⏱️ Estimated time: ${estimatedTime} minutes\n\nClick "Directions" to navigate to customer.`);
    
    showDriverDashboard();
}

function rejectOrder(orderId) {
    const reason = prompt('Reason for rejection (optional):');
    
    const orderIndex = pendingOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = pendingOrders[orderIndex];
    order.status = 'rejected';
    order.rejectionReason = reason;
    
    // Move to history
    pendingOrders.splice(orderIndex, 1);
    saveData();
    
    // Send notification to customer
    addNotification(order.userId, {
        type: 'order_rejected',
        title: '❌ Order Rejected',
        message: `Your order #${orderId} has been rejected.${reason ? ' Reason: ' + reason : ''}`,
        orderId: orderId
    });
    
    showRestaurantDashboard();
    alert(`❌ Order #${orderId} rejected`);
}

function assignDriver(orderId) {
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const availableDrivers = window.driverSystem.getAvailable();
    
    if (availableDrivers.length === 0) {
        alert('❌ No available drivers at the moment!\n\nAll drivers are either offline or inactive.');
        return;
    }
    
    // Create a nice selection dialog
    let driverList = '🚗 Available Drivers:\n\n';
    availableDrivers.forEach((d, i) => {
        driverList += `${i + 1}. ${d.name}\n   📦 ${d.deliveries} deliveries | ⭐ ${d.rating}\n   📞 ${d.phone}\n\n`;
    });
    
    const selection = prompt(driverList + 'Enter driver number (or 0 to notify all):');
    
    if (selection === null) return;
    
    if (selection === '0') {
        notifyAllAvailableDrivers(orderId);
        return;
    }
    
    const driverIndex = parseInt(selection) - 1;
    if (isNaN(driverIndex) || driverIndex < 0 || driverIndex >= availableDrivers.length) {
        alert('❌ Invalid selection');
        return;
    }
    
    const selectedDriver = availableDrivers[driverIndex];
    order.driverId = selectedDriver.id;
    order.assignedDriver = selectedDriver.id;
    order.driverName = selectedDriver.name;
    order.status = 'out_for_delivery';
    saveData();
    
    // Send notification to customer
    addNotification(order.userId, {
        type: 'driver_assigned',
        title: '🚗 Driver Assigned!',
        message: `${selectedDriver.name} is on the way with your order #${orderId}.`,
        orderId: orderId
    });
    
    playNotificationSound();
    showRestaurantDashboard();
    alert(`✅ Driver ${selectedDriver.name} assigned to order #${orderId}\n\n📞 Driver phone: ${selectedDriver.phone}`);
}

function completeOrder(orderId) {
    const orderIndex = pendingOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = pendingOrders[orderIndex];
    order.status = 'completed';
    order.completedAt = new Date().toISOString();
    
    // Move to history and remove from pending
    const historyOrder = orderHistory.find(o => o.id === orderId);
    if (historyOrder) {
        historyOrder.status = 'completed';
        historyOrder.completedAt = order.completedAt;
    }
    
    pendingOrders.splice(orderIndex, 1);
    saveData();
    
    // Send notification to customer
    addNotification(order.userId, {
        type: 'order_completed',
        title: '✅ Order Delivered!',
        message: `Your order #${orderId} has been delivered. Enjoy your meal!`,
        orderId: orderId
    });
    
    showRestaurantDashboard();
    playNotificationSound();
    alert(`✅ Order #${orderId} completed!`);
}

function closeRestaurantDashboard() {
    isRestaurantLoggedIn = false;
    document.getElementById('restaurantDashboard').style.display = 'none';
}

// ========================================
// DRIVER MANAGEMENT (OWNER ONLY)
// ========================================
function showDriverManagementModal() {
    if (!isOwnerLoggedIn) {
        alert('❌ Owner access required!');
        return;
    }
    
    renderDriverList();
    openModal('driverManagementModal');
}

function renderDriverList() {
    const container = document.getElementById('driverListContainer');
    if (!container) return;
    
    const allDrivers = window.driverSystem.getAll();
    
    if (allDrivers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                <div style="font-size: 3rem;">🚗</div>
                <p>No drivers registered yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = allDrivers.map(driver => {
        const profilePic = driver.profilePicture 
            ? `<img src="${driver.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : '🚗';
        const statusColor = driver.active ? '#10b981' : '#ef4444';
        const statusText = driver.active ? '🟢 Active' : '🔴 Inactive';
        const availableText = driver.available ? '✅ Available' : '⏸️ Unavailable';
        
        return `
        <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid ${statusColor};">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; overflow: hidden; flex-shrink: 0; border: 3px solid ${statusColor};">
                    ${profilePic}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: white;">${driver.name}</div>
                    <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">Code: <strong>${driver.secretCode}</strong></div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <span style="font-size: 0.8rem; color: ${driver.active ? '#10b981' : '#ef4444'};">${statusText}</span>
                        <span style="font-size: 0.8rem; color: ${driver.available ? '#3b82f6' : '#f59e0b'};">${availableText}</span>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">
                <div>📧 ${driver.email}</div>
                <div>📞 ${driver.phone}</div>
                <div>📦 ${driver.deliveries || 0} deliveries</div>
                <div>⭐ ${driver.rating || 5.0} rating</div>
                ${driver.dob ? `<div>🎂 ${new Date(driver.dob).toLocaleDateString()}</div>` : ''}
                ${driver.gender ? `<div>👤 ${driver.gender.charAt(0).toUpperCase() + driver.gender.slice(1)}</div>` : ''}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                <button onclick="editDriver('${driver.id}')" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">✏️ Edit</button>
                <button onclick="toggleDriverStatus('${driver.id}')" style="background: ${driver.active ? 'linear-gradient(45deg, #f59e0b, #d97706)' : 'linear-gradient(45deg, #10b981, #059669)'}; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">${driver.active ? '⏸️ Deactivate' : '▶️ Activate'}</button>
                <button onclick="deleteDriver('${driver.id}')" style="background: linear-gradient(45deg, #ef4444, #dc2626); color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">🗑️ Remove</button>
            </div>
        </div>
    `}).join('');
}

function editDriver(driverId) {
    const driver = window.driverSystem.get(driverId);
    if (!driver) return;
    
    const editDriverId = document.getElementById('editDriverId');
    const editDriverName = document.getElementById('editDriverName');
    const editDriverEmail = document.getElementById('editDriverEmail');
    const editDriverPhone = document.getElementById('editDriverPhone');
    const editDriverPassword = document.getElementById('editDriverPassword');
    const editDriverBirth = document.getElementById('editDriverBirth');
    const editDriverGender = document.getElementById('editDriverGender');
    const editDriverStatus = document.getElementById('editDriverStatus');
    
    if (editDriverId) editDriverId.value = driverId;
    if (editDriverName) editDriverName.value = driver.name || '';
    if (editDriverEmail) editDriverEmail.value = driver.email || '';
    if (editDriverPhone) editDriverPhone.value = driver.phone || '';
    if (editDriverPassword) editDriverPassword.value = '';
    if (editDriverBirth) editDriverBirth.value = driver.dob || '';
    if (editDriverGender) editDriverGender.value = driver.gender || '';
    if (editDriverStatus) editDriverStatus.value = driver.active ? 'active' : 'inactive';
    
    const preview = document.getElementById('editDriverPicPreview');
    if (preview) {
        if (driver.profilePicture) {
            preview.innerHTML = `<img src="${driver.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            preview.innerHTML = '🚗';
        }
        preview.dataset.newPic = '';
    }
    
    openModal('editDriverModal');
}

function previewDriverPic(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('newDriverPicPreview');
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            preview.dataset.newPic = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewEditDriverPic(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('editDriverPicPreview');
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            preview.dataset.newPic = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveDriverChanges() {
    const driverId = document.getElementById('editDriverId').value;
    const driver = window.driverSystem.get(driverId);
    if (!driver) return;
    
    const name = document.getElementById('editDriverName').value.trim();
    const email = document.getElementById('editDriverEmail').value.trim();
    const phone = document.getElementById('editDriverPhone').value.trim();
    const password = document.getElementById('editDriverPassword').value;
    const dob = document.getElementById('editDriverBirth').value;
    const gender = document.getElementById('editDriverGender').value;
    const status = document.getElementById('editDriverStatus').value;
    const preview = document.getElementById('editDriverPicPreview');
    const newPic = preview.dataset.newPic;
    
    if (!name || !email || !phone) {
        alert('❌ Name, email and phone are required');
        return;
    }
    
    const updates = {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        active: status === 'active'
    };
    
    if (password) {
        updates.password = password;
    }
    
    if (newPic) {
        updates.profilePicture = newPic;
    }
    
    window.driverSystem.update(driverId, updates);
    
    closeModal('editDriverModal');
    renderDriverList();
    updateOwnerStats();
    
    alert('✅ Driver updated successfully!');
}

function toggleDriverStatus(driverId) {
    const driver = window.driverSystem.get(driverId);
    if (!driver) return;
    
    const newStatus = !driver.active;
    window.driverSystem.update(driverId, { active: newStatus, available: newStatus });
    
    renderDriverList();
    alert(`✅ Driver ${driver.name} is now ${newStatus ? 'Active' : 'Inactive'}`);
}

function addNewDriver() {
    const name = document.getElementById('newDriverName').value.trim();
    const email = document.getElementById('newDriverEmail').value.trim();
    const phone = document.getElementById('newDriverPhone').value.trim();
    const password = document.getElementById('newDriverPassword').value;
    const dob = document.getElementById('newDriverBirth').value;
    const gender = document.getElementById('newDriverGender').value;
    const preview = document.getElementById('newDriverPicPreview');
    const profilePic = preview.dataset ? preview.dataset.newPic : null;
    
    if (!name || !email || !phone || !password) {
        alert('❌ Please fill in name, email, phone and password');
        return;
    }
    
    // Check if email already exists
    if (window.driverSystem.getByEmail(email)) {
        alert('❌ A driver with this email already exists');
        return;
    }
    
    // Generate unique driver code
    const driverCount = window.driverSystem.getAll().length + 1;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const secretCode = `DRV-${String(driverCount).padStart(3, '0')}-${initials}`;
    
    const newDriver = {
        id: 'driver-' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        dob: dob || null,
        gender: gender || null,
        secretCode: secretCode,
        deliveries: 0,
        rating: 5.0,
        active: true,
        available: true,
        profilePicture: profilePic || null,
        currentLocation: null,
        createdAt: new Date().toISOString()
    };
    
    window.driverSystem.add(newDriver);
    
    // Clear form
    document.getElementById('newDriverName').value = '';
    document.getElementById('newDriverEmail').value = '';
    document.getElementById('newDriverPhone').value = '';
    document.getElementById('newDriverPassword').value = '';
    document.getElementById('newDriverBirth').value = '';
    document.getElementById('newDriverGender').value = '';
    if (preview) {
        preview.innerHTML = '🚗';
        preview.dataset.newPic = '';
    }
    
    // Update UI
    renderDriverList();
    updateOwnerStats();
    
    alert(`✅ Driver ${name} added!\n\nSecret Code: ${secretCode}\nPassword: ${password}\n\nDriver can login with either the code or email+password.`);
}

function deleteDriver(driverId) {
    if (!confirm('Are you sure you want to remove this driver?')) return;
    
    window.driverSystem.delete(driverId);
    renderDriverList();
    updateOwnerStats();
    
    alert('✅ Driver removed');
}

// ========================================
// BANK SETTINGS (OWNER ONLY)
// ========================================
function showBankSettingsModal() {
    if (!isOwnerLoggedIn) {
        alert('❌ Owner access required!');
        return;
    }
    
    // Load existing bank details
    const bankNameEl = document.getElementById('bankName');
    const accountHolderEl = document.getElementById('accountHolder');
    const accountNumberEl = document.getElementById('accountNumber');
    const sortCodeEl = document.getElementById('sortCode');
    const ibanEl = document.getElementById('iban');
    
    if (bankNameEl) bankNameEl.value = ownerBankDetails.bankName || '';
    if (accountHolderEl) accountHolderEl.value = ownerBankDetails.accountHolder || '';
    if (accountNumberEl) accountNumberEl.value = ownerBankDetails.accountNumber || '';
    if (sortCodeEl) sortCodeEl.value = ownerBankDetails.sortCode || '';
    if (ibanEl) ibanEl.value = ownerBankDetails.iban || '';
    
    openModal('bankSettingsModal');
}

function saveBankSettings(event) {
    event.preventDefault();
    
    ownerBankDetails = {
        bankName: document.getElementById('bankName').value,
        accountHolder: document.getElementById('accountHolder').value,
        accountNumber: document.getElementById('accountNumber').value,
        sortCode: document.getElementById('sortCode').value,
        iban: document.getElementById('iban').value || ''
    };
    
    // Save to localStorage
    localStorage.setItem('ownerBankDetails', JSON.stringify(ownerBankDetails));
    
    closeModal('bankSettingsModal');
    alert('✅ Bank details saved successfully!');
}

// Load bank details on init
function loadBankDetails() {
    const saved = localStorage.getItem('ownerBankDetails');
    if (saved) {
        ownerBankDetails = JSON.parse(saved);
    }
}

// ========================================
// OWNER ACCESS (FULL SYSTEM)
// ========================================
function showOwnerLogin() {
    openModal('ownerModal');
}

function handleOwnerLogin() {
    const email = document.getElementById('devEmail').value;
    const password = document.getElementById('devPassword').value;
    const pin = document.getElementById('devPin').value;
    
    if (email === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password && pin === OWNER_CREDENTIALS.pin) {
        isOwnerLoggedIn = true;
        document.getElementById('ownerModal').style.display = 'none';
        document.getElementById('ownerDashboard').style.display = 'block';
        
        // Update stats
        updateOwnerStats();
    } else {
        alert('❌ Invalid credentials!\n\nDemo: admin@antalyashawarma.com / admin2024 / 1234');
    }
}

function updateOwnerStats() {
    const totalRevenue = orderHistory.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orderHistory.length;
    const pendingCount = pendingOrders.filter(o => o.status === 'pending').length;
    const totalUsers = userDatabase.length;
    const totalDrivers = window.driverSystem.getAll().length;
    
    document.getElementById('revenueStat').textContent = formatPrice(totalRevenue);
    document.getElementById('ordersStat').textContent = totalOrders;
    document.getElementById('pendingStat').textContent = pendingCount;
    document.getElementById('usersStat').textContent = totalUsers;
    document.getElementById('driverCountStat').textContent = totalDrivers;
    document.getElementById('driversRegisteredText').textContent = `${totalDrivers} drivers registered`;
}

// ========================================
// OWNER MENU MANAGEMENT SYSTEM
// ========================================
let editingFoodId = null;
let editingCategory = null;

function openMenuManager() {
    const modal = document.getElementById('menuManagerModal');
    if (modal) {
        renderMenuManagerList();
        modal.style.display = 'flex';
    }
}

function renderMenuManagerList() {
    const container = document.getElementById('menuManagerContent');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <button onclick="openAddCategory()" style="background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; padding: 0.8rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                ➕ Add Category
            </button>
            <button onclick="openAddFood()" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; padding: 0.8rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                🍽️ Add Food Item
            </button>
        </div>
        
        ${Object.entries(categories).map(([catKey, cat]) => `
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 1rem; overflow: hidden;">
                <div style="background: rgba(139,92,246,0.2); padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        ${cat.image ? `<img src="${cat.image}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">` : `<span style="font-size: 1.5rem;">${cat.icon}</span>`}
                        <span style="font-weight: 700;">${cat.name}</span>
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">(${menuData[catKey]?.length || 0} items)</span>
                    </div>
                    <button onclick="openEditCategory('${catKey}')" style="background: rgba(255,255,255,0.1); color: white; border: none; padding: 0.5rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                        ✏️ Edit
                    </button>
                </div>
                
                <div style="padding: 0.5rem;">
                    ${(menuData[catKey] || []).map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; gap: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.8rem; flex: 1; min-width: 200px;">
                                ${item.image ? `<img src="${item.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">` : `<span style="font-size: 1.3rem;">${item.icon}</span>`}
                                <div>
                                    <div style="font-weight: 600; ${item.available === false ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.name}</div>
                                    <div style="font-size: 0.85rem; color: #10b981;">${formatPrice(item.price)}</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.3rem;">
                                <button onclick="toggleFoodAvailability('${catKey}', ${item.id})" style="background: ${item.available !== false ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${item.available !== false ? '#10b981' : '#ef4444'}; border: none; padding: 0.4rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                    ${item.available !== false ? '✅' : '❌'}
                                </button>
                                <button onclick="openEditFood('${catKey}', ${item.id})" style="background: rgba(59,130,246,0.2); color: #3b82f6; border: none; padding: 0.4rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                    ✏️
                                </button>
                                <button onclick="deleteFood('${catKey}', ${item.id})" style="background: rgba(239,68,68,0.2); color: #ef4444; border: none; padding: 0.4rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    `;
}

function toggleFoodAvailability(catKey, foodId) {
    const item = menuData[catKey]?.find(i => i.id === foodId);
    if (item) {
        item.available = item.available === false ? true : false;
        saveMenuData();
        renderMenuManagerList();
        displayMenu(currentCategory);
    }
}

function openAddFood() {
    editingFoodId = null;
    editingCategory = null;
    
    const modal = document.getElementById('foodEditorModal');
    if (modal) {
        document.getElementById('foodEditorTitle').textContent = 'Add New Food';
        document.getElementById('foodEditCategory').value = '';
        document.getElementById('foodEditName').value = '';
        document.getElementById('foodEditPrice').value = '';
        document.getElementById('foodEditIcon').value = '🍽️';
        document.getElementById('foodEditDesc').value = '';
        document.getElementById('foodEditOptions').value = '';
        document.getElementById('foodEditImage').value = '';
        document.getElementById('foodEditImagePreview').innerHTML = '';
        modal.style.display = 'flex';
    }
}

function openEditFood(catKey, foodId) {
    const item = menuData[catKey]?.find(i => i.id === foodId);
    if (!item) return;
    
    editingFoodId = foodId;
    editingCategory = catKey;
    
    const modal = document.getElementById('foodEditorModal');
    if (modal) {
        document.getElementById('foodEditorTitle').textContent = 'Edit Food Item';
        document.getElementById('foodEditCategory').value = catKey;
        document.getElementById('foodEditName').value = item.name;
        document.getElementById('foodEditPrice').value = item.price;
        document.getElementById('foodEditIcon').value = item.icon || '🍽️';
        document.getElementById('foodEditDesc').value = item.desc || '';
        document.getElementById('foodEditOptions').value = item.options ? item.options.map(o => `${o.name}:${o.price}`).join('\n') : '';
        document.getElementById('foodEditImage').value = item.image || '';
        document.getElementById('foodEditImagePreview').innerHTML = item.image ? `<img src="${item.image}" style="max-width: 100px; max-height: 100px; border-radius: 8px;">` : '';
        modal.style.display = 'flex';
    }
}

function saveFoodItem() {
    const category = document.getElementById('foodEditCategory').value;
    const name = document.getElementById('foodEditName').value.trim();
    const price = parseFloat(document.getElementById('foodEditPrice').value);
    const icon = document.getElementById('foodEditIcon').value || '🍽️';
    const desc = document.getElementById('foodEditDesc').value.trim();
    const optionsText = document.getElementById('foodEditOptions').value.trim();
    const image = document.getElementById('foodEditImage').value.trim();
    
    if (!category || !name || isNaN(price)) {
        alert('❌ Please fill category, name and price');
        return;
    }
    
    // Parse options
    const options = optionsText ? optionsText.split('\n').map(line => {
        const [optName, optPrice] = line.split(':');
        return { name: optName?.trim() || '', price: parseFloat(optPrice) || 0 };
    }).filter(o => o.name) : [];
    
    if (editingFoodId && editingCategory) {
        // Edit existing
        const item = menuData[editingCategory]?.find(i => i.id === editingFoodId);
        if (item) {
            // If category changed, move item
            if (editingCategory !== category) {
                menuData[editingCategory] = menuData[editingCategory].filter(i => i.id !== editingFoodId);
                if (!menuData[category]) menuData[category] = [];
                menuData[category].push({ ...item, name, price, icon, desc, options, image, available: item.available });
            } else {
                item.name = name;
                item.price = price;
                item.icon = icon;
                item.desc = desc;
                item.options = options;
                item.image = image;
            }
        }
    } else {
        // Add new
        if (!menuData[category]) menuData[category] = [];
        const newId = Date.now();
        menuData[category].push({
            id: newId,
            name,
            price,
            icon,
            image,
            desc,
            options,
            available: true
        });
    }
    
    saveMenuData();
    closeFoodEditor();
    renderMenuManagerList();
    renderCategories();
    displayMenu(currentCategory);
    alert('✅ Food item saved!');
}

function deleteFood(catKey, foodId) {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    
    // Remove from menu
    menuData[catKey] = menuData[catKey].filter(i => i.id !== foodId);
    
    // Clean up favorites for all users
    Object.keys(userFavorites).forEach(userEmail => {
        userFavorites[userEmail] = userFavorites[userEmail].filter(id => id !== foodId);
    });
    localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    
    // Clean up cart if item is there
    cart = cart.filter(item => item.id !== foodId);
    if (currentUser) {
        localStorage.setItem('cart_' + currentUser.email, JSON.stringify(cart));
    }
    
    saveMenuData();
    renderMenuManagerList();
    displayMenu(currentCategory);
    updateFavoritesBadge();
    updateCartBadge();
}

function closeFoodEditor() {
    const modal = document.getElementById('foodEditorModal');
    if (modal) modal.style.display = 'none';
}

function openAddCategory() {
    editingCategory = null;
    
    const modal = document.getElementById('categoryEditorModal');
    if (modal) {
        document.getElementById('categoryEditorTitle').textContent = 'Add New Category';
        document.getElementById('categoryEditKey').value = '';
        document.getElementById('categoryEditKey').disabled = false;
        document.getElementById('categoryEditName').value = '';
        document.getElementById('categoryEditIcon').value = '🍽️';
        document.getElementById('categoryEditImage').value = '';
        document.getElementById('categoryEditImagePreview').innerHTML = '';
        document.getElementById('deleteCategoryBtn').style.display = 'none';
        modal.style.display = 'flex';
    }
}

function openEditCategory(catKey) {
    const cat = categories[catKey];
    if (!cat) return;
    
    editingCategory = catKey;
    
    const modal = document.getElementById('categoryEditorModal');
    if (modal) {
        document.getElementById('categoryEditorTitle').textContent = 'Edit Category';
        document.getElementById('categoryEditKey').value = catKey;
        document.getElementById('categoryEditKey').disabled = true;
        document.getElementById('categoryEditName').value = cat.name;
        document.getElementById('categoryEditIcon').value = cat.icon || '🍽️';
        document.getElementById('categoryEditImage').value = cat.image || '';
        document.getElementById('categoryEditImagePreview').innerHTML = cat.image ? `<img src="${cat.image}" style="max-width: 100px; max-height: 100px; border-radius: 8px;">` : '';
        document.getElementById('deleteCategoryBtn').style.display = 'block';
        modal.style.display = 'flex';
    }
}

function deleteCategory() {
    if (!editingCategory) return;
    
    const itemCount = menuData[editingCategory]?.length || 0;
    if (!confirm(`Are you sure you want to delete this category?\n\nThis will also delete ${itemCount} food items in it.`)) return;
    
    // Remove all food items from favorites
    if (menuData[editingCategory]) {
        menuData[editingCategory].forEach(item => {
            Object.keys(userFavorites).forEach(userEmail => {
                userFavorites[userEmail] = userFavorites[userEmail].filter(id => id !== item.id);
            });
        });
        localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    }
    
    // Delete category and its food items
    delete menuData[editingCategory];
    delete categories[editingCategory];
    
    saveMenuData();
    closeCategoryEditor();
    renderMenuManagerList();
    renderCategories();
    
    // Switch to first available category
    const firstCat = Object.keys(categories)[0];
    if (firstCat) {
        displayMenu(firstCat);
    }
    
    updateFavoritesBadge();
    alert('✅ Category deleted');
}

// Image upload handlers
function handleFoodImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ Image must be less than 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('foodEditImage').value = e.target.result;
        previewFoodImage();
    };
    reader.readAsDataURL(file);
}

function handleCategoryImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ Image must be less than 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('categoryEditImage').value = e.target.result;
        previewCategoryImage();
    };
    reader.readAsDataURL(file);
}

function saveCategory() {
    const key = document.getElementById('categoryEditKey').value.trim().toLowerCase().replace(/\s+/g, '_');
    const name = document.getElementById('categoryEditName').value.trim();
    const icon = document.getElementById('categoryEditIcon').value || '🍽️';
    const image = document.getElementById('categoryEditImage').value.trim();
    
    if (!key || !name) {
        alert('❌ Please fill key and name');
        return;
    }
    
    if (editingCategory) {
        // Edit existing
        categories[editingCategory].name = name;
        categories[editingCategory].icon = icon;
        categories[editingCategory].image = image;
    } else {
        // Add new
        if (categories[key]) {
            alert('❌ Category key already exists');
            return;
        }
        categories[key] = { name, icon, image };
        if (!menuData[key]) menuData[key] = [];
    }
    
    saveMenuData();
    closeCategoryEditor();
    renderMenuManagerList();
    renderCategories();
    alert('✅ Category saved!');
}

function closeCategoryEditor() {
    const modal = document.getElementById('categoryEditorModal');
    if (modal) modal.style.display = 'none';
}

function previewFoodImage() {
    const url = document.getElementById('foodEditImage').value.trim();
    const preview = document.getElementById('foodEditImagePreview');
    if (url && preview) {
        preview.innerHTML = `<img src="${url}" style="max-width: 100px; max-height: 100px; border-radius: 8px;" onerror="this.parentElement.innerHTML='Invalid URL'">`;
    } else if (preview) {
        preview.innerHTML = '';
    }
}

function previewCategoryImage() {
    const url = document.getElementById('categoryEditImage').value.trim();
    const preview = document.getElementById('categoryEditImagePreview');
    if (url && preview) {
        preview.innerHTML = `<img src="${url}" style="max-width: 100px; max-height: 100px; border-radius: 8px;" onerror="this.parentElement.innerHTML='Invalid URL'">`;
    } else if (preview) {
        preview.innerHTML = '';
    }
}

// ========================================
// DRIVER FUNCTIONS
// ========================================
function showDriverLogin() {
    showDriverCodeLogin();
    openModal('driverLoginModal');
}

function showDriverCodeLogin() {
    const codeLogin = document.getElementById('driverCodeLogin');
    const emailLogin = document.getElementById('driverEmailLogin');
    if (codeLogin) codeLogin.style.display = 'block';
    if (emailLogin) emailLogin.style.display = 'none';
}

function showDriverEmailLogin() {
    const codeLogin = document.getElementById('driverCodeLogin');
    const emailLogin = document.getElementById('driverEmailLogin');
    if (codeLogin) codeLogin.style.display = 'none';
    if (emailLogin) emailLogin.style.display = 'block';
}

function handleDriverCodeLogin(event) {
    event.preventDefault();
    const code = document.getElementById('driverSecretCode').value.trim().toUpperCase();
    
    if (!code) {
        alert('❌ Please enter your secret code!');
        return;
    }
    
    const driver = window.driverSystem.getByCode(code);
    
    if (!driver) {
        alert('❌ Invalid secret code!');
        return;
    }
    
    if (!driver.active) {
        alert('❌ Your account is inactive. Please contact management.');
        return;
    }
    
    // Login successful
    loginDriver(driver);
}

function handleDriverEmailPasswordLogin(event) {
    event.preventDefault();
    const email = document.getElementById('driverLoginEmail').value.trim();
    const password = document.getElementById('driverLoginPassword').value;
    
    if (!email || !password) {
        alert('❌ Please enter email and password!');
        return;
    }
    
    const driver = window.driverSystem.getByEmail(email);
    
    if (!driver) {
        alert('❌ Driver not found with this email!');
        return;
    }
    
    if (!driver.active) {
        alert('❌ Your account is inactive. Please contact management.');
        return;
    }
    
    if (driver.password !== password) {
        alert('❌ Incorrect password!');
        return;
    }
    
    // Login successful
    loginDriver(driver);
}

function loginDriver(driver) {
    currentDriver = driver;
    sessionStorage.setItem('loggedInDriver', driver.id);
    sessionStorage.setItem('driverName', driver.name);
    
    // Clear forms
    const codeInput = document.getElementById('driverSecretCode');
    const emailInput = document.getElementById('driverLoginEmail');
    const passInput = document.getElementById('driverLoginPassword');
    if (codeInput) codeInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
    
    closeModal('driverLoginModal');
    closeModal('loginModal');
    
    updateDriverLoginUI(driver.name);
    showDriverDashboard(driver);
}

function updateDriverLoginUI(driverName) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = `🚗 ${driverName}`;
        loginBtn.onclick = function() { showDriverDashboard(); };
    }
}

function showDriverDashboard(driver = null) {
    if (!driver) {
        const driverId = sessionStorage.getItem('loggedInDriver');
        if (!driverId) {
            showLogin();
            return;
        }
        driver = window.driverSystem.get(driverId);
    }
    
    if (!driver) {
        alert('❌ Driver session expired. Please login again.');
        logoutDriver();
        return;
    }
    
    const modal = document.getElementById('driverDashboardModal');
    const content = document.getElementById('driverDashboardContent');
    if (!modal || !content) return;
    
    // Load available orders from localStorage
    const savedAvailableOrders = localStorage.getItem('availableOrdersForDrivers');
    if (savedAvailableOrders) {
        window.availableOrdersForDrivers = JSON.parse(savedAvailableOrders);
    }
    
    // Get driver's assigned orders
    const assignedOrders = pendingOrders.filter(o => o.driverId === driver.id);
    
    // Get available orders for this driver
    const availableOrders = [];
    if (window.availableOrdersForDrivers) {
        Object.keys(window.availableOrdersForDrivers).forEach(orderId => {
            const orderData = window.availableOrdersForDrivers[orderId];
            if (!orderData.claimedBy) {
                const order = pendingOrders.find(o => o.id === orderId);
                if (order && order.status === 'waiting_driver') {
                    availableOrders.push(order);
                }
            }
        });
    }
    
    const profilePic = driver.profilePicture 
        ? `<img src="${driver.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">` 
        : '🚗';
    
    content.innerHTML = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 1.5rem; border-radius: 15px; text-align: center; margin-bottom: 1.5rem; position: relative;">
            <button onclick="confirmLogoutDriver()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">✕</button>
            
            <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 0.8rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                ${profilePic}
            </div>
            <h2 style="margin: 0; color: white; font-size: 1.3rem;">${driver.name}</h2>
            <p style="margin: 0.3rem 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">${driver.secretCode}</p>
            
            <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem;">
                <div><span style="font-size: 1.3rem; font-weight: 700;">${driver.deliveries || 0}</span><br><span style="font-size: 0.8rem; opacity: 0.9;">Deliveries</span></div>
                <div><span style="font-size: 1.3rem; font-weight: 700;">⭐ ${driver.rating || 5.0}</span><br><span style="font-size: 0.8rem; opacity: 0.9;">Rating</span></div>
            </div>
            
            <div style="margin-top: 1rem;">
                <span style="background: ${driver.available ? 'rgba(255,255,255,0.3)' : 'rgba(239,68,68,0.5)'}; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                    ${driver.available ? '🟢 Online' : '🔴 Offline'}
                </span>
            </div>
        </div>
        
        <!-- Status Toggle -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.5rem;">
            <button onclick="toggleDriverAvailability()" style="background: ${driver.available ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'linear-gradient(45deg, #10b981, #059669)'}; color: white; border: none; padding: 1rem; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                ${driver.available ? '⏸️ Go Offline' : '▶️ Go Online'}
            </button>
            <button onclick="updateDriverLocation()" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 1rem; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                📍 Update Location
            </button>
        </div>
        
        <!-- Available Orders Section -->
        ${driver.available && availableOrders.length > 0 ? `
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <h3 style="color: white; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    🔔 New Orders Available (${availableOrders.length})
                </h3>
                ${availableOrders.map(order => `
                    <div style="background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 10px; margin-bottom: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                            <span style="font-weight: 700; font-size: 1.1rem; color: white;">#${order.id}</span>
                            <span style="font-weight: 700; color: white; font-size: 1.1rem;">${formatPrice(order.total)}</span>
                        </div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 0.9rem; margin-bottom: 0.8rem;">
                            <div>📍 ${order.address || 'Address pending'}</div>
                            <div>📦 ${order.items.length} item(s)</div>
                        </div>
                        <button onclick="driverAcceptOrder('${order.id}')" style="background: white; color: #d97706; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 700; width: 100%; font-size: 1rem;">
                            ✅ ACCEPT ORDER
                        </button>
                    </div>
                `).join('')}
            </div>
        ` : driver.available ? `
            <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem;">📡</div>
                <p style="color: rgba(255,255,255,0.7); margin: 0.5rem 0 0;">Waiting for new orders...</p>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0.3rem 0 0;">You'll be notified when orders are available</p>
            </div>
        ` : `
            <div style="background: rgba(239,68,68,0.1); padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 1.5rem; border: 2px solid rgba(239,68,68,0.3);">
                <div style="font-size: 3rem;">🔴</div>
                <p style="color: #ef4444; font-weight: 600; margin: 0.5rem 0 0;">You're Offline</p>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0.3rem 0 0;">Go online to receive orders</p>
            </div>
        `}
        
        <!-- My Deliveries Section -->
        <h3 style="color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            🚗 My Deliveries (${assignedOrders.length})
        </h3>
        
        ${assignedOrders.length === 0 ? `
            <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 2.5rem;">📦</div>
                <p style="color: rgba(255,255,255,0.5); margin: 0.5rem 0 0;">No active deliveries</p>
            </div>
        ` : assignedOrders.map(order => `
            <div style="background: rgba(59,130,246,0.1); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border: 2px solid rgba(59,130,246,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="font-weight: 700; font-size: 1.1rem; color: white;">#${order.id}</span>
                    <span style="background: rgba(59,130,246,0.3); color: #3b82f6; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                        ${order.status === 'out_for_delivery' ? '🚗 EN ROUTE' : order.status.toUpperCase()}
                    </span>
                </div>
                
                <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem; font-size: 1rem;">
                        👤 <strong>${order.userName}</strong>
                    </div>
                    <div style="margin-bottom: 0.5rem; color: rgba(255,255,255,0.8);">
                        📞 <a href="tel:${order.userPhone}" style="color: #3b82f6; text-decoration: none;">${order.userPhone || 'N/A'}</a>
                    </div>
                    <div style="margin-bottom: 0.5rem; color: rgba(255,255,255,0.8);">
                        📍 ${order.address || 'N/A'}
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: rgba(255,255,255,0.6);">💰 Total:</span>
                        <span style="font-weight: 700; color: #10b981; font-size: 1.1rem;">${formatPrice(order.total)}</span>
                    </div>
                    ${order.distanceMiles ? `
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                            <span style="color: rgba(255,255,255,0.6);">📏 Distance:</span>
                            <span style="color: white;">${order.distanceMiles} miles</span>
                        </div>
                    ` : ''}
                    ${order.estimatedTime ? `
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                            <span style="color: rgba(255,255,255,0.6);">⏱️ ETA:</span>
                            <span style="color: #f59e0b; font-weight: 600;">${order.estimatedTime} mins</span>
                        </div>
                    ` : ''}
                    
                    <!-- Payment Method for Driver -->
                    <div style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div style="background: ${order.paymentMethod === 'cash' ? 'rgba(245,158,11,0.3)' : 'rgba(42,157,143,0.3)'}; padding: 0.6rem; border-radius: 8px; text-align: center; font-weight: 700; color: ${order.paymentMethod === 'cash' ? '#f4a261' : '#2a9d8f'};">
                            ${order.paymentMethod === 'cash' ? '💷 CASH - Collect £' + order.total.toFixed(2) : order.paymentMethod === 'applepay' ? '🍎 Apple Pay - PAID' : '💳 Card - PAID'}
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                    <button onclick="openDirections('${encodeURIComponent(order.address)}')" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                        🗺️ Directions
                    </button>
                    <button onclick="markOrderDelivered('${order.id}')" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; padding: 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                        ✅ Delivered
                    </button>
                </div>
                
                <button onclick="callCustomer('${order.userPhone}')" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 0.8rem;">
                    📞 Call Customer
                </button>
            </div>
        `).join('')}
        
        <!-- Logout Button -->
        <button onclick="confirmLogoutDriver()" style="background: rgba(239,68,68,0.2); color: #ef4444; border: 2px solid #ef4444; padding: 1.2rem; border-radius: 12px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 1rem; font-size: 1rem;">
            🚪 Logout
        </button>
        
        <!-- Refresh Button -->
        <button onclick="showDriverDashboard()" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 0.8rem; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 0.8rem;">
            🔄 Refresh
        </button>
    `;
    
    // Show fullscreen dashboard
    modal.style.display = 'block';
}

function callCustomer(phone) {
    if (phone && phone !== 'N/A') {
        window.location.href = 'tel:' + phone;
    } else {
        alert('❌ Customer phone number not available');
    }
}

function confirmLogoutDriver() {
    if (confirm('🚪 Are you sure you want to logout?\n\nYou will stop receiving new orders.')) {
        logoutDriver();
    }
}

function toggleDriverAvailability() {
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (!driverId) return;
    
    const driver = window.driverSystem.get(driverId);
    if (!driver) return;
    
    const newStatus = !driver.available;
    window.driverSystem.update(driverId, { available: newStatus });
    
    showDriverDashboard();
    alert(`✅ You are now ${newStatus ? 'Online - Ready for deliveries!' : 'Offline'}`);
}

function updateDriverLocation() {
    if (!navigator.geolocation) {
        alert('❌ Geolocation is not supported by your browser');
        return;
    }
    
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (!driverId) {
        alert('❌ Please login first');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const locationData = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                updatedAt: new Date().toISOString()
            };
            
            // Update driver's location in system
            window.driverSystem.update(driverId, {
                currentLocation: locationData
            });
            
            // Save to localStorage for customer tracking
            const liveLocations = JSON.parse(localStorage.getItem('driverLiveLocations') || '{}');
            liveLocations[driverId] = locationData;
            localStorage.setItem('driverLiveLocations', JSON.stringify(liveLocations));
            
            alert('✅ Location updated!\n\nCustomers can now see your live location.');
            showDriverDashboard();
        },
        (error) => {
            alert('❌ Unable to get your location: ' + error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Auto-update driver location every 30 seconds when online
function startDriverLocationTracking() {
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (!driverId) return;
    
    const driver = window.driverSystem.get(driverId);
    if (!driver || !driver.available) return;
    
    // Check if there are assigned orders
    const hasOrders = pendingOrders.some(o => o.driverId === driverId);
    if (!hasOrders) return;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locationData = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    updatedAt: new Date().toISOString()
                };
                
                window.driverSystem.update(driverId, { currentLocation: locationData });
                
                const liveLocations = JSON.parse(localStorage.getItem('driverLiveLocations') || '{}');
                liveLocations[driverId] = locationData;
                localStorage.setItem('driverLiveLocations', JSON.stringify(liveLocations));
            },
            () => {}, // Silently fail
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }
}

// Start tracking when driver goes online or accepts order
setInterval(() => {
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (driverId) {
        startDriverLocationTracking();
    }
}, 30000); // Update every 30 seconds

function openDirections(address) {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
}

function markOrderDelivered(orderId) {
    if (!confirm('Mark this order as delivered?')) return;
    
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // Update order status
    order.status = 'completed';
    order.completedAt = new Date().toISOString();
    order.driverRated = false; // Flag for rating
    
    // Move to order history
    orderHistory.push(order);
    pendingOrders = pendingOrders.filter(o => o.id !== orderId);
    
    // Update driver stats
    const driverId = sessionStorage.getItem('loggedInDriver');
    if (driverId) {
        const driver = window.driverSystem.get(driverId);
        if (driver) {
            window.driverSystem.update(driverId, {
                deliveries: (driver.deliveries || 0) + 1
            });
        }
    }
    
    // Notify customer (without driver details for completed orders)
    addNotification(order.userId, {
        type: 'order_completed',
        title: '🎉 Order Delivered!',
        message: `Your order #${orderId} has been delivered. Enjoy your meal!`,
        orderId: orderId
    });
    
    saveData();
    playNotificationSound();
    showDriverDashboard();
    
    alert('✅ Order marked as delivered!');
    
    // Trigger rating popup for customer if they're logged in
    if (currentUser && currentUser.email === order.userId) {
        showDeliveryRatingPopup(orderId, order.driverId, order.driverName || 'Driver');
    }
}

function logoutDriver() {
    sessionStorage.removeItem('loggedInDriver');
    sessionStorage.removeItem('driverName');
    currentDriver = null;
    
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = showLogin;
    }
    
    // Close modal if open
    const modal = document.getElementById('driverDashboardModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// ========================================
// DRIVER LIVE TRACKING
// ========================================
let trackingMap = null;
let driverMarker = null;
let customerMarker = null;
let trackingInterval = null;
let trackingOrderId = null;

function trackDriver(orderId) {
    const order = pendingOrders.find(o => o.id === orderId) || orderHistory.find(o => o.id === orderId);
    if (!order) {
        alert('❌ Order not found');
        return;
    }
    
    if (!order.driverId) {
        alert('❌ No driver assigned to this order yet');
        return;
    }
    
    // Check if order is still out for delivery
    if (order.status === 'completed') {
        alert('✅ This order has been delivered!');
        return;
    }
    
    trackingOrderId = orderId;
    
    // Get driver info
    const driver = window.driverSystem.get(order.driverId);
    
    // Show tracking modal
    const modal = document.getElementById('driverTrackingModal');
    const orderIdDisplay = document.getElementById('trackingOrderId');
    const infoPanel = document.getElementById('driverInfoPanel');
    
    if (orderIdDisplay) {
        orderIdDisplay.textContent = `Order #${orderId}`;
    }
    
    // Get driver image
    const driverImage = driver?.profilePic || driver?.profilePicture || null;
    
    // Render driver info panel with image
    if (infoPanel) {
        infoPanel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; overflow: hidden; border: 3px solid #10b981;">
                    ${driverImage ? `<img src="${driverImage}" style="width: 100%; height: 100%; object-fit: cover;">` : '🚗'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; color: white; font-size: 1.1rem;">${order.driverName || 'Driver'}</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">📞 ${order.driverPhone || 'N/A'}</div>
                    ${driver?.rating ? `<div style="color: #f59e0b; font-size: 0.85rem;">⭐ ${driver.rating.toFixed(1)} rating</div>` : ''}
                </div>
                <div style="text-align: right;">
                    ${order.estimatedTime ? `<div style="color: #f59e0b; font-weight: 700; font-size: 1.2rem;">~${order.estimatedTime} min</div>` : ''}
                    ${order.distanceMiles ? `<div style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">${order.distanceMiles} miles</div>` : ''}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                <a href="tel:${order.driverPhone}" style="background: linear-gradient(45deg, #3b82f6, #2563eb); color: white; border: none; padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 600; text-align: center; text-decoration: none;">
                    📞 Call Driver
                </a>
                <button onclick="refreshDriverLocation()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 600;">
                    🔄 Refresh
                </button>
            </div>
        `;
    }
    
    modal.style.display = 'block';
    
    // Initialize tracking map
    setTimeout(() => {
        initTrackingMap(order, driver);
    }, 100);
    
    // Start location updates
    startLocationUpdates(order, driver);
}

function initTrackingMap(order, driver) {
    const mapContainer = document.getElementById('trackingMap');
    if (!mapContainer || !window.google) {
        mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.5);">Map requires Google Maps API</div>';
        return;
    }
    
    // Default to restaurant location if no delivery location
    const customerLat = order.deliveryLocation?.lat || UK_CONFIG.restaurant.lat + 0.01;
    const customerLng = order.deliveryLocation?.lng || UK_CONFIG.restaurant.lng + 0.01;
    
    // Driver location - check if driver has real location, otherwise simulate
    let driverLat, driverLng;
    
    // Check for real-time driver location from localStorage
    const liveDriverLocations = JSON.parse(localStorage.getItem('driverLiveLocations') || '{}');
    if (liveDriverLocations[order.driverId]) {
        driverLat = liveDriverLocations[order.driverId].lat;
        driverLng = liveDriverLocations[order.driverId].lng;
    } else if (driver?.currentLocation?.lat) {
        driverLat = driver.currentLocation.lat;
        driverLng = driver.currentLocation.lng;
    } else {
        // Simulate starting from restaurant
        driverLat = UK_CONFIG.restaurant.lat;
        driverLng = UK_CONFIG.restaurant.lng;
    }
    
    const center = {
        lat: (customerLat + driverLat) / 2,
        lng: (customerLng + driverLng) / 2
    };
    
    trackingMap = new google.maps.Map(mapContainer, {
        center: center,
        zoom: 15,
        mapTypeId: 'hybrid', // Satellite with labels
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        gestureHandling: 'greedy', // Single finger drag on mobile
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false
    });
    
    // Customer marker (destination) - House icon
    customerMarker = new google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map: trackingMap,
        title: 'Delivery Location',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        },
        label: {
            text: '🏠',
            fontSize: '16px'
        }
    });
    
    // Driver marker - Car icon
    driverMarker = new google.maps.Marker({
        position: { lat: driverLat, lng: driverLng },
        map: trackingMap,
        title: order.driverName || 'Driver',
        icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: 0
        }
    });
    
    // Draw route line
    const routePath = new google.maps.Polyline({
        path: [
            { lat: driverLat, lng: driverLng },
            { lat: customerLat, lng: customerLng }
        ],
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });
    routePath.setMap(trackingMap);
    
    // Fit bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: customerLat, lng: customerLng });
    bounds.extend({ lat: driverLat, lng: driverLng });
    trackingMap.fitBounds(bounds, 50);
}

function startLocationUpdates(order, driver) {
    // Clear any existing interval
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    
    // Simulate driver movement towards customer
    let progress = 0;
    const startLat = driver?.currentLocation?.lat || UK_CONFIG.restaurant.lat;
    const startLng = driver?.currentLocation?.lng || UK_CONFIG.restaurant.lng;
    const endLat = order.deliveryLocation?.lat || UK_CONFIG.restaurant.lat + 0.01;
    const endLng = order.deliveryLocation?.lng || UK_CONFIG.restaurant.lng + 0.01;
    
    trackingInterval = setInterval(() => {
        if (!driverMarker || !trackingMap) {
            clearInterval(trackingInterval);
            return;
        }
        
        // Move driver closer to destination (simulation)
        progress += 0.05;
        if (progress >= 1) {
            progress = 1;
            clearInterval(trackingInterval);
        }
        
        const newLat = startLat + (endLat - startLat) * progress;
        const newLng = startLng + (endLng - startLng) * progress;
        
        driverMarker.setPosition({ lat: newLat, lng: newLng });
        
        // Calculate heading for arrow rotation
        const heading = google.maps.geometry?.spherical?.computeHeading(
            new google.maps.LatLng(newLat, newLng),
            new google.maps.LatLng(endLat, endLng)
        ) || 0;
        
        const icon = driverMarker.getIcon();
        icon.rotation = heading;
        driverMarker.setIcon(icon);
        
    }, 3000); // Update every 3 seconds
}

function refreshDriverLocation() {
    if (trackingOrderId) {
        const order = pendingOrders.find(o => o.id === trackingOrderId) || orderHistory.find(o => o.id === trackingOrderId);
        if (order) {
            const driver = window.driverSystem.get(order.driverId);
            initTrackingMap(order, driver);
        }
    }
    alert('📍 Location refreshed!');
}

function closeTrackingModal() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }
    trackingOrderId = null;
    const modal = document.getElementById('driverTrackingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========================================
// DRIVER RATING SYSTEM
// ========================================
let currentRating = 0;

function openDriverRating(orderId, driverId, driverName, autoPopup = false) {
    // Check if order was already rated
    const order = orderHistory.find(o => o.id === orderId);
    if (order && order.driverRated) {
        if (!autoPopup) {
            alert(`⚠️ You have already rated this driver!\n\nRating: ${order.driverRating}/5 stars`);
        }
        return;
    }
    
    // Get driver info for image
    const driver = window.driverSystem.get(driverId);
    
    document.getElementById('ratingOrderId').value = orderId;
    document.getElementById('ratingDriverId').value = driverId;
    document.getElementById('ratingDriverName').textContent = driverName;
    
    // Show driver image if available
    const driverImageContainer = document.getElementById('ratingDriverImage');
    if (driverImageContainer) {
        if (driver && driver.profilePic) {
            driverImageContainer.innerHTML = `<img src="${driver.profilePic}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #f59e0b;">`;
        } else {
            driverImageContainer.innerHTML = `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">🚗</div>`;
        }
    }
    
    // Clear comment field
    const commentField = document.getElementById('ratingComment');
    if (commentField) commentField.value = '';
    
    currentRating = 0;
    renderStarRating();
    document.getElementById('ratingValue').textContent = '0';
    
    openModal('driverRatingModal');
}

function renderStarRating() {
    const container = document.getElementById('starRatingContainer');
    if (!container) return;
    
    // Simple 5-star rating (whole numbers only)
    container.innerHTML = `
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
            ${[1, 2, 3, 4, 5].map(i => `
                <div onclick="setRating(${i})" 
                     style="font-size: 2.8rem; cursor: pointer; opacity: ${i <= currentRating ? 1 : 0.3}; transition: all 0.2s; transform: ${i <= currentRating ? 'scale(1.1)' : 'scale(1)'};" 
                     onmouseover="previewRating(${i})" 
                     onmouseout="resetPreview()">⭐</div>
            `).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; padding: 0 0.5rem;">
            ${['Poor', 'Fair', 'Good', 'Great', 'Excellent'].map((label, i) => `
                <span style="font-size: 0.7rem; color: rgba(255,255,255,0.4); text-align: center; width: 50px;">${label}</span>
            `).join('')}
        </div>
    `;
}

function setRating(value) {
    currentRating = value;
    document.getElementById('ratingValue').textContent = value;
    renderStarRating();
}

function previewRating(value) {
    // Visual preview on hover
    const stars = document.querySelectorAll('#starRatingContainer > div > div');
    stars.forEach((star, index) => {
        star.style.opacity = index + 1 <= value ? 1 : 0.3;
        star.style.transform = index + 1 <= value ? 'scale(1.1)' : 'scale(1)';
    });
}

function resetPreview() {
    renderStarRating();
}

function submitDriverRating() {
    if (currentRating < 1) {
        alert('⚠️ Please select a rating (1-5 stars)');
        return;
    }
    
    const orderId = document.getElementById('ratingOrderId').value;
    const driverId = document.getElementById('ratingDriverId').value;
    const comment = document.getElementById('ratingComment')?.value.trim() || '';
    
    // Find order and update
    const order = orderHistory.find(o => o.id === orderId);
    if (order) {
        order.driverRated = true;
        order.driverRating = currentRating;
        order.driverRatingComment = comment;
        saveData();
    }
    
    // Also update in pendingOrders if exists there
    const pendingOrder = pendingOrders.find(o => o.id === orderId);
    if (pendingOrder) {
        pendingOrder.driverRated = true;
        pendingOrder.driverRating = currentRating;
        pendingOrder.driverRatingComment = comment;
        saveData();
    }
    
    // Update driver's average rating (keeps decimal precision internally)
    const driver = window.driverSystem.get(driverId);
    if (driver) {
        const totalRatings = (driver.totalRatings || 0) + 1;
        const ratingSum = ((driver.rating || 5) * (driver.totalRatings || 0)) + currentRating;
        const newAverage = ratingSum / totalRatings;
        
        window.driverSystem.update(driverId, {
            rating: Math.round(newAverage * 100) / 100, // Keep 2 decimal places internally
            totalRatings: totalRatings
        });
    }
    
    closeModal('driverRatingModal');
    
    alert(`⭐ Thank you for your ${currentRating}-star rating!${comment ? '\n\nYour feedback has been saved.' : ''}`);
    
    // Refresh account page if open
    if (document.getElementById('accountModal')?.style.display === 'flex') {
        showAccount();
    }
}

// Auto-popup rating after delivery
function showDeliveryRatingPopup(orderId, driverId, driverName) {
    setTimeout(() => {
        openDriverRating(orderId, driverId, driverName, true);
    }, 1500);
}

function generateDriverSecretCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DRV-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ========================================
// LOCATION FUNCTIONS
// ========================================
function pickLocation() {
    const modal = document.getElementById('mapModal');
    if (modal) {
        modal.style.display = 'block';
    }
    setTimeout(() => initMap(), 100);
}

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !window.google) return;
    
    const center = { lat: UK_CONFIG.restaurant.lat, lng: UK_CONFIG.restaurant.lng };
    
    googleMap = new google.maps.Map(mapContainer, {
        center: center,
        zoom: 14,
        mapTypeId: 'hybrid', // Satellite with labels
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        gestureHandling: 'greedy', // Single finger drag on mobile
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false
    });
    
    // Restaurant marker
    new google.maps.Marker({
        position: center,
        map: googleMap,
        title: 'Antalya Shawarma',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#e63946" stroke="#fff" stroke-width="3"/>
                    <text x="20" y="26" font-size="18" text-anchor="middle" fill="#fff">🌯</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Click to select location
    googleMap.addListener('click', (e) => {
        addMarker(e.latLng);
    });
}

// Variable to track if picking for profile
let pickingForProfile = false;

function pickLocationForProfile() {
    pickingForProfile = true;
    closeModal('editProfileModal');
    
    const modal = document.getElementById('mapModal');
    if (modal) {
        modal.style.display = 'block';
    }
    setTimeout(() => initMap(), 100);
}

function addMarker(location) {
    if (mapMarker) mapMarker.setMap(null);
    
    mapMarker = new google.maps.Marker({
        position: location,
        map: googleMap,
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#2a9d8f" stroke="#fff" stroke-width="3"/>
                    <text x="20" y="26" font-size="18" text-anchor="middle" fill="#fff">📍</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    selectedLocation = {
        lat: location.lat(),
        lng: location.lng()
    };
    
    // Calculate delivery info
    const distance = calculateDistance(
        UK_CONFIG.restaurant.lat,
        UK_CONFIG.restaurant.lng,
        selectedLocation.lat,
        selectedLocation.lng
    );
    
    const deliveryInfo = getDeliveryCost(distance);
    document.getElementById('selectedLocationText').innerHTML = `
        📍 ${distance.toFixed(1)} miles from restaurant<br>
        <span style="color: ${deliveryInfo.available ? '#2a9d8f' : '#ef4444'};">${deliveryInfo.message}</span>
    `;
    
    // Try to get address via geocoding
    if (window.google && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                selectedLocation.address = results[0].formatted_address;
                
                // Update location display
                document.getElementById('selectedLocationText').innerHTML = `
                    📍 ${selectedLocation.address}<br>
                    <span style="color: ${deliveryInfo.available ? '#2a9d8f' : '#ef4444'};">${deliveryInfo.message}</span>
                `;
                
                // Also update edit profile address field if it exists
                const editAddressField = document.getElementById('editAddress');
                if (editAddressField) {
                    editAddressField.value = selectedLocation.address;
                }
                
                // Update auth address field if it exists
                const authAddressField = document.getElementById('authAddress');
                if (authAddressField) {
                    authAddressField.value = selectedLocation.address;
                }
            }
        });
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('❌ Geolocation not supported');
        return;
    }
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Finding...';
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            if (googleMap) {
                googleMap.setCenter(location);
                googleMap.setZoom(16);
                addMarker(new google.maps.LatLng(location.lat, location.lng));
            }
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('✅ Location found!');
        },
        (error) => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('❌ Could not get location');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function confirmLocation() {
    if (!selectedLocation) {
        alert('❌ Please select a location on the map');
        return;
    }
    
    const distance = calculateDistance(
        UK_CONFIG.restaurant.lat,
        UK_CONFIG.restaurant.lng,
        selectedLocation.lat,
        selectedLocation.lng
    );
    
    const deliveryInfo = getDeliveryCost(distance);
    
    if (!deliveryInfo.available) {
        alert(deliveryInfo.message);
        return;
    }
    
    if (currentUser) {
        currentUser.location = selectedLocation;
        currentUser.address = selectedLocation.address;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Close map modal
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.style.display = 'none';
    }
    
    // If we were picking for profile, reopen edit profile modal
    if (pickingForProfile) {
        pickingForProfile = false;
        
        // Update the edit address field
        const editAddressField = document.getElementById('editAddress');
        if (editAddressField && selectedLocation.address) {
            editAddressField.value = selectedLocation.address;
        }
        
        openEditProfile();
        alert(`✅ Location set!\n\n${selectedLocation.address || 'Location confirmed'}`);
    } else {
        alert(`✅ Location confirmed!\n\n${selectedLocation.address || 'Location set'}\n${deliveryInfo.message}`);
    }
}

// ========================================
// MODAL & UTILITY FUNCTIONS
// ========================================

function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Hide modal - both class and inline style for consistency
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Reset specific modal states
        if (modalId === 'loginModal') {
            const authForm = document.getElementById('authFormSection');
            const verifySection = document.getElementById('emailVerificationSection');
            if (authForm) authForm.style.display = 'block';
            if (verifySection) verifySection.style.display = 'none';
        }
        
        if (modalId === 'driverLoginModal') {
            const codeLogin = document.getElementById('driverCodeLogin');
            const emailLogin = document.getElementById('driverEmailLogin');
            if (codeLogin) codeLogin.style.display = 'block';
            if (emailLogin) emailLogin.style.display = 'none';
        }
        
        // Stop tracking updates when closing tracking modal
        if (modalId === 'driverTrackingModal') {
            if (trackingInterval) {
                clearInterval(trackingInterval);
                trackingInterval = null;
            }
            trackingOrderId = null;
        }
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    } catch (e) {
        console.error('Error closing modal:', e);
    }
}

function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Show modal - both class and inline style for consistency  
        modal.style.display = 'flex';
        modal.classList.add('active');
    } catch (e) {
        console.error('Error opening modal:', e);
    }
}

function scrollToMenu() {
    document.querySelector('.main-content')?.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    const nav = document.getElementById('navButtons');
    const btn = document.getElementById('mobileMenuBtn');
    if (!nav || !btn) return;
    nav.classList.toggle('active');
    btn.classList.toggle('active');
    btn.textContent = nav.classList.contains('active') ? '✕' : '☰';
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌯 Antalya Shawarma v3.0.0 Loading...');
    
    // Load data
    loadData();
    loadBankDetails();
    loadMenuData(); // Load custom menu data from owner
    
    // Render categories
    renderCategories();
    
    // Display initial menu
    displayMenu('shawarma');
    
    // Update badges
    updateCartBadge();
    updateFavoritesBadge();
    updateNotificationBadge();
    
    // Restore driver session
    const driverId = sessionStorage.getItem('loggedInDriver');
    const driverName = sessionStorage.getItem('driverName');
    if (driverId && driverName) {
        updateDriverLoginUI(driverName);
    }
    
    // Auto-format card inputs
    const cardInput = document.getElementById('paymentCardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.getElementById('paymentExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    console.log('✅ Antalya Shawarma Ready!');
    console.log(`📦 ${Object.keys(menuData).length} categories loaded`);
    console.log(`🍽️ ${Object.values(menuData).flat().length} menu items available`);
});

// Make functions globally available
window.showLogin = showLogin;
window.showAccount = showAccount;
window.showCart = showCart;
window.showFavorites = showFavorites;
window.showNotifications = showNotifications;
window.showRestaurantLogin = showRestaurantLogin;
window.showOwnerLogin = showOwnerLogin;
window.showDriverLogin = showDriverLogin;
window.closeModal = closeModal;
window.filterCategory = filterCategory;
window.openFoodModal = openFoodModal;
window.toggleFavorite = toggleFavorite;
window.toggleCustomization = toggleCustomization;
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.proceedToCheckout = proceedToCheckout;
window.handlePayment = handlePayment;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem;
window.scrollToMenu = scrollToMenu;
window.toggleMobileMenu = toggleMobileMenu;
window.handleEmailAuth = handleEmailAuth;
window.verifyCode = verifyCode;
window.resendCode = resendCode;
window.toggleAuthMode = toggleAuthMode;
window.loginWithGoogle = loginWithGoogle;
window.loginWithApple = loginWithApple;
window.handleRestaurantLogin = handleRestaurantLogin;
window.handleOwnerLogin = handleOwnerLogin;
window.pickLocation = pickLocation;
window.getCurrentLocation = getCurrentLocation;
window.confirmLocation = confirmLocation;
window.acceptOrder = acceptOrder;
window.rejectOrder = rejectOrder;
window.assignDriver = assignDriver;
window.completeOrder = completeOrder;
window.closeRestaurantDashboard = closeRestaurantDashboard;
window.showDriverManagementModal = showDriverManagementModal;
window.addNewDriver = addNewDriver;
window.deleteDriver = deleteDriver;
window.showBankSettingsModal = showBankSettingsModal;
window.saveBankSettings = saveBankSettings;
window.logout = logout;
window.logoutDriver = logoutDriver;
window.openEditProfile = openEditProfile;
window.previewProfilePic = previewProfilePic;
window.saveProfileChanges = saveProfileChanges;
window.openChangeEmail = openChangeEmail;
window.verifyAndChangeEmail = verifyAndChangeEmail;
window.openChangePassword = openChangePassword;
window.verifyAndChangePassword = verifyAndChangePassword;

// New driver functions
window.showDriverCodeLogin = showDriverCodeLogin;
window.showDriverEmailLogin = showDriverEmailLogin;
window.handleDriverCodeLogin = handleDriverCodeLogin;
window.handleDriverEmailPasswordLogin = handleDriverEmailPasswordLogin;
window.showDriverDashboard = showDriverDashboard;
window.toggleDriverAvailability = toggleDriverAvailability;
window.updateDriverLocation = updateDriverLocation;
window.openDirections = openDirections;
window.markOrderDelivered = markOrderDelivered;

// Driver management functions
window.editDriver = editDriver;
window.previewDriverPic = previewDriverPic;
window.previewEditDriverPic = previewEditDriverPic;
window.saveDriverChanges = saveDriverChanges;
window.toggleDriverStatus = toggleDriverStatus;
window.notifyAllAvailableDrivers = notifyAllAvailableDrivers;

// Driver order functions
window.driverAcceptOrder = driverAcceptOrder;
window.callCustomer = callCustomer;
window.confirmLogoutDriver = confirmLogoutDriver;
window.calculateDeliveryTime = calculateDeliveryTime;
window.getDistanceFromLatLng = getDistanceFromLatLng;

// Driver tracking functions
window.trackDriver = trackDriver;
window.refreshDriverLocation = refreshDriverLocation;
window.closeTrackingModal = closeTrackingModal;
window.startDriverLocationTracking = startDriverLocationTracking;

// Driver rating functions
window.openDriverRating = openDriverRating;
window.setRating = setRating;
window.previewRating = previewRating;
window.resetPreview = resetPreview;
window.submitDriverRating = submitDriverRating;
window.showDeliveryRatingPopup = showDeliveryRatingPopup;

// Order functions
window.userCanOrder = userCanOrder;
window.showOrderHistory = showOrderHistory;
window.updateOrdersBadge = updateOrdersBadge;

// Restaurant status functions
window.isRestaurantOpen = isRestaurantOpen;
window.getRestaurantStatus = getRestaurantStatus;
window.getUKTime = getUKTime;
window.getUKHour = getUKHour;
window.resetAllData = resetAllData;

// Location functions
window.pickLocationForProfile = pickLocationForProfile;

// Reorder functions
window.reorderFromHistory = reorderFromHistory;
window.confirmReorder = confirmReorder;

// Location confirmation functions
window.showLocationConfirmation = showLocationConfirmation;
window.confirmCurrentLocation = confirmCurrentLocation;
window.changeDeliveryLocation = changeDeliveryLocation;
window.openCheckoutModal = openCheckoutModal;

// Menu management functions (Owner)
window.openMenuManager = openMenuManager;
window.renderMenuManagerList = renderMenuManagerList;
window.toggleFoodAvailability = toggleFoodAvailability;
window.openAddFood = openAddFood;
window.openEditFood = openEditFood;
window.saveFoodItem = saveFoodItem;
window.deleteFood = deleteFood;
window.closeFoodEditor = closeFoodEditor;
window.openAddCategory = openAddCategory;
window.openEditCategory = openEditCategory;
window.saveCategory = saveCategory;
window.closeCategoryEditor = closeCategoryEditor;
window.deleteCategory = deleteCategory;
window.previewFoodImage = previewFoodImage;
window.previewCategoryImage = previewCategoryImage;
window.handleFoodImageUpload = handleFoodImageUpload;
window.handleCategoryImageUpload = handleCategoryImageUpload;
window.saveMenuData = saveMenuData;
window.loadMenuData = loadMenuData;

// Modal functions
window.openModal = openModal;
window.closeModal = closeModal;
