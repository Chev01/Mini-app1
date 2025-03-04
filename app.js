// Меню кофейны
const menu = [
    { name: "Эспрессо", price: 150 },
    { name: "Капучино", price: 200 },
    { name: "Латте", price: 220 },
    { name: "Американо", price: 180 },
    { name: "Мокачино", price: 250 },
];

// Корзина
let cart = [];
let total = 0;

// Инициализация меню
document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu');
    menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <span>${item.name} - ${item.price} руб.</span>
            <button onclick="addToCart('${item.name}', ${item.price})">Добавить</button>
        `;
        menuContainer.appendChild(div);
    });
});

// Функции для работы с корзиной
window.addToCart = (name, price) => {
    cart.push({ name, price });
    total += price;
    updateCart();
};

window.clearCart = () => {
    cart = [];
    total = 0;
    updateCart();
};

const updateCart = () => {
    const cartList = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} руб.`;
        cartList.appendChild(li);
    });
    totalElement.textContent = total;
};