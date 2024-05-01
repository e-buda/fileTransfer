const WebSocket = require('ws');
import {legacyOnline} from "../legacy/legacy"
import Identity from "./identity";
const identity = new Identity()
class Online {
  constructor() {
    if (!Online.instance) {
      this.ws = null;
      this.connected = false;
      Online.instance = this;
    }

    return Online.instance;
  }

  connect(url) {
    if (!this.ws) {
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        console.log('Connected to WebSocket server');
        this.connected = true;
        this.send(JSON.stringify({cmd:'connect',identity:identity.getIdentity()}))
      });

      this.ws.on('message', (event) => {
        legacyOnline(event,this.ws)
      });

      this.ws.on('close', () => {
        console.log('Disconnected from WebSocket server');
        this.connected = false;
        this.ws = null;
      });
    } else {
      console.log('Already connected to WebSocket server');
    }
  }

  send(message) {
    if (this.connected) {
      this.ws.send(message);
    } else {
      console.log('Not connected to WebSocket server');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    } else {
      console.log('Not connected to WebSocket server');
    }
  }
}

const instance = new Online();

// Aby użyć singletona Online:
// instance.connect('ws://localhost:3000');
// instance.send('Hello server');
// instance.disconnect();
export default instance
