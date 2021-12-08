# frontend/Dockerfile
FROM node:14.17.6

WORKDIR /usr/app

COPY package.json .
COPY src/ src/
COPY public/ public/

RUN npm install --silent
RUN npm run build --prod --silent

RUN apt-get update && apt-get install -y nginx
RUN sudo add-apt-repository ppa:certbot/certbot
RUN sudo apt-get update
RUN sudo apt-get install -y python-certbot-nginx
RUN sudo certbot certonly --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory -d www.subroker.shop
# should have made nginx configuration file to the frontend directory
COPY nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]