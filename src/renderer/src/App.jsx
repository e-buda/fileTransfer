import {useEffect, useState} from "react";
import {Box, Button, createTheme, CssBaseline, IconButton, ThemeProvider, Typography} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import {QrCode as QrCodeIcon,DeleteForever as DeleteForeverIcon, ContentCopy as ContentCopyIcon} from "@mui/icons-material";
import {QrDisplay} from "./components/QrDisplay";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function App() {
  const [files, setFiles] = useState([])
  const [ipAdress, setIpAdress] = useState(null);
  const [qrCodeDisplay, setQrCodeDisplay] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [deleteID, setDeleteID] = useState(null)
  const [fileName, setFileName] = useState("")
  const importFile = () =>{
    window.electron.ipcRenderer.send('import')
  }
  const deleteFile = (id)=>{
    window.electron.ipcRenderer.invoke('delete',{id:id}).then(()=>{
      listFiles()
    })
  }
  const listFiles = ()=>{
    window.electron.ipcRenderer.invoke('readFiles').then((result) => {
      const list=[]
      for (const klucz in result) {
        if (result.hasOwnProperty(klucz)) {
          const obiekt = { id: klucz, ...result[klucz] };
          list.push(obiekt);
        }
      }
      setFiles(list)
      console.log(list)
    })
  }
  const getIP = () =>{
    window.electron.ipcRenderer.invoke('ip').then((ip)=>{
      setIpAdress(ip)
      console.log(ip)
    })
  }
  const sendMessage = (m)=>{
    window.electron.ipcRenderer.send("message",{message:m})
  }
  useEffect(() => {
    window.electron.ipcRenderer.on('import',()=>{
      listFiles()
    })
    listFiles()
    getIP()
  }, []);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#01bd8b',
      }
    },
  });
  const columns = [
    {field:'actions',headerName:'Akcje',width:150,renderCell:(params)=>{
      return(
        <>
          <IconButton onClick={()=>{
            setQrUrl("http://"+ipAdress+":3000/file/"+params.id)
            console.log(params)
            setFileName(params.row.name)

            setQrCodeDisplay(true)

          }}><QrCodeIcon/></IconButton>
          <CopyToClipboard text={"http://"+ipAdress+":3000/file/"+params.id} onCopy={() => {
            sendMessage( 'Skopiowano :D')
          }}>
            <IconButton><ContentCopyIcon/></IconButton>
          </CopyToClipboard>
          <IconButton onClick={()=>{
            if(confirm("Jesteś pewny?")){
              deleteFile(params.id)
            }
          }}><DeleteForeverIcon/></IconButton>
        </>
      )
      }},
    {field:'name',headerName:"Nazwa",width:500}
  ]
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <QrDisplay open={qrCodeDisplay} setOpen={setQrCodeDisplay} fileName={fileName} url={qrUrl} />
        <Box padding={"10px"}>
          {
            files.length > 0 ?<>
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

              /></>:<><Typography variant={"h2"} textAlign={"center"}>Brak Plików</Typography></>
          }
          <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: '10px'}}>
            <Button variant="outlined" onClick={() => {
              importFile()
            }}>Dodaj</Button>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default App

