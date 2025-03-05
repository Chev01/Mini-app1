const menuItems = [
    {
        name: 'Капучино',
        price: 250,
        image: 'https://source.unsplash.com/random/800x600/?cappuccino'
    },
    {
        name: 'Латте',
        price: 280,
        image: 'https://source.unsplash.com/random/800x600/?latte'
    },
    {
        name: 'Эспрессо',
        price: 200,
        image: 'https://source.unsplash.com/random/800x600/?espresso'
    },
    {
        name: 'Мокачино',
        price: 300,
        image: 'https://source.unsplash.com/random/800x600/?mocha'
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;

// Инициализация
function init() {
    renderMenu();
    updateCartCounter();
    setupEventListeners();
}

function renderMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item" data-item='${JSON.stringify(item)}'>
            <div class="item-content">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">${item.price} ₽</p>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const product = JSON.parse(e.currentTarget.dataset.item);
            addToCart(product);
        });
    });

    document.getElementById('cartButton').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
}

function addToCart(item) {
    const existing = cart.find(cartItem => cartItem.name === item.name);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    total += item.price;
    updateCart();
    showNotification(`${item.name} добавлен в корзину`);
    saveToLocalStorage();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalElement = document.getElementById('totalAmount');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>${item.quantity} × ${item.price} ₽</p>
            </div>
            <span>${item.quantity * item.price} ₽</span>
        </div>
    `).join('');
    
    totalElement.textContent = `${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ₽`;
    updateCartCounter();
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
}

function showNotification(text) {
    const notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);