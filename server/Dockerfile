FROM tugboatqa/debian
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs
WORKDIR /app
COPY ./package.json /app/
RUN npm install
COPY . /app/
EXPOSE 4000
RUN npm run build
CMD ["npm", "run", "start"]