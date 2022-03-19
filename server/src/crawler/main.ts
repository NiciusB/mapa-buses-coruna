import itranviasApi from './itranviasApi.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
globalThis.__dirname = path.dirname(__filename)
const STATE_FILE_PATH = path.resolve(__dirname, '..', '..', 'state.json')

function saveStateJson() {
	state.lastUpdateTs = Date.now()
	fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state), 'utf-8')
}

export let state: StateTypes.State
if (fs.existsSync(STATE_FILE_PATH)) {
	state = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'))
} else {
	state = {
		lastUpdateTs: Date.now(),
		buses: [],
		lines: [],
		stops: [],
	}
}

export default async function* main() {
	while (true) {
		const baseInfo = await itranviasApi.getBaseInfo()
		state.lines.forEach((oldLine) => {
			if (!baseInfo.lines.some((newLine) => newLine.id === oldLine.id)) {
				// If a line disappears, delete all buses to avoid them getting stuck forever
				state.buses = state.buses.filter((bus) => bus.lineId !== oldLine.id)
			}
		})
		state.lines = baseInfo.lines
		state.stops = baseInfo.stops
		saveStateJson()
		yield

		const lineBusPromises = baseInfo.lines.map((line) =>
			itranviasApi.getLineBuses(line.id).then((lineBuses) => {
				state.buses = [
					...state.buses.filter((bus) => bus.lineId !== line.id),
					...lineBuses,
				]
				saveStateJson()
			})
		)

		for (const promise of lineBusPromises) {
			await promise
			yield
		}
	}
}
