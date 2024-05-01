import {app, dialog, ipcMain} from "electron";
import {startServer, stopServer} from "./httpServer";

const ip = require("ip");
import FileResolver from "./fileResolver";
import Config from "../config";
import Identity from "../online/identity";
import fs from "node:fs";

const identity = new Identity()
const conf = new Config()
const fr = new FileResolver()
const registerLegacy = () => {
  ipcMain.on('start-legacy', () => {
    startServer()
  })
  ipcMain.on('stop-legacy', () => {
    stopServer()
  })
  ipcMain.handle("readFiles", () => {
    return fr.listFiles()
  })
  ipcMain.handle("delete", (e, args) => {
    return fr.removeFile(args.id)
  })
  ipcMain.handle("url", (e,args) => {
    //const mode = conf.getConfig().online
    if (!args.online) {
      return {url: ip.address() + ":3000", isSecure: true}
    } else {
      const address = conf.getConfig().server + "/" + identity.getIdentity()
      const isSecure = conf.getConfig().isSecure
      return {isSecure: isSecure, url: address}
    }

  })
  ipcMain.on("import", (e, arg) => {
    dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}).then(r => {
      if (r.filePaths.length > 0) {
        r.filePaths.forEach((obj) => {
          fr.addFile(obj)
        })
        dialog.showMessageBoxSync({
          title: "Zapisano",
          message: "Dodano pliki"
        })
        e.reply("import")
      }
    })
  })
  app.on('quit', () => {
    stopServer()
  })
}

const legacyOnline = (event, ws) => {
  console.log(event.toString())
  const obj = JSON.parse(event.toString())
  if (obj.error) {
    dialog.showMessageBoxSync({
      type: "error",
      message: "Can't comunicate with online mode"
    })
    return
  }
  const command = obj.cmd
  switch (command) {
    case 'getFile':
      const fileID = obj.fileID
      const fileMeta = fr.getFile(fileID)
      const file = fs.readFileSync(fileMeta.path).toString('base64')
      ws.send(JSON.stringify({
        cmd: "transmit",
        to: obj.from,
        data: {fileName: fileMeta.name, file: file, cmd: 'fileData'}
      }))

      break

  }
}

export {registerLegacy, legacyOnline}
