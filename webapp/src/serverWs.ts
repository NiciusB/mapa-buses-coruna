import * as stateTypes from '../../stateTypes.js'

const VITE_WEBSOCKET_SERVER_URI: string = import.meta.env
	.VITE_WEBSOCKET_SERVER_URI as string

export function connectToServer(
	stateCallback: (state: stateTypes.State) => any
) {
	const ws = new WebSocket(VITE_WEBSOCKET_SERVER_URI)

	ws.onmessage = ({ data }) => {
		data = JSON.parse(data)
		if (data.event === 'state') {
			stateCallback(data.state)
		}
	}
}
