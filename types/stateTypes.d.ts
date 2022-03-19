declare namespace StateTypes {
	type BusStatus = 's0' | 's1' | 's16' | 's17'

	interface Line {
		id: number
		name: string
		originName: string
		destinationName: string
		color: string
		routes: LineRoute[]
	}

	interface LineRoute {
		lineId: number
		id: number
		stopIds: number[]
	}

	interface LineRouteBus {
		busId: number
		lineId: number
		stopId: number
		distance: number
		status: BusStatus
		direction: number
	}

	interface Stop {
		id: number
		name: string
		x: number
		y: number
	}

	interface State {
		lastUpdateTs: number
		lines: Line[]
		stops: Stop[]
		buses: LineRouteBus[]
	}
}
