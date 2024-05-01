import pathLib from "node:path";
import {app} from "electron";
import fs from "node:fs";
import {v4 as uuidv4} from "uuid";

class Identity{
  filePath = "";
  constructor() {
    this.filePath=pathLib.join(app.getPath('userData'), "appID.json")
    console.log(this.filePath)
    if(!fs.existsSync(this.filePath)){
      fs.writeFileSync(this.filePath,JSON.stringify({
        identity:uuidv4()
      }))
    }
  }
  getIdentity(){
    return JSON.parse(fs.readFileSync(this.filePath)).identity
  }
}
export default Identity
