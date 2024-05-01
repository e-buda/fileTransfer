import * as fs from "node:fs";
import * as pathLib from "node:path";
import { v4 as uuidv4 } from 'uuid';
import {app} from "electron";

class FileResolver{
  filePath = "";
  constructor() {
    this.filePath=pathLib.join(app.getPath('userData'), "files.json")
    console.log(this.filePath)
    if(!fs.existsSync(this.filePath)){
      fs.writeFileSync(this.filePath,JSON.stringify({files:{}}))
    }
  }
  addFile(path){
    const files = JSON.parse(fs.readFileSync(this.filePath)).files
    const id = uuidv4()
    files[id] = {
      path:path,
      name: pathLib.basename(path)
    }
    fs.writeFileSync(this.filePath,JSON.stringify({files:files}))
    return id
  }
  listFiles(){
    return JSON.parse(fs.readFileSync(this.filePath)).files
  }
  removeFile(id){
    const files = JSON.parse(fs.readFileSync(this.filePath)).files
    delete files[id]
    fs.writeFileSync(this.filePath,JSON.stringify({files:files}))
    return true
  }
  getFile(id){
    const files = JSON.parse(fs.readFileSync(this.filePath)).files
    return files[id]
  }
}
export default FileResolver
