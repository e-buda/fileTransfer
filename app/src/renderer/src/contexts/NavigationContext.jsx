import {createContext, useEffect, useState} from "react";

export const NavigationContext = createContext();

export const NavigationContextProvider = ({children}) => {
  const [navigation, setNavigation] = useState("legacy");
  return (
    < NavigationContext.Provider value={{navigation,setNavigation}}>
      {children}
    </ NavigationContext.Provider>
  )

}
export default NavigationContext;
