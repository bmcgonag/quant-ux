# Quant-UX - Prototype, Test and Learn

Quant UX is a research, usability and prototyping tool to quickly test your designs and get data driven insights. 
This repo contains the front end. You can find a working demo at https://quant-ux.com/#/


## Develpment setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```


# Installation

Quant-UX has two components. A front-end (this package) and a backend (qux-java). The front-end needs node (> 12) installed. The backend needs a Mongo DB, Mail Server (SMPT) and Java (> 1.8).
The front-end comoes with it's own mini web server, which also include a procy that redirects all request to the correct backend.

## Backend

- Install Mongo DB (> 4.4)

- Install Java (1.8)

- Checkout the backend

```
git clone https://github.com/KlausSchaefers/qux-java.git
```

- This contains already a compiled version of the backend in the release folder

- Edit the matc.conf file to setup the correct mongo and mails server details. More details can be found here: https://github.com/KlausSchaefers/qux-java

- Start the server, or install as a service in Linux. 

```
java -jar release/matc.jar -Xmx2g -conf matc.conf -instances 1
```


## Front-end

- Install Node.js (> 12)

- Clone repo

```
git clone https://github.com/KlausSchaefers/quant-ux.git
```

- Install all dependecies:

```
npm install
```

- Build 
```
npm run build
```

- Edit server/start.js to point the proxy to the right server, e.g.

```
app.use('/rest/', proxyMiddleware({
    target: 'https://api.yourserver.com',
    changeOrigin: true
}))

```

- Start
```
node server/start.js
```

## Reverse Proxy

Now you should have a a running system. It is not secure yet. The best is to put both behind a NGINX reverse proxy, which handles SSL.

- https://www.scaleway.com/en/docs/tutorials/nginx-reverse-proxy/

You can use https://letsencrypt.org/ to create SSL certificates










