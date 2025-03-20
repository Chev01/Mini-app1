class CoffeeApp {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.showLoader();
        this.setupEventListeners();
        this.loadMenuData();
    }

    showLoader() {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1000);
    }

    async loadMenuData() {
        try {
            const response = await fetch('menu-data.json');
            this.menuData = await response.json();
            this.renderMenu();
        } catch (error) {
            this.showError('Не удалось загрузить меню');
        }
    }

    renderMenu() {
        const container = document.getElementById('menuContainer');
        
        this.menuData.forEach(category => {
            const categoryHTML = `
                <div class="category-card">
                    <h2 class="category-title">${category.category}</h2>
                    ${category.sizes ? `
                        <div class="size-badge">
                            ${category.sizes.join(' • ')}
                        </div>
                    ` : ''}
                    
                    <div class="category-content">
                        ${category.items.map(item => `
                            <div class="menu-item">
                                <div class="item-header">
                                    <span class="item-name">${item.name}</span>
                                    <span class="price-tag">
                                        ${item.prices[0]}
                                    </span>
                                </div>
                                <p class="item-desc">${item.desc}</p>
                                ${this.renderSizeSelector(item)}
                                <button class="add-to-cart" data-item="${item.name}">
                                    <i class="fas fa-plus"></i>
                                    Добавить
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            container.innerHTML += categoryHTML;
        });

        this.setupDynamicEventListeners();
    }

    renderSizeSelector(item) {
        if (!item.prices || item.prices.length <= 1) return '';
        
        return `
            <div class="size-selector">
                ${item.prices.map((price, index) => `
                    <div class="size-pill ${index === 0 ? 'active' : ''}" 
                         data-price="${price}"
                         data-size="${['S','M','L'][index]}">
                        ${['S (250мл)','M (350мл)','L (450мл)'][index]}
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupDynamicEventListeners() {
        document.querySelectorAll('.size-pill').forEach(pill => {
            pill.addEventListener('click', (e) => this.handleSizeSelect(e));
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAddToCart(e));
        });

        document.getElementById('cartButton').addEventListener('click', () => this.showCart());
    }

    handleSizeSelect(event) {
        const pill = event.target;
        const parent = pill.closest('.menu-item');
        
        parent.querySelectorAll('.size-pill').forEach(p => 
            p.classList.remove('active'));
        
        pill.classList.add('active');
        parent.querySelector('.price-tag').textContent = pill.dataset.price;
    }

    handleAddToCart(event) {
        const button = event.target.closest('button');
        const item = this.getSelectedItemData(button);
        
        this.cart.push(item);
        this.updateCartUI();
        this.showAddEffect(button);
    }

    getSelectedItemData(button) {
        const itemElement = button.closest('.menu-item');
        return {
            name: itemElement.querySelector('.item-name').textContent,
            size: itemElement.querySelector('.size-pill.active')?.dataset.size || 'S',
            price: itemElement.querySelector('.price-tag').textContent
        };
    }

    updateCartUI() {
        document.getElementById('cartCounter').textContent = this.cart.length;
    }

    showAddEffect(button) {
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 500);
    }

    showCart() {
        // Здесь можно реализовать панель корзины
        alert(`В корзине: ${this.cart.length} товаров\nИтого: ${this.calculateTotal()} ₽`);
    }

    calculateTotal() {
        return this.cart.reduce((sum, item) => {
            return sum + parseInt(item.price.match(/\d+/)[0]);
        }, 0);
    }

    showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        document.body.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 3000);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => new CoffeeApp());