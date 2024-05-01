import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/roboto/400.css';
import {NavigationContextProvider} from "./contexts/NavigationContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <NavigationContextProvider>
      <App />
  </NavigationContextProvider>

)
