const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productosRoutes = require('./routes/productos');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos frontend

// Rutas
app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de Inventario funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
