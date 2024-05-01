import {useContext, useState} from "react";
import NavigationContext from "../../contexts/NavigationContext";
import {Box, Button, ButtonGroup, Typography} from "@mui/material";

export const Settings = () => {
  const {navigation, setNavigation} = useContext(NavigationContext);
  const [mode, setMode] = useState('local');
  return (
    <>
      <Button onClick={() => {
        setNavigation(null)
      }}>Go back</Button>
      <Typography variant={"h4"}>Settings</Typography>
      <ButtonGroup
        variant="contained"
        aria-label="Disabled button group"
      >
        <Button onClick={()=>{setMode('local')}} variant={mode==="local"?"contained":"outlined"}>Local Mode</Button>
        <Button onClick={()=>{setMode('auto')}} variant={mode==="auto"?"contained":"outlined"}>Automatic</Button>
        <Button onClick={()=>{setMode('online')}} variant={mode==="online"?"contained":"outlined"}>Online Mode</Button>
      </ButtonGroup>
    </>
  )
}
