FROM node:6-onbuild

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.1.3/dumb-init_1.1.3_amd64
RUN chmod +x /usr/local/bin/dumb-init

RUN npm install -g coffee-script
RUN cake build

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["npm", "start"]
