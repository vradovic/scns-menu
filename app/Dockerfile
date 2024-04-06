FROM node:slim
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]