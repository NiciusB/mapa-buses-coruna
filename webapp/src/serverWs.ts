const VITE_WEBSOCKET_SERVER_URI: string = import.meta.env
	.VITE_WEBSOCKET_SERVER_URI as string

export function connectToServer(
	stateCallback: (state: StateTypes.State) => any
) {
	function connect() {
		const ws = new WebSocket(VITE_WEBSOCKET_SERVER_URI)

		ws.onmessage = ({ data }) => {
			data = JSON.parse(data)
			if (data.event === 'state') {
				stateCallback(data.state)
			}
		}

		ws.onclose = function (e) {
			console.log(
				'Socket is closed. Reconnect will be attempted in 5 seconds.',
				e.reason
			)
			setTimeout(() => connect(), 5000)
		}

		ws.onerror = function (err) {
			console.error('Socket encountered error. Closing socket', err)
			ws.close()
		}
	}

	connect()
}
