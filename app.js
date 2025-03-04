let cart = [];
let total = 0;

// Инициализация Telegram Web App
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Применение темы Telegram
    const applyTheme = () => {
        const theme = tg.themeParams;
        document.body.style.backgroundColor = theme.bg_color || '#ffffff';
        document.body.style.color = theme.text_color || '#000000';
        document.querySelector('.container').style.backgroundColor = theme.secondary_bg_color || '#f0f0f0';
    };

    // Обработчик изменения темы
    tg.onEvent('themeChanged', applyTheme);
    applyTheme();

    // Показываем основную кнопку
    tg.MainButton.setText('Оформить заказ').show();
    tg.MainButton.onClick(() => placeOrder());
}

// Добавление в корзину
window.addToCart = (name, price) => {
    cart.push({ name, price });
    total += price;
    updateCart();
    showNotification(`✅ ${name} добавлен в корзину!`);
};

// Удаление из корзины
window.removeFromCart = (index) => {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
    showNotification(`❌ Товар удалён из корзины`);
};

// Обновление корзины
const updateCart = () => {
    const cartList = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} - ${item.price} руб.</span>
            <button onclick="removeFromCart(${index})" class="danger">Удалить</button>
        `;
        cartList.appendChild(li);
    });
    
    totalElement.textContent = total;
    
    if (window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.MainButton.setText(`Оформить заказ (${total} руб.)`);
    }
};

// Очистка корзины
window.clearCart = () => {
    if (cart.length === 0) return;
    cart = [];
    total = 0;
    updateCart();
    showNotification('🧹 Корзина очищена');
};

// Оформление заказа
window.placeOrder = () => {
    if (cart.length === 0) {
        showNotification('⚠️ Корзина пуста!');
        return;
    }

    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    setTimeout(() => {
        const order = cart.map(item => 
            `${item.name} - ${item.price} руб.`
        ).join('\n');

        const orderData = {
            order: order,
            total: total,
            user: window.Telegram.WebApp.initDataUnsafe.user
        };

        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify(orderData));
            window.Telegram.WebApp.close();
        } else {
            alert(`Ваш заказ:\n${order}\n\nИтого: ${total} руб.`);
        }

        loader.style.display = 'none';
        clearCart();
    }, 2000);
};

// Показать уведомление
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
};