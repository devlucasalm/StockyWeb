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
# No Angular 17+, os ficheiros ficam em dist/[nome-do-projeto]/browser
# Substitua 'NOME_DO_PROJETO' pelo nome que está no seu angular.json
COPY --from=build /app/dist/stocky-web/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]