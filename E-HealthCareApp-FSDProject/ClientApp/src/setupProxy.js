const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:40436';

const context =  [
    "/Auth/register",
    "/Auth/login",
    "/Auth/GetMe",

    "/Account/getAllUsers",
    "/Account/getUser",
    "/Account/editOwnAccount",
    
    "/Product/getAllProducts",
    "/Product/deleteProduct/",
    "/Product/getProductById/",
    "/Product/updateMedicine/",
    "/Product/addProduct",
    "/Product/getProductByUse/",

    "/Cart/getCartByUserId",
    "/Cart/addToCart/",
    "/Cart/removeFromCart/",
    "/Cart/getAllCarts",

    "/Order/buyCartContent",
    "/Order/getOrderByUserId",
    "/Order/getAllOrders"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
