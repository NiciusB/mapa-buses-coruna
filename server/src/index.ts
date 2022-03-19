import main, { state } from './crawler/main.js'
import { WebSocketServer } from 'ws'
import dotenv from 'dotenv'
dotenv.config()

async function index() {
	const generator = main()
	while (true) {
		await generator.next()
		wss.clients.forEach((client) =>
			client.send(JSON.stringify({ event: 'state', state }))
		)
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
