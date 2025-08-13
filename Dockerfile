# Imagen base oficial de Node
FROM node:18-alpine

# Crear y establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# Variables de entorno por defecto
ENV PORT=10000
ENV NODE_ENV=production

# Exponer puerto dinámico que Render asigna
EXPOSE 10000

# Comando para iniciar la app
CMD ["npm", "start"]
