const readline = require("readline");
const {startProxy,stopProxy} = require("./modules/proxy")
const{startWebSocket,stopWebSocket} = require("./modules/ws")
const {startHttp,stopHttp} = require("./modules/http")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const services={
    proxy:{
        start:startProxy,
        stop:stopProxy,
        status:false
    },
    websocket:{
        start:startWebSocket,
        stop:stopWebSocket,
        status:false
    },
    http:{
        start:startHttp,
        stop:stopHttp,
        status:false
    }
}
for(k in services){
    services[k].start()
    services[k].status = true
    console.log(`Started ${k}`)
}
rl.on('line',(line)=>{
    const cmd = line.split(" ")[0]
    if(cmd==="status"){
        for(k in services){
            console.log(`${k} is ${services[k].status?'running':'not running'}`)
        }
        return;
    }
    if(line.split(" ").length<2){
        console.log("INVALID FORMAT")
        return
    }
    const arg = line.split(" ")[1]
    const service = services[arg]
    if(service===undefined){
        console.log("Target not found!")
        return;
    }
    switch (cmd){
        case 'start':
            if(!service.status){
                service.start()
                services[arg].status = true
                console.log(`${arg} started`)
            }
            else{
                console.log(`${arg} is working`)
            }
            break
        case 'stop':
            if(service.status){
                service.stop()
                services[arg].status = false
                console.log(`${arg} stoped`)
            }
            else{
                console.log(`${arg} is not working`)
            }
            break
        case 'restart':
            if(service.status){
                service.stop()
                service.start()
                services[arg].status = true
                console.log(`${arg} re-started`)
            }
            else{
                console.log(`${arg} is not working`)
            }
            break
        default:
            console.log("unknown command")
            break

    }
})