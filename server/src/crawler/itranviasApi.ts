import { queryItrV3 } from './itranviasApiBase.js'
import * as stateTypes from '../../../stateTypes.js'

async function getBaseInfo() {
	return queryItrV3({
		dato: '20160101T000000_gl_0_20160101T000000',
		func: '7',
	}).then((res: any) => {
		const root: {
			lineas: {
				id: number
				lin_comer: string
				nombre_orig: string
				nombre_dest: string
				color: string
				rutas: { ruta: number; paradas: number[] }[]
			}[]
			paradas: {
				id: number
				nombre: string
				posx: number
				posy: number
				enlaces: number[]
			}[]
		} = res.iTranvias.actualizacion

		const lines: stateTypes.Line[] = root.lineas.map((apiLine) => {
			const line: stateTypes.Line = {
				id: apiLine.id,
				name: apiLine.lin_comer,
				originName: apiLine.nombre_orig,
				destinationName: apiLine.nombre_dest,
				color: '#' + apiLine.color,
				routes: apiLine.rutas.map((apiRoute) => {
					return {
						lineId: apiLine.id,
						id: apiRoute.ruta,
						stopIds: apiRoute.paradas,
					}
				}),
			}

			return line
		})

		const stops: stateTypes.Stop[] = root.paradas.map((parada) => {
			return {
				id: parada.id,
				name: parada.nombre,
				x: parada.posx,
				y: parada.posy,
			}
		})

		return { lines, stops }
	})
}

async function getLineBuses(
	lineId: number
): Promise<stateTypes.LineRouteBus[]> {
	return queryItrV3({
		dato: lineId,
		func: '2',
	}).then((res: any) => {
		const root: {
			sentido: string
			paradas?: {
				parada: number
				buses: { bus: number; distancia: number; estado: number }[]
			}[]
		}[] = res.paradas

		return root
			.map(({ sentido, paradas }) => {
				return (
					paradas?.map((parada) => {
						return parada.buses.map((bus) => {
							let status: stateTypes.BusStatus
							switch (bus.estado) {
								case 0:
									status = stateTypes.BusStatus.s0
									break
								case 1:
									status = stateTypes.BusStatus.s1
									break
								case 16:
									status = stateTypes.BusStatus.s16
									break
								case 17:
									status = stateTypes.BusStatus.s17
									break
								default:
									throw new Error('Unknown bus status: ' + bus.estado)
							}

							return {
								busId: bus.bus,
								lineId,
								stopId: parada.parada,
								distance: bus.distancia,
								status,
								direction: parseInt(sentido, 10),
							}
						})
					}) ?? []
				)
			})
			.flat(2)
	})
}

const itranviasApi = {
	getBaseInfo,
	getLineBuses,
}

export default itranviasApi
