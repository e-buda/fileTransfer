import {useEffect, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import QRCode from "react-qr-code";

export const QrDisplay = ({url,open,setOpen,fileName}) => {
  const handleClose = ()=>{
    setOpen(false)
  }
  return (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {fileName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{display:'flex',justifyContent:'center'}}>
                <Box sx={{background:"#fff",padding:"5px"}}>
                  <QRCode value={url} />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
    )
}
