import {useContext, useEffect, useState} from "react";
import {Box, Button, createTheme, CssBaseline, IconButton, ThemeProvider, Typography} from "@mui/material";
import {Legacy} from "./components/Legacy/Legacy";
import NavigationContext from "./contexts/NavigationContext";
import {Settings} from "./components/Settings/Settings"

function App() {
  const {navigation,setNavigation} = useContext(NavigationContext);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#01bd8b',
      }
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box padding={"10px"}>
          {
            navigation === "legacy"&&<Legacy/>
          }
          {
            navigation === "f2f"&&<Typography>Pracujemy nad tym</Typography>
          }
          {
            navigation===null&&
            <>
              <Button onClick={()=>{
                setNavigation("legacy")
              }}>Legacy</Button>
            </>
          }
        </Box>
      </ThemeProvider>
    </>
  )
}

export default App

