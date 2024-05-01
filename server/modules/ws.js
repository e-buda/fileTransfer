const WebSocket = require('ws');

let server = null;
let clients = [];

const startWebSocket = () => {
    server = new WebSocket.Server({ port:3101 });

    server.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            const obj = JSON.parse(message)
            const cmd = obj.cmd
            switch (cmd){
                case 'connect':
                    ws.identity=obj.identity
                    clients.push(ws);
                    break
                case 'transmit':
                    if(!ws.identity){
                        return
                    }
                    let sended = false
                    clients.forEach((client)=>{
                        console.log(obj.to,client.identity)
                        if(client.identity===obj.to){
                            client.send(JSON.stringify({...obj.data,from:ws.identity}))
                            sended=true
                        }
                    })
                    if(!sended){
                        ws.send(JSON.stringify({error:"Destination unreachable"}))
                    }

            }
        });

        ws.on('close', () => {
            clients = clients.filter((client) => client !== ws);
            console.log('Client disconnected');
        });
    });

    console.log(`WebSocket server started on port ${3101}`);
};

const stopWebSocket = () => {
    if (server) {
        server.close(() => {
            console.log('WebSocket server stopped');
        });

        clients.forEach((client) => {
            client.terminate();
        });

        server = null;
        clients = [];
    } else {
        console.log('WebSocket server is not running');
    }
};

module.exports=  {startWebSocket,stopWebSocket}