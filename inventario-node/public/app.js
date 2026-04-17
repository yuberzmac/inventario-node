const API_URL = '/api/productos';
const grid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let allProducts = [];

document.addEventListener('DOMContentLoaded', fetchStoreProducts);

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
        // Imagen basada en el nombre para que sea más real
        const query = p.nombre.split(' ')[0].toLowerCase();
        const imgUrl = `https://picsum.photos/seed/${p.id + 100}/400/300`;
        
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${imgUrl}')"></div>
                <div class="product-info">
                    <h3 class="product-title">${p.nombre}</h3>
                    <div class="product-price">S/. ${parseFloat(p.precio).toFixed(2)}</div>
                    <p style="font-size: 12px; color: #888; margin-bottom: 10px;">Stock: ${p.stock} unidades</p>
                    <button class="btn-buy" onclick="alert('Consulta por ${p.nombre} al 998 113 815')">
                        <i class="fab fa-whatsapp"></i> Consultar
                    </button>
                </div>
            </div>
        `;
    });
}

// Buscador
searchBtn.addEventListener('click', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p => p.nombre.toLowerCase().includes(term));
    renderStore(filtered);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});
