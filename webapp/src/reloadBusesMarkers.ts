import * as stateTypes from '../../stateTypes.js'
import bulkLoadAssets from './bulkLoadAssets.js'
import busIconPng from '../assets/bus-icon.png'
import tintIcon from './tintIcon'
import L from 'leaflet'
import escapeHTML from './escapeHTML.js'

const busesMarkers: L.Marker[] = []
export default async function reloadBusesMarkers(
	map: L.Map,
	state: stateTypes.State
) {
	const [busIconImage] = await bulkLoadAssets([busIconPng])

	busesMarkers.forEach((marker) => {
		marker.remove()
	})

	state.buses.forEach((bus) => {
		const line = state.lines.find((line) => line.id === bus.lineId)!
		const stop = state.stops.find((stop) => stop.id === bus.stopId)!

		const busIcon = L.icon({
			iconUrl: tintIcon(busIconImage, line.color),
			iconSize: [18, 18],
			shadowUrl: tintIcon(busIconImage, '#333'),
			shadowSize: [20, 20],
		})
		const marker = L.marker([stop.y, stop.x], { icon: busIcon })
			.addTo(map)
			.bindTooltip(
				`Bus ${escapeHTML(bus.busId + '')}<br>${escapeHTML(
					stop.name
				)}<br>Distancia ${Math.round(bus.distance * 1000)}m`
			)

		busesMarkers.push(marker)
	})
}
