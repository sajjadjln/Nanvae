import Catalog from "../../Features/Catalog/catalog";
import { Container, createTheme } from "@mui/material";
import Header from "../../App/layout/Header";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import HomePage from "../../Features/home/HomePage";
import ProductDetails from "../../Features/Catalog/ProductDetails";
import AboutPage from "../../Features/about/aboutPage";
import ContactPage from "../../Features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../Features/basket/BasketPage";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from '../store/configureStore';
import Register from '../../Features/account/register';
import Login from '../../Features/account/login';
import { fetchCurrentUser } from "../../Features/account/accountSlice";
import { fetchBasketAsync } from "../../Features/basket/basketSlice";
import CheckOutPage from "../../Features/checkout/CheckOutPage";
import PrivateRoute from './PrivateRoute';
import Order from "../../Features/orders/order";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
     dispatch(fetchCurrentUser());
     dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  useEffect(() => {
    initApp().then(() => {
      setLoading(false);
    })
  }, [initApp]);


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212"
      }
    }
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }
  if (loading) return <LoadingComponent message="Initializing app ..."></LoadingComponent>
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' theme='colored' />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Catalog" element={<Catalog />} />
          <Route path="/Catalog/:id" element={<ProductDetails />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/checkout" element={<PrivateRoute><CheckOutPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Order /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
