import {useContext, useEffect, useState} from "react";
import {Box, Button, FormControlLabel, IconButton, Switch, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
  ContentCopy as ContentCopyIcon,
  DeleteForever as DeleteForeverIcon,
  QrCode as QrCodeIcon
} from "@mui/icons-material";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {QrDisplay} from "../QrDisplay/QrDisplay";
import NavigationContext from "../../contexts/NavigationContext";

export const Legacy = () => {
  const {setNavigation} = useContext(NavigationContext);
  const [onlineMode, setOnlineMode] = useState(true);
  const [files, setFiles] = useState([])
  const [url, setUrl] = useState(null);
  const [qrCodeDisplay, setQrCodeDisplay] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const importFile = () => {
    window.electron.ipcRenderer.send('import')
  }
  const deleteFile = (id) => {
    window.electron.ipcRenderer.invoke('delete', {id: id}).then(() => {
      listFiles()
    })
  }
  useEffect(() => {
    window.electron.ipcRenderer.send("start-legacy")
    return () => {
      window.electron.ipcRenderer.send("stop-legacy")
    }
  }, [])
  useEffect(() => {
    getUrl()
  }, [onlineMode]);

  const listFiles = () => {
    window.electron.ipcRenderer.invoke('readFiles').then((result) => {
      const list = []
      for (const klucz in result) {
        if (result.hasOwnProperty(klucz)) {
          const obiekt = {id: klucz, ...result[klucz]};
          list.push(obiekt);
        }
      }
      setFiles(list)
      console.log(list)
    })
  }
  const getUrl = () => {
    window.electron.ipcRenderer.invoke('url',{online:onlineMode}).then((url) => {
      console.log(url)
      setUrl(url)
    })
  }

  const sendMessage = (m) => {
    window.electron.ipcRenderer.send("message", {message: m})
  }
  useEffect(() => {
    console.log("AAAAAAAAA")
    window.electron.ipcRenderer.on('import', () => {
      listFiles()
    })
    listFiles()
    getUrl()
  }, []);
  const columns = [
    {
      field: 'actions', headerName: 'Akcje', width: 150, renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => {
              setQrUrl(`${url.isSafe ? "https://":"http://"}` + url.url + "/file/" + params.id)
              console.log(params)
              setFileName(params.row.name)

              setQrCodeDisplay(true)

            }}><QrCodeIcon/></IconButton>
            <CopyToClipboard text={`${url.isSafe ? "https://":"http://"}` + url.url + "/file/" + params.id} onCopy={() => {
              sendMessage('Skopiowano :D')
            }}>
              <IconButton><ContentCopyIcon/></IconButton>
            </CopyToClipboard>
            <IconButton onClick={() => {
              if (confirm("Jesteś pewny?")) {
                deleteFile(params.id)
              }
            }}><DeleteForeverIcon/></IconButton>
          </>
        )
      }
    },
    {field: 'name', headerName: "Nazwa", width: 500}
  ]
  return (
    <>
      <Button onClick={() => {
        setNavigation(null)
      }}>Go back</Button>
      <Typography variant={"h4"}>Legacy Mode</Typography>
      <FormControlLabel onChange={(e)=>{
        setOnlineMode(e.target.checked)
        //setOnlineMode(e)
      }} control={<Switch defaultChecked />} label="Online Mode" />
      <QrDisplay open={qrCodeDisplay} setOpen={setQrCodeDisplay} fileName={fileName} url={qrUrl}/>
      {
        files.length > 0 ? <>
          <DataGrid
            rows={files}
            columns={columns}
            rowSelection={false}
            initialState={{
              pagination: {
                paginationModel: {page: 0, pageSize: 10},
              },
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}

          /></> : <><Typography variant={"h2"} textAlign={"center"}>Brak Plików</Typography></>
      }
      <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: '10px'}}>
        <Button variant="outlined" onClick={() => {
          importFile()
        }}>Dodaj</Button>
      </Box>
    </>
  )
}
