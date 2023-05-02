import Catalog from "../../Features/Catalog/catalog";
import { Container, createTheme } from "@mui/material";
import Header from "../../App/layout/Header";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from 'react';
function App() {
  const [darkMode, setDarkmode] = useState(false);
  const pallateType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: pallateType,
      background:{
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
        <Catalog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
