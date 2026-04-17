# Sistema de Inventario CRUD - Node.js & MySQL (SENATI)

Este proyecto es una API REST desarrollada para la tarea **HT-02: Entorno de ejecución backend con JavaScript**. Permite gestionar un inventario de productos conectado a una base de datos MySQL alojada en una VPS.

## 📋 Objetivo
Aplicar prácticas de desarrollo colaborativo, uso de ramas, control de versiones e integración con Git y GitHub.

## 🚀 Tecnologías utilizadas
- **Node.js**: Entorno de ejecución.
- **Express**: Framework para el servidor web.
- **MySQL**: Base de datos (MariaDB/MySQL).
- **Docker**: (Opcional) Contenedorización de la aplicación.

## 🛠️ Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar la base de datos:**
   Asegúrate de tener acceso a la base de datos MySQL configurada en `db.js`.
4. **Iniciar el servidor:**
   ```bash
   npm start
   ```

## 🔌 Endpoints de la API
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/productos` | Obtiene la lista de todos los productos. |
| **POST** | `/api/productos` | Crea un nuevo producto. |
| **PUT** | `/api/productos/:id` | Actualiza un producto existente. |
| **DELETE** | `/api/productos/:id` | Elimina un producto. |

---
*Desarrollado como parte de la formación profesional en Ingeniería de Software con IA.*
