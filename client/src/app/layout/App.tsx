import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPage from "../../features/about/AboutPage";
import BasketPage from "../../features/basket/BasketPage";
import { setBasket } from "../../features/basket/BasketSlice";

import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import CheckoutPage from "../../features/Checkout/CheckoutPage";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import agent from "../api/agent";
import { useStoreContext } from "../context/StoreContext";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import { useAppDispatch } from "../store/ConfigureStore";
import { getCookie } from "../util/util";
import Header from "./Header";
import Loading from "./Loading";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <Loading message="Please wait..." />;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" theme="colored" hideProgressBar />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/catalog" component={Catalog} />
          <Route path="/catalog/:id" component={ProductDetails} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/server-error" component={ServerError} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/basket" component={BasketPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
