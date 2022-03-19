import '../assets/style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { connectToServer } from './serverWs'
import reloadBusesMarkers from './reloadBusesMarkers'
import reloadStopsMarkers from './reloadStopsMarkers'

function main() {
	let map: L.Map | null = null
	connectToServer(async (state) => {
		if (map === null) {
			map = await setupMap(state)
		}

		reloadBusesMarkers(map, state)
		reloadStopsMarkers(map, state)
	})
}
main()

async function setupMap(state: StateTypes.State) {
	const app = document.querySelector<HTMLDivElement>('#app')!

	const stopsCoordinatesAverage = {
		x:
			state.stops.map((stop) => stop.x).reduce((prev, curr) => prev + curr, 0) /
			state.stops.length,
		y:
			state.stops.map((stop) => stop.y).reduce((prev, curr) => prev + curr, 0) /
			state.stops.length,
	}
	var map = L.map(app, {
		center: [stopsCoordinatesAverage.y, stopsCoordinatesAverage.x],
		zoom: 14,
	})

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map)

	return map
}
