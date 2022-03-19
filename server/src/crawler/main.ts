import itranviasApi from './itranviasApi.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as stateTypes from '../../../stateTypes.js'

const __filename = fileURLToPath(import.meta.url)
globalThis.__dirname = path.dirname(__filename)
const STATE_FILE_PATH = path.resolve(__dirname, '..', '..', 'state.json')

function saveStateJson() {
	state.lastUpdateTs = Date.now()
	fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state), 'utf-8')
}

export let state: stateTypes.State = null
if (fs.existsSync(STATE_FILE_PATH)) {
	state = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'))
}

export default async function* main() {
	while (true) {
		const baseInfo = await itranviasApi.getBaseInfo()
		state.lines = baseInfo.lines
		state.stops = baseInfo.stops
		saveStateJson()
		yield

		yield* await Promise.all(
			baseInfo.lines.map((line) =>
				itranviasApi.getLineBuses(line.id).then((lineBuses) => {
					state.buses = [
						...state.buses.filter((bus) => bus.lineId !== line.id),
						...lineBuses,
					]
					saveStateJson()
					return
				})
			)
		)
	}
}