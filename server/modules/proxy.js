const httpProxy = require('http-proxy');
const http = require('http')
const proxy = httpProxy.createProxyServer({});
const resolve = (req)=>{
    const name = req.url.split('/')[1] ? "/" + req.url.split('/')[1] : "/"
    let url = req.url
    return new Promise((resolve)=>{
        if(name==="/beacon"){
            url = "/" + req.url.replace(`${name}`, '')
            resolve({url:url,address:"ws://localhost:3101"})
        }
        else if(name==="/generateKeyPair"){
            resolve({url:url,address:"ws://localhost:3100"})
        }
        else{
            resolve({url:url,address:"http://localhost:3100"})
        }
    })
}
proxy.on('error', (err,req,res)=>{
    console.log(err)
    //res.writeHeader(500, {"Content-Type": "text/html"});
    res.writeHead(500, {"Content-Type": "text/html"})
    res.end("<h1>BŁĄD</h1>")
})

const httpListen =  (req, res) => {
    resolve(req).then((data)=>{
        req.url=data.url
        try {
            res.setHeader('Service', 'e-buda transfer')
            proxy.web(req, res, {target: data.address});
        }
        catch (e) {
            console.log(e)
        }
    })
}
const wsListen = (req, socket, head) => {
    if(req.url!==undefined){
        resolve(req).then((data)=>{
            req.url=data.url
            proxy.ws(req, socket, {secure:false, target: data.address});
        })
    }
}

const httpserver = http.createServer(httpListen);

httpserver.on('upgrade', wsListen);

const startProxy = ()=>{
    httpserver.listen(3003,()=>{
        console.log("Proxy ready on: 3003")
    })
}
const stopProxy = ()=>{
    httpserver.close()
}

module.exports=  {startProxy, stopProxy}