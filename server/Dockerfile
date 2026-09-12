FROM node:20-alpine
WORKDIR /app
COPY package*.json /app/
COPY . /app/
RUN npm install
#RUN npm ci --only=production
#RUN  npm install --production --silent && mv node_modules ../
# ENV BACKEND_URL="http://localhost:8080/api"
ENV BACKEND_URL="https://luxoramall.com/api"
# ENV BACKEND_URL="http://localhost:8080/api"
EXPOSE 8088
CMD ["npm", "start"]
