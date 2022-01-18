import fetch from 'node-fetch'

const queue: {
	params: Object
	resolve: (value: any) => any
	reject: (value: any) => any
}[] = []

function consumeQueue() {
	if (queue.length === 0) {
		return
	}

	const item = queue.shift()

	_queryItrV3(item.params).catch(item.reject).then(item.resolve)
}

setInterval(consumeQueue, 15000)

function _queryItrV3(params: Object) {
	params = {
		...params,
		_: Date.now(),
	}
	const querystr = new URLSearchParams(params as URLSearchParams).toString()

	return fetch('https://itranvias.com/queryitr_v3.php?' + querystr, {
		method: 'GET',
		headers: {
			'User-Agent': 'MapaBusesCoruña/1.0',
		},
	}).then(async (res) => {
		const body = (await res.arrayBuffer().then(Buffer.from)).toString()

		try {
			return JSON.parse(body)
		} catch (error) {
			throw new Error(error.message + '\n\n' + body)
		}
	})
}

export function queryItrV3(params: Object) {
	return new Promise((resolve, reject) => {
		queue.push({ params, resolve, reject })
	})
}
