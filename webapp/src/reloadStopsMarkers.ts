import * as stateTypes from '../../stateTypes.js'
import L from 'leaflet'
import escapeHTML from './escapeHTML.js'
import { mergeColors, rgbToHex } from './colorUtils.js'

const stopsMarkers: L.Circle[] = []
export default async function reloadStopsMarkers(
	map: L.Map,
	state: stateTypes.State
) {
	stopsMarkers.forEach((marker) => {
		marker.remove()
	})

	state.stops.forEach((stop) => {
		const lines = state.lines.filter((line) =>
			line.routes.some((route) => route.stopIds.includes(stop.id))
		)

		if (!lines.length) {
			return
		}

		const marker = L.circle([stop.y, stop.x], {
			radius: 10,
			color: rgbToHex(mergeColors(lines.map((line) => line.color))),
		})
			.addTo(map)
			.bindTooltip(
				`${escapeHTML(stop.name)}<br>Líneas: ${lines
					.map((line) => escapeHTML(line.name))
					.join(', ')}`
			)

		stopsMarkers.push(marker)
	})
}
