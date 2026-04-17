const API_URL = '/api/productos';
const grid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Elementos del Carrito
const cartToggle = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalDisplay = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchStoreProducts();
    updateCartUI();
});

async function fetchStoreProducts() {
    try {
        const res = await fetch(API_URL);
        allProducts = await res.json();
        renderStore(allProducts);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function renderStore(productos) {
    grid.innerHTML = '';
    
    if (productos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(p => {
        const imgUrl = `https://picsum.photos/seed/${p.id + 100}/400/300`;
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image" style="background-image: url('${imgUrl}')"></div>
            <div class="product-info">
                <h3 class="product-title">${p.nombre}</h3>
                <div class="product-price">S/. ${parseFloat(p.precio).toFixed(2)}</div>
                <p style="font-size: 12px; color: #888; margin-bottom: 10px;">Stock: ${p.stock} unidades</p>
                <button class="btn-add-cart">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
                <button class="btn-whatsapp" onclick="window.open('https://wa.me/51998113815?text=Hola, estoy interesado en ${p.nombre}', '_blank')">
                    <i class="fab fa-whatsapp"></i> Consultar
                </button>
            </div>
        `;

        // Evento agregar al carrito
        card.querySelector('.btn-add-cart').addEventListener('click', () => addToCart(p));
        
        grid.appendChild(card);
    });
}

// Lógica del Carrito
function addToCart(product) {
    if (product.stock <= 0) {
        alert("Lo sentimos, este producto no tiene stock disponible.");
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    
    // Feedback visual: Abrir el carrito automáticamente
    cartModal.style.display = 'block';
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Actualizar contador
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Actualizar lista de items
    cartItemsContainer.innerHTML = '';
    let totalMoney = 0;

    cart.forEach(item => {
        const subtotal = item.precio * item.quantity;
        totalMoney += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.nombre} (x${item.quantity})</h4>
                <p>S/. ${subtotal.toFixed(2)}</p>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalDisplay.textContent = `S/. ${totalMoney.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888;">El carrito está vacío.</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.5";
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = "1";
    }
}

// Modal Toggle
cartToggle.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// Checkout
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;
    
    const confirmBuy = confirm(`¿Deseas confirmar la compra por ${cartTotalDisplay.textContent}?`);
    if (confirmBuy) {
        try {
            const res = await fetch(`${API_URL}/comprar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carrito: cart })
            });

            const data = await res.json();

            if (res.ok) {
                alert("¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.");
                cart = [];
                saveCart();
                updateCartUI();
                cartModal.style.display = 'none';
                fetchStoreProducts(); // Recargar productos para ver stock actualizado
            } else {
                alert("Error al procesar la compra: " + (data.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error en el checkout:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    }
});

// Buscador
searchBtn.addEventListener('click', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p => p.nombre.toLowerCase().includes(term));
    renderStore(filtered);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});
