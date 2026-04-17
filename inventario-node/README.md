# yubertec | Sistema de Gestión de Inventario & Tienda

Este proyecto es una plataforma integral de gestión de inventario y tienda virtual desarrollada para la venta de repuestos de laptops. Cuenta con una arquitectura "Bien Ordenada" utilizando bases de datos relacionales con Llaves Foráneas (FK) y una interfaz moderna.

## 🌟 Características Principales
- **Tienda Virtual:** Catálogo dinámico con búsqueda en tiempo real.
- **Carrito de Compras:** Panel flotante (drawer) con persistencia en `localStorage`.
- **Gestión de Stock:** Descuento automático de inventario mediante transacciones SQL tras cada compra.
- **Panel Administrativo:** Control total de productos (CRUD) con notificaciones de éxito/error.
- **Base de Datos Relacional:** Estructura optimizada en MySQL (VPS) con tablas vinculadas (Categorías, Productos, Pedidos).

## 🚀 Tecnologías
- **Backend:** Node.js + Express.js
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Base de Datos:** MySQL / MariaDB (Modo Promesas).
- **Herramientas:** Git, GitHub, Nodemon.

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/yuberzmac/inventario-node.git
   cd inventario-node
   ```

2. **Instalar dependencias:**
   Ejecuta el siguiente comando para instalar automáticamente todas las librerías necesarias (Express, MySQL2, Cors, etc.):
   ```bash
   npm install
   ```

3. **Configuración de Base de Datos:**
   El sistema está configurado para conectarse a una VPS. La estructura de tablas se crea **automáticamente** al iniciar el servidor por primera vez gracias al script integrado en `db.js`.

4. **Iniciar el sistema:**
   Para desarrollo (con reinicio automático):
   ```bash
   npm start
   ```
   Para producción:
   ```bash
   npm run serve
   ```

## 📂 Estructura del Proyecto
- `/api/productos`: Endpoints para gestión de inventario.
- `/api/productos/comprar`: Lógica transaccional de ventas.
- `/public`: Interfaz de usuario y panel administrativo.
- `db.js`: Configuración de conexión y esquema relacional.

---
**yubertec** - *Soluciones tecnológicas y repuestos para laptops.*
