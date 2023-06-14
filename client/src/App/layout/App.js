import Catalog from "../../Features/Catalog/catalog";
import { Container, createTheme } from "@mui/material";
import Header from "../../App/layout/Header";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from 'react';
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
import useStoreContext from "../context/StoreContext";
import { getCookie } from '../util/util';
import agent from '../api/agent';
import LoadingComponent from "./LoadingComponent";

function App() {
  const {setBasket} = useStoreContext();
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId')
    if(buyerId)
    {
      agent.basket.get()
        .then(basket => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }else{
      setLoading(false);
    }
  }, [setBasket]);
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
  if(loading) return <LoadingComponent message="Initializing app ..."></LoadingComponent>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
