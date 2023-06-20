import { io } from "socket.io-client";
const socketHost = 'http://127.0.0.1:3000/'

const socketIo = io(socketHost, {
  path: '', // 如果地址是wss path:"/wss"
  transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
  autoConnect: true,   // 自动连接     
})
export default socketIo