document.addEventListener('DOMContentLoaded', () => {
    // Скрыть лоадер
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 300);
    }, 1000);

    // Данные меню
    const menuData = [
        {
            category: "Классические кофейные напитки",
            items: [
                {
                    name: "Эспрессо",
                    price: "120 ₽",
                    size: "60 мл",
                    desc: "Интенсивный, как утро понедельника..."
                },
                {
                    name: "Американо",
                    price: "140-180 ₽",
                    sizes: ["S:140", "M:160", "L:180"],
                    desc: "Лёгкий, прозрачный, с нотками карамели..."
                }
            ]
        }
    ];

    // Генерация меню
    const menuContainer = document.getElementById('menuContainer');
    
    menuData.forEach(category => {
        const categoryHTML = `
            <div class="category">
                <h2>${category.category}</h2>
                ${category.items.map(item => `
                    <div class="item">
                        <div class="item-name">${item.name}</div>
                        ${item.size ? `<div class="item-size">${item.size}</div>` : ''}
                        <div class="item-price">${item.price}</div>
                        <p class="item-desc">${item.desc}</p>
                        <button class="add-to-cart">Добавить</button>
                    </div>
                `).join('')}
            </div>
        `;
        menuContainer.innerHTML += categoryHTML;
    });

    // Логика корзины
    let cartCount = 0;
    const cartCounter = document.querySelector('.cart-counter');
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartCounter.textContent = cartCount;
            button.classList.add('added');
            setTimeout(() => button.classList.remove('added'), 500);
        });
    });
});