# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copia os ficheiros de configuração e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante código e gera o build de produção
COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Serve com Nginx
FROM nginx:alpine
COPY --from=build /app/dist/stocky-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE $PORT
CMD ["/docker-entrypoint.sh"]