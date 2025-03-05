// Инициализация приложения
const menuItems = [
    { icon: '☕', name: 'Эспрессо', price: 150 },
    { icon: '🥛', name: 'Капучино', price: 200 },
    { icon: '🍵', name: 'Латте', price: 220 },
    { icon: '☕', name: 'Американо', price: 180 },
    { icon: '🍫', name: 'Мокачино', price: 250 }
];

let cart = [];
let total = 0;

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.MainButton.setText(`Оформить заказ (0 ₽)`).show();
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
}

// Генерация меню
function initMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item" onclick="addToCart('${item.name}', ${item.price})">
            <div class="item-content">
                <div class="item-icon">${item.icon}</div>
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">${item.price} ₽</p>
            </div>
        </div>
    `).join('');
}

// Работа с корзиной
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    total += price;
    updateCart();
    showNotification(`Добавлено: ${name}`);
}

function updateCart() {
    const cartContainer = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="adjustQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="adjustQuantity('${item.name}', 1)">+</button>
            </div>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `).join('');

    totalElement.textContent = `${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ₽`;
    
    if (tg) {
        tg.MainButton.setText(`Оформить заказ (${total} ₽)`);
    }
}

function adjustQuantity(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.quantity += delta;
    total += delta * item.price;
    
    if (item.quantity < 1) {
        cart = cart.filter(i => i !== item);
    }
    
    updateCart();
    showNotification(`Количество изменено: ${name}`);
}

function clearCart() {
    cart = [];
    total = 0;
    updateCart();
    showNotification('Корзина очищена');
}

// Оформление заказа
async function placeOrder() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }

    const loader = document.querySelector('.loader');
    const orderBtn = document.querySelector('.order-btn');
    
    orderBtn.disabled = true;
    loader.style.display = 'block';

    try {
        // Имитация отправки данных
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (tg) {
            tg.sendData(JSON.stringify({
                order: cart,
                total: total
            }));
            tg.close();
        } else {
            alert('Заказ успешно оформлен!');
            clearCart();
        }
    } finally {
        orderBtn.disabled = false;
        loader.style.display = 'none';
    }
}

// Вспомогательные функции
function showNotification(text) {
    const notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Инициализация
initMenu();
updateCart();
// Пример системы лояльности (добавьте в app.js)
class LoyaltyProgram {
  constructor() {
    this.points = localStorage.getItem('loyaltyPoints') || 0;
  }

  addPoints(amount) {
    this.points += Math.floor(amount / 10);
    localStorage.setItem('loyaltyPoints', this.points);
  }

  getBadge() {
    return `🎖️ ${this.points} баллов`;
  }
}

// Инициализация
const loyalty = new LoyaltyProgram();
// Добавьте в функцию добавления в корзину
function animateAddToCart(itemElement) {
  const clone = itemElement.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  document.body.appendChild(clone);

  const cartPosition = document.getElementById('cartButton').getBoundingClientRect();
  
  Object.assign(clone.style, {
    left: `${itemElement.offsetLeft}px`,
    top: `${itemElement.offsetTop}px`,
    width: `${itemElement.offsetWidth}px`,
    height: `${itemElement.offsetHeight}px`
  });

  requestAnimationFrame(() => {
    Object.assign(clone.style, {
      left: `${cartPosition.left}px`,
      top: `${cartPosition.top}px`,
      width: '20px',
      height: '20px',
      opacity: '0'
    });
  });

  setTimeout(() => clone.remove(), 500);
}