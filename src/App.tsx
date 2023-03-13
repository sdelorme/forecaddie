import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { routes as appRoutes } from "./routes";

function App() {
  // define theme
  const theme = createTheme({
    palette: {
      primary: {
        light: "#5A998C",
        main: "#076652",
        dark: "#054437",
        contrastText: "#000",
      },
      secondary: {
        main: "#ffdf00",
        light: "#FFE749",
        dark: "#DBBD00",
        contrastText: "#000",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <Router>
          <Navbar />
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.key} path={route.path} element={<route.component />} />
            ))}
          </Routes>
          <Footer />
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
