const menuItems = [
    {
        id: 1,
        name: 'Классический капучино',
        price: 280,
        category: 'classic',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
        customizations: {
            milk: [
                { name: 'Коровье', price: 0 },
                { name: 'Овсяное', price: 50 },
                { name: 'Миндальное', price: 50 }
            ],
            syrups: [
                { name: 'Ванильный', price: 30 },
                { name: 'Карамельный', price: 30 },
                { name: 'Кокосовый', price: 40 }
            ],
            extras: [
                { name: 'Двойная порция', price: 80 },
                { name: 'Веганские сливки', price: 50 }
            ]
        }
    },
    // Добавьте остальные товары по аналогии
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentItem = null;

// Инициализация приложения
function init() {
    renderMenu();
    setupEventListeners();
    updateCartCounter();
}

// Рендер меню
function renderMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" class="item-image" alt="${item.name}">
            <div class="item-content">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">${item.price} ₽</p>
                <button class="customize-btn">Настроить</button>
            </div>
        </div>
    `).join('');
}

// Обработчики событий
function setupEventListeners() {
    // Фильтрация по категориям
    document.querySelectorAll('.category').forEach(btn => {
        btn.addEventListener('click', () => handleCategoryClick(btn));
    });

    // Открытие модалки кастомизации
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if(e.target.classList.contains('customize-btn')) {
                const itemId = e.currentTarget.dataset.id;
                currentItem = menuItems.find(i => i.id == itemId);
                openCustomizationModal(currentItem);
            }
        });
    });

    // Закрытие модалок
    document.querySelectorAll('.close-modal, .close-cart').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Открытие корзины
    document.getElementById('cartIcon').addEventListener('click', openCart);
}

// Логика фильтрации
function handleCategoryClick(btn) {
    document.querySelector('.category.active').classList.remove('active');
    btn.classList.add('active');
    const category = btn.dataset.category;
    filterMenu(category);
}

function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemCategory = menuItems.find(i => i.id == item.dataset.id).category;
        if(category === 'all' || category === itemCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Модальное окно кастомизации
function openCustomizationModal(item) {
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalTotal').textContent = item.price;
    
    fillOptions('milkOptions', item.customizations.milk);
    fillOptions('syrupOptions', item.customizations.syrups);
    fillOptions('extraOptions', item.customizations.extras);

    document.getElementById('customModal').style.display = 'flex';
}

function fillOptions(containerId, options) {
    const container = document.getElementById(containerId);
    container.innerHTML = options.map(opt => `
        <div class="option" data-price="${opt.price}">
            ${opt.name}${opt.price > 0 ? ` (+${opt.price}₽)` : ''}
        </div>
    `).join('');

    container.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', handleOptionSelect);
    });
}

function handleOptionSelect(e) {
    e.target.classList.toggle('selected');
    updateModalTotal();
}

function updateModalTotal() {
    let total = currentItem.price;
    document.querySelectorAll('.option.selected').forEach(opt => {
        total += parseInt(opt.dataset.price);
    });
    document.getElementById('modalTotal').textContent = total;
}

// Корзина
function addToCart() {
    const selectedOptions = {
        milk: getSelectedOptions('milkOptions'),
        syrups: getSelectedOptions('syrupOptions'),
        extras: getSelectedOptions('extraOptions')
    };

    const cartItem = {
        ...currentItem,
        options: selectedOptions,
        total: parseInt(document.getElementById('modalTotal').textContent)
    };

    cart.push(cartItem);
    saveCart();
    updateCartDisplay();
    closeModals();
}

function getSelectedOptions(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .option.selected`))
        .map(opt => ({
            name: opt.textContent.split('+')[0].trim(),
            price: parseInt(opt.dataset.price)
        }));
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <div class="item-options">
                    ${renderOptions(item.options)}
                </div>
            </div>
            <span>${item.total} ₽</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('cartTotal').textContent = total;
    updateCartCounter();
}

function renderOptions(options) {
    return Object.entries(options)
        .filter(([_, value]) => value.length > 0)
        .map(([key, values]) => `
            <div class="option-group">
                <span class="option-label">${key}:</span>
                ${values.map(v => `<span class="option-value">${v.name}</span>`).join(', ')}
            </div>
        `).join('');
}

// Вспомогательные функции
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCounter() {
    document.querySelector('.cart-count').textContent = cart.length;
}

function openCart() {
    document.getElementById('cartSidebar').style.right = '0';
    updateCartDisplay();
}

function closeModals() {
    document.getElementById('customModal').style.display = 'none';
    document.getElementById('cartSidebar').style.right = '-400px';
}

// Инициализация
document.addEventListener('DOMContentLoaded', init);