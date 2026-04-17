# Usar una imagen oficial de Node.js
FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del servidor
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
