const API_URL = '/api/productos';
const form = document.getElementById('producto-form');
const tabla = document.getElementById('productos-tabla');
const filterInput = document.getElementById('table-filter');

let cachedProducts = [];

document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        cachedProducts = await res.json();
        updateKPIs(cachedProducts);
        renderTabla(cachedProducts);
    } catch (error) {
        console.error("Error cargando inventario:", error);
    }
}

function updateKPIs(data) {
    const totalItems = data.length;
    const totalValue = data.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    const lowStockCount = data.filter(p => p.stock < 5).length;

    document.getElementById('stat-total-items').textContent = totalItems;
    document.getElementById('stat-total-value').textContent = `S/. ${totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    document.getElementById('stat-low-stock').textContent = lowStockCount;
}

function renderTabla(productos) {
    tabla.innerHTML = '';
    productos.forEach(p => {
        const stockStatus = p.stock < 5 ? 'Crítico' : (p.stock < 10 ? 'Bajo' : 'Normal');
        const statusClass = p.stock < 5 ? 'status-critical' : (p.stock < 10 ? 'status-low' : 'status-normal');

        tabla.innerHTML += `
            <tr>
                <td>#${p.id}</td>
                <td>
                    <div style="font-weight: 600;">${p.nombre}</div>
                    <div style="font-size: 11px; color: #666;">${p.categoria}</div>
                </td>
                <td>S/. ${parseFloat(p.precio).toFixed(2)}</td>
                <td><strong>${p.stock}</strong></td>
                <td><span class="badge ${statusClass}">${stockStatus}</span></td>
                <td class="actions">
                    <button class="btn-icon-edit" onclick="editP(${p.id},'${p.nombre}','${p.categoria}',${p.precio},${p.stock})" title="Editar">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-icon-delete" onclick="deleteP(${p.id})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Filtro en tiempo real
filterInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = cachedProducts.filter(p => p.nombre.toLowerCase().includes(term));
    renderTabla(filtered);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const data = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    form.reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('btn-cancel').style.display = 'none';
    document.getElementById('btn-submit').textContent = 'Guardar en VPS';
    fetchProducts();
});

async function deleteP(id) {
    if(confirm('¿Seguro que deseas eliminar este producto de la base de datos remota?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchProducts();
    }
}

window.editP = (id, n, c, p, s) => {
    document.getElementById('producto-id').value = id;
    document.getElementById('nombre').value = n;
    document.getElementById('categoria').value = c;
    document.getElementById('precio').value = p;
    document.getElementById('stock').value = s;
    
    document.getElementById('btn-submit').textContent = 'Actualizar Datos';
    document.getElementById('btn-cancel').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-cancel').addEventListener('click', () => {
    form.reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('btn-cancel').style.display = 'none';
    document.getElementById('btn-submit').textContent = 'Guardar en VPS';
});
