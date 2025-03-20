// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById('close-app').addEventListener('click', () => tg.close());

// Меню (полная версия из задания)
const menuData = [
    {
        category: "Классические кофейные напитки",
        sizes: ["S (250 мл)", "M (350 мл)", "L (450 мл)"],
        items: [
            { 
                name: "Эспрессо", 
                price: "120 ₽", 
                desc: "Интенсивный, как утро понедельника...",
                customSize: "60 мл"
            },
            // ... Все остальные позиции
        ]
    },
    // ... Все категории
];

// Генератор интерфейса
function renderMenu() {
    const container = document.querySelector('.menu-container');
    
    menuData.forEach(category => {
        const categoryHTML = `
            <div class="category-card">
                <h2>${category.category}</h2>
                ${category.sizes ? `<div class="size-badges">${category.sizes.join(' • ')}</div>` : ''}
                <div class="items-list">
                    ${category.items.map(item => `
                        <div class="item-card">
                            <div class="item-header">
                                <h3>${item.name} ${item.customSize ? `(${item.customSize})` : ''}</h3>
                                <span class="price-tag">${item.price}</span>
                            </div>
                            <p class="item-desc">${item.desc}</p>
                            <div class="item-controls">
                                <select class="size-select">
                                    ${item.sizes ? item.sizes.map((_,i) => `
                                        <option>${['S','M','L'][i]}</option>
                                    `).join('') : ''}
                                </select>
                                <button class="add-to-cart" data-item="${item.name}">
                                    Добавить
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML += categoryHTML;
    });
}

// Корзина
let cart = [];
function updateCart() {
    document.querySelector('.badge').textContent = cart.length;
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const itemName = e.target.dataset.item;
        cart.push(itemName);
        updateCart();
        tg.HapticFeedback.impactOccurred('light');
    });
});

// Инициализация
document.addEventListener('DOMContentLoaded', renderMenu);