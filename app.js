const menuItems = [
    {
        name: 'Капучино Классический',
        price: 250,
        category: 'classic',
        image: 'https://images.unsplash.com/...',
        customizations: {
            milk: [
                { name: 'Коровье', price: 0 },
                { name: 'Миндальное', price: 50 },
                { name: 'Овсяное', price: 50 },
            ],
            syrups: [
                { name: 'Ванильный', price: 30 },
                { name: 'Карамельный', price: 30 },
                { name: 'Шоколадный', price: 40 },
            ]
        }
    },
    // ... другие товары
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentItem = null;

// Инициализация
function init() {
    renderMenu();
    setupEventListeners();
    updateCartIcon();
}

// Рендер меню
function renderMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item" data-item='${JSON.stringify(item)}'>
            <img src="${item.image}" class="item-image">
            <h3 class="item-title">${item.name}</h3>
            <p class="item-price">${item.price} ₽</p>
        </div>
    `).join('');
}

// Обработчики событий
function setupEventListeners() {
    // Выбор категории
    document.querySelectorAll('.category').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.category.active').classList.remove('active');
            btn.classList.add('active');
            filterMenu(btn.dataset.category);
        });
    });

    // Открытие кастомизации
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            currentItem = JSON.parse(e.currentTarget.dataset.item);
            openCustomizationModal(currentItem);
        });
    });

    // Закрытие модалок
    document.querySelectorAll('.close-modal, .close-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('customizeModal').style.display = 'none';
            document.getElementById('cartSidebar').style.right = '-400px';
        });
    });

    // Открытие корзины
    document.getElementById('cartIcon').addEventListener('click', () => {
        document.getElementById('cartSidebar').style.right = '0';
        updateCartDisplay();
    });
}

// Фильтрация меню
function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemData = JSON.parse(item.dataset.item);
        if (category === 'all' || itemData.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Модальное окно кастомизации
function openCustomizationModal(item) {
    const modal = document.getElementById('customizeModal');
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalTotal').textContent = item.price;

    // Очистка опций
    const milkOptions = document.getElementById('milkOptions');
    const syrupOptions = document.getElementById('syrupOptions');
    milkOptions.innerHTML = '';
    syrupOptions.innerHTML = '';

    // Добавление опций молока
    item.customizations.milk.forEach(milk => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = `${milk.name}${milk.price > 0 ? ` (+${milk.price}₽)` : ''}`;
        div.addEventListener('click', () => selectOption(milk, 'milk'));
        milkOptions.appendChild(div);
    });

    // Добавление сиропов
    item.customizations.syrups.forEach(syrup => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = `${syrup.name} (+${syrup.price}₽)`;
        div.addEventListener('click', () => selectOption(syrup, 'syrup'));
        syrupOptions.appendChild(div);
    });

    modal.style.display = 'flex';
}

// Выбор опции
let selectedOptions = { milk: null, syrups: [] };
function selectOption(option, type) {
    if (type === 'milk') {
        selectedOptions.milk = option;
        document.querySelectorAll('#milkOptions .option').forEach(opt => 
            opt.classList.remove('selected'));
        event.target.classList.add('selected');
    } else {
        const index = selectedOptions.syrups.findIndex(s => s.name === option.name);
        if (index > -1) {
            selectedOptions.syrups.splice(index, 1);
            event.target.classList.remove('selected');
        } else {
            selectedOptions.syrups.push(option);
            event.target.classList.add('selected');
        }
    }
    updateModalTotal();
}

// Обновление суммы в модалке
function updateModalTotal() {
    let total = currentItem.price;
    if (selectedOptions.milk) total += selectedOptions.milk.price;
    total += selectedOptions.syrups.reduce((sum, s) => sum + s.price, 0);
    document.getElementById('modalTotal').textContent = total;
}

// Добавление в корзину
document.querySelector('.add-to-cart').addEventListener('click', () => {
    const item = {
        ...currentItem,
        customization: selectedOptions,
        totalPrice: parseInt(document.getElementById('modalTotal').textContent)
    };
    
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    document.getElementById('customizeModal').style.display = 'none';
    selectedOptions = { milk: null, syrups: [] };
});

// Обновление иконки корзины
function updateCartIcon() {
    document.querySelector('.cart-count').textContent = cart.length;
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);