import Catalog from "../../Features/Catalog/catalog";
import { Container, createTheme } from "@mui/material";
import Header from "../../App/layout/Header";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import HomePage from "../../Features/home/HomePage";
import ProductDetails from "../../Features/Catalog/ProductDetails";
import AboutPage from "../../Features/about/aboutPage";
import ContactPage from "../../Features/contact/ContactPage";
function App() {
  const [darkMode, setDarkmode] = useState(false);
  const pallateType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: pallateType,
      background: {
        default: pallateType === "light" ? "#eaeaea" : "#121212"
      }
    }
  });
  function handleThemeChange() {
    setDarkmode(!darkMode);
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}></Header>
      <Container>
        <Routes>
          <Route exact path='/' Component={HomePage} />
          <Route exact path='/Catalog' Component={Catalog} />
          <Route exact path='/Catalog/:id' Component={ProductDetails} />
          <Route exact path='/About' Component={AboutPage} />
          <Route exact path='/Contact' Component={ContactPage} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
