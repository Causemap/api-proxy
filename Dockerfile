FROM dockerfile/nodejs
ADD . /src
WORKDIR /src
RUN npm install
EXPOSE 9200
EXPOSE 80

CMD node proxy.js
