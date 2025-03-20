// app.js
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    let cart = [];
    
    // Инициализация
    function init() {
        tg.expand();
        loadMenu();
        setupCart();
        hideLoader();
    }

    function hideLoader() {
        setTimeout(() => {
            document.querySelector('.loader').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.loader').remove();
            }, 300);
        }, 500);
    }

    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.body.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 3000);
    }

    // Меню
    const menuData = [/* Ваше меню из предыдущего ответа */];

    function loadMenu() {
        try {
            renderMenu();
            setupEventListeners();
        } catch (error) {
            showError('Ошибка загрузки меню');
            console.error(error);
        }
    }

    function renderMenu() {
        const container = document.getElementById('menuContainer');
        container.innerHTML = menuData.map(category => `
            <div class="category-card">
                <h2>${category.category}</h2>
                ${category.items.map(item => `
                    <div class="menu-item">
                        <div class="item-header">
                            <div>${item.name}</div>
                            <div class="item-price">${item.prices.join(' / ')}</div>
                        </div>
                        <p>${item.desc}</p>
                        <button class="add-btn">Добавить</button>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // Корзина
    function setupCart() {
        document.getElementById('cartButton').addEventListener('click', () => {
            tg.showAlert(`В корзине: ${cart.length} товаров`);
        });
    }

    function setupEventListeners() {
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.push(1);
                updateCartCounter();
                animateAddButton(btn);
            });
        });
    }

    function updateCartCounter() {
        document.querySelector('.cart-counter').textContent = cart.length;
    }

    function animateAddButton(btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }

    // Запуск
    init();
});