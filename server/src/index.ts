import main, { state } from './crawler/main.js'
import WebSocket, { WebSocketServer } from 'ws'
import dotenv from 'dotenv'
dotenv.config()

async function index() {
	const generator = main()
	while (true) {
		await generator.next()
		broadcast(JSON.stringify({ event: 'state', state }))
	}
}
index()

const wss = new WebSocketServer({
	port: parseInt(process.env.WEBSOCKET_SERVER_PORT ?? ''),
})

wss.on('listening', () => {
	console.log(`Listening on port ${wss.options.port}`)
})

wss.on('connection', function connection(ws) {
	ws.send(JSON.stringify({ event: 'state', state }))
})

function broadcast(message: string) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message)
		}
	})
}
