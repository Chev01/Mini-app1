const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

document.getElementById('close-app').addEventListener('click', () => tg.close());

const menuData = [
    {
        category: "Классические кофейные напитки",
        sizes: ["S (250 мл)", "M (350 мл)", "L (450 мл)"],
        items: [
            {
                name: "Эспрессо",
                customSize: "60 мл",
                prices: ["120 ₽"],
                desc: "Интенсивный, как утро понедельника. Идеальная база для тех, кто ценит чистый вкус кофе."
            },
            {
                name: "Американо",
                prices: ["140 ₽", "160 ₽", "180 ₽"],
                desc: "Лёгкий, прозрачный, с нотками карамели. Для тех, кто не спешит, но хочет взбодриться."
            },
            {
                name: "Капучино",
                prices: ["160 ₽", "210 ₽", "260 ₽"],
                desc: "Воздушная пенка, бархатное молоко и идеальный баланс. Как объятие в чашке."
            },
            {
                name: "Латте",
                prices: ["160 ₽", "210 ₽", "260 ₽"],
                desc: "Нежный, сливочный, с деликатной пенкой. Для тех, кто любит кофе 'в обнимку с молоком'."
            },
            {
                name: "Раф",
                prices: ["160 ₽", "210 ₽", "260 ₽"],
                desc: "Сливочно-ванильное облако с лёгкой горчинкой. Напиток для романтиков и сладкоежек."
            },
            {
                name: "Флэт-Уайт",
                prices: ["260 ₽ (S)", "360 ₽ (L)"],
                desc: "Плотный, насыщенный, с шелковистой текстурой. Кофе, который говорит: 'Я серьёзный, но обаятельный'."
            },
            {
                name: "Мокко",
                prices: ["260 ₽ (M)", "310 ₽ (L)"],
                desc: "Шоколадный взрыв с карамельными нотками. Десерт, который можно пить."
            }
        ]
    },
    {
        category: "Без кофеина",
        sizes: ["S (250 мл)", "M (350 мл)", "L (450 мл)"],
        items: [
            {
                name: "Матча-Латте",
                prices: ["210 ₽", "260 ₽", "310 ₽"],
                desc: "Японская церемония в ваших руках. Травянистая свежесть и сливочная нежность."
            },
            {
                name: "Какао",
                prices: ["160 ₽", "210 ₽", "260 ₽"],
                desc: "Детство в чашке: густой, шоколадный, с облаком зефирного крема."
            }
        ]
    },
    {
        category: "Чайная коллекция",
        sizes: ["M (350 мл)", "L (450 мл)"],
        items: [
            {
                name: "Чёрный чай",
                prices: ["140 ₽", "180 ₽"],
                desc: "Классика с терпким характером. Бодрит, как первый луч солнца."
            },
            {
                name: "Зелёный чай",
                prices: ["140 ₽", "180 ₽"],
                desc: "Свежий, травянистый, с лёгкой горчинкой. Эликсир для ясного ума."
            },
            {
                name: "Молочный улун",
                prices: ["140 ₽", "180 ₽"],
                desc: "Тайваньская магия: сливочные ноты в обрамлении цветочного аромата."
            },
            {
                name: "Малиновое утро",
                prices: ["180 ₽", "210 ₽"],
                desc: "Ягодный фейерверк с лёгкой кислинкой. Пробуждает лучше будильника!"
            },
            {
                name: "Ананас-Вишня",
                prices: ["180 ₽", "210 ₽"],
                desc: "Тропики в чашке: сладость ананаса и игривая кислинка вишни."
            }
        ]
    },
    {
        category: "Холодные напитки",
        items: [
            {
                name: "Айс-Латте",
                prices: ["210 ₽ (M)", "260 ₽ (L)"],
                desc: "Охлаждённая нежность: лёд, молоко и эспрессо. Спасение в летний зной."
            },
            {
                name: "Бамбл-кофе",
                subItems: ["Апельсин", "Вишня"],
                prices: ["260 ₽ (M)", "310 ₽ (L)"],
                desc: "Фруктовый взрыв! Цитрусовый заряд или вишнёвая игривость в дуэте с кофе."
            },
            {
                name: "Эспрессо-Тоник",
                prices: ["260 ₽ (M)", "310 ₽ (L)"],
                desc: "Горьковато-свежий тандем: тонизирующая горечь эспрессо и игристый тоник."
            },
            {
                name: "Айс-Матча",
                prices: ["280 ₽ (M)", "330 ₽ (L)"],
                desc: "Японская прохлада: матча, лёд и сливочное молоко. Энергия без кофеина."
            },
            {
                name: "Мохито",
                prices: ["240 ₽"],
                desc: "Освежающий микс лайма и мяты. Летний бриз в каждом глотке."
            }
        ]
    }
];

let cart = [];

function renderMenu() {
    const container = document.getElementById('menu-container');
    
    menuData.forEach(category => {
        const categoryHTML = `
            <div class="category-card">
                <h2 class="category-title">${category.category}</h2>
                ${category.sizes ? `<div class="size-badge">${category.sizes.join(' • ')}</div>` : ''}
                
                <div class="items-list">
                    ${category.items.map(item => `
                        <div class="menu-item">
                            <div class="item-header">
                                <span class="item-name">${item.name}</span>
                                <span class="price-tag">${item.prices.join(' / ')}</span>
                            </div>
                            <p class="item-desc">${item.desc}</p>
                            <div class="item-controls">
                                ${item.subItems ? `
                                    <select class="size-select">
                                        ${item.subItems.map(sub => `
                                            <option>${sub}</option>
                                        `).join('')}
                                    </select>
                                ` : ''}
                                
                                ${item.prices.length > 1 ? `
                                    <select class="size-select">
                                        ${item.prices.map((_,i) => `
                                            <option>${['S','M','L'][i]}</option>
                                        `).join('')}
                                    </select>
                                ` : ''}
                                
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

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.dataset.item;
            cart.push(item);
            updateCart();
            tg.HapticFeedback.impactOccurred('medium');
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 200);
        });
    });
}

function updateCart() {
    document.querySelector('.cart-counter').textContent = cart.length;
    tg.HapticFeedback.impactOccurred('light');
}

document.addEventListener('DOMContentLoaded', renderMenu);