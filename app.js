const menuItems = [
    {
        name: 'Капучино',
        price: 250,
        image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'coffee'
    },
    {
        name: 'Латте',
        price: 280,
        image: 'https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'coffee'
    },
    {
        name: 'Мокачино',
        price: 300,
        image: 'https://images.unsplash.com/photo-1593443320730-2d1d2c4f1c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'chocolate'
    }
];

let cart = JSON.parse(localStorage.getItem('sb-cart')) || [];
let total = 0;

// Инициализация приложения
function initApp() {
    renderMenu();
    updateCart();
    setupEventListeners();
    
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.MainButton
            .setText(`Заказ (${cart.length})`)
            .onClick(toggleCart)
            .show();
    }
}

function renderMenu() {
    const menuGrid = document.getElementById('menu');
    menuGrid.innerHTML = menuItems.map(item => `
        <article class="menu-card" data-category="${item.category}">
            <div class="card-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <div class="card-footer">
                    <span>${item.price} ₽</span>
                    <button class="add-btn" data-item='${JSON.stringify(item)}'>
                        Добавить
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function setupEventListeners() {
    // Добавление в корзину
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = JSON.parse(e.target.dataset.item);
            addToCart(item);
        });
    });

    // Управление корзиной
    document.getElementById('cartButton').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.querySelector('.order-btn').addEventListener('click', placeOrder);
}

function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    updateCart();
    showNotification(`+1 ${item.name}`);
    saveCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalElement = document.getElementById('totalAmount');
    const counter = document.querySelector('.cart-counter');

    // Обновление списка
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="item-controls">
                    <button class="quantity-btn" data-name="${item.name}" data-action="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-name="${item.name}" data-action="increase">+</button>
                </div>
            </div>
            <span class="item-price">${item.quantity * item.price} ₽</span>
        </div>
    `).join('');

    // Обновление суммы
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `${total} ₽`;
    
    // Обновление счетчика
    counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Добавляем обработчики для кнопок количества
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
}

function handleQuantityChange(e) {
    const action = e.target.dataset.action;
    const name = e.target.dataset.name;
    const item = cart.find(i => i.name === name);

    if (action === 'increase') {
        item.quantity++;
        total += item.price;
    } else {
        item.quantity--;
        total -= item.price;
        if (item.quantity < 1) {
            cart = cart.filter(i => i !== item);
        }
    }

    updateCart();
    saveCart();
}

function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
}

function placeOrder() {
    if (cart.length === 0) return;
    
    showNotification('✅ Заказ оформлен!');
    localStorage.setItem('sb-order-history', JSON.stringify(cart));
    cart = [];
    updateCart();
    toggleCart();
    saveCart();
}

function showNotification(text) {
    const notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function saveCart() {
    localStorage.setItem('sb-cart', JSON.stringify(cart));
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);