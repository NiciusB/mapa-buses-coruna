import itranviasApi from './itranviasApi.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
globalThis.__dirname = path.dirname(__filename)

const stateFilePath = path.resolve(__dirname, '..', 'state.json')

async function main() {
	console.log('Starting...')

	const baseInfo = await itranviasApi.getBaseInfo()

	console.log(`Loading ${baseInfo.lines.length} lines...`)

	const buses = await Promise.all(
		baseInfo.lines.map((line) => {
			return itranviasApi.getLineBuses(line.id).finally(() => {
				console.debug(`Line ${line.id} done!`)
			})
		})
	)

	const fileStr = JSON.stringify({
		lines: baseInfo.lines,
		stops: baseInfo.stops,
		buses: buses,
	})

	fs.writeFileSync(stateFilePath, fileStr)
}
main()
