let cart = [];
let total = 0;

// Инициализация Telegram WebApp
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.setText(`Оформить заказ (0 ₽)`).show();
    
    // Динамическое обновление кнопки
    const updateMainButton = () => {
        tg.MainButton.setText(`Оформить заказ (${total} ₽)`);
    };
    
    // Обработчик темы
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
}

// Добавление в корзину (исправлено)
window.addToCart = (name, price) => {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    total += price;
    updateCart();
    showTempAlert(`✅ ${name} добавлен`);
};

// Обновление корзины (исправлено)
const updateCart = () => {
    const cartElement = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    
    cartElement.innerHTML = cart.map(item => `
        <li class="cart-item">
            ${item.name} 
            <span class="quantity-controller">
                <button onclick="changeQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name}', 1)">+</button>
            </span>
            <span>${item.price * item.quantity} ₽</span>
        </li>
    `).join('');

    totalElement.textContent = total;
    
    if (window.Telegram.WebApp) {
        window.Telegram.WebApp.MainButton.setText(`Оформить заказ (${total} ₽)`);
    }
};

// Изменение количества
window.changeQuantity = (name, delta) => {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.quantity += delta;
    total += delta * item.price;
    
    if (item.quantity < 1) {
        cart = cart.filter(i => i !== item);
    }
    
    updateCart();
    showTempAlert(`✏️ Количество изменено`);
};

// Очистка корзины
window.clearCart = () => {
    cart = [];
    total = 0;
    updateCart();
    showTempAlert('🧹 Корзина очищена');
};

// Уведомления
const showTempAlert = (msg) => {
    const alert = document.createElement('div');
    alert.className = 'temp-alert';
    alert.textContent = msg;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 2000);
};