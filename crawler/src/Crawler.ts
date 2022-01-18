export enum BusStatus {
	s0,
	s1,
	s16,
	s17,
}

export interface Line {
	id: number
	name: string
	originName: string
	destinationName: string
	color: string
	routes: LineRoute[]
}

export interface LineRoute {
	lineId: number
	id: number
	stopIds: number[]
}

export interface LineRouteBus {
	lineId: number
	lineRouteId: number
	distance: number
	status: BusStatus
	direction: number
}

export interface Stops {
	id: number
	name: string
	x: number
	y: number
}
