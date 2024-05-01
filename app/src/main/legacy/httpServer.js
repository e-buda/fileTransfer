//
import express from 'express';
import FileResolver from "./fileResolver";
const fr = new FileResolver()

const app = express();
app.get('/file/:file', (req, res) => {
  const file=fr.getFile(req.params.file)
  if(file){
    res.download(file.path);
  }
  else{
    res.send("NOFILE")
  }

});

let server;

function startServer() {
  server = app.listen(3000, () => {
    console.log('Serwer Express uruchomiony na porcie 3000');
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
      console.log('Serwer Express zatrzymany');
    });
  }
}

export { startServer, stopServer };
