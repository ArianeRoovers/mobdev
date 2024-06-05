const ROUTES = {
  home: "/",
  brands: "/brands",
  brandDetail: "/brand/:brandName",
  profile: "/profile",
  products: "/products",
  productDetail: "/product/:id",
  contactSeller: "/product/:id/contact-seller",
  messages: "/messages",
  productsByCategory: "/products/:category",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  sellerMessages: "/dashboard/messages",
  productManager: "/dashboard/products/create",
  editProduct: "/dashboard/products/edit/:id",
  cart: "/cart",
  order: "/order/:orderId",
  search: "/search",
  notFound: "*",
};

export default ROUTES;
