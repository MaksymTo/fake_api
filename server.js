const config = require('config');

const jsonServer = require('json-server');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const server = jsonServer.create();

const accessHeader = require('./middleware/access-headers');

const usersRoute = require("./routes/users.route");
const threadsRoute = require("./routes/threads.route");
const adsRoute = require("./routes/ads.route");

if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

server.use(accessHeader);

server.use(middlewares);

server.use(jsonServer.bodyParser)

server.use("/api/users", usersRoute);
server.use("/api/threads", threadsRoute);
server.use("/api/ads", adsRoute);

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on localhost:3000')
});
