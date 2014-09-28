FROM dockerfile/nodejs
ADD . /src
WORKDIR /src
RUN npm install
EXPOSE 9200

CMD node proxy.js
