import { UserFetchData } from "./components/UserFetchData";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Products } from "./components/Products";
import { EditProduct } from "./components/EditProduct";
import { AddProduct } from "./components/AddProduct";
import { Cart } from "./components/Cart";
import { EditSelf } from "./components/EditSelf";
import { Order } from "./components/Order";
import { Reports } from "./components/Reports";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/usersList',
        element: <UserFetchData />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/products',
        element: <Products />
    },
    {
        path: '/editProduct',
        element: <EditProduct />
    },
    {
        path: '/addProduct',
        element: <AddProduct />
    },
    {
        path: '/cart',
        element: <Cart />
    },
    {
        path: '/editSelf',
        element: <EditSelf />
    },
    {
        path: '/orders',
        element: <Order />
    },
    {
        path: '/reports',
        element: <Reports />
    }
];

export default AppRoutes;
