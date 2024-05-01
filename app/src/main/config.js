import pathLib from "node:path";
import {app} from "electron";
import fs from "node:fs";
import {v4 as uuidv4} from "uuid";

class Config{
  filePath = "";
  constructor() {
    this.filePath=pathLib.join(app.getPath('userData'), "config.json")
    console.log(this.filePath)
    if(!fs.existsSync(this.filePath)){
      fs.writeFileSync(this.filePath,JSON.stringify({
        mode:"auto",
        server:"ft.e-buda.eu",
        secure:true
      }))
    }
  }
  saveConfig(config){
    fs.writeFileSync(this.filePath,JSON.stringify(config))
  }
  getConfig(){
    return JSON.parse(fs.readFileSync(this.filePath))
  }
}
export default Config
