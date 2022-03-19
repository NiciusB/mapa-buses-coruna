interface RGB {
	r: number
	g: number
	b: number
}

export function hexToRgb(hex: string): RGB {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b
	})

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

	if (!result) {
		throw new Error(`Invalid hex ${hex}`)
	}

	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	}
}

export function rgbToHex(rgb: RGB): string {
	return (
		'#' +
		Math.round(rgb.r).toString(16).padStart(2, '0') +
		Math.round(rgb.g).toString(16).padStart(2, '0') +
		Math.round(rgb.b).toString(16).padStart(2, '0')
	)
}

export function mergeColors(colors: string[] | RGB[]) {
	const total = colors
		.map((color) => {
			if (typeof color === 'string') {
				color = hexToRgb(color)
			}
			return color
		})
		.reduce(
			(prev, curr) => ({
				r: prev.r + curr.r,
				g: prev.g + curr.g,
				b: prev.b + curr.b,
			}),
			{ r: 0, g: 0, b: 0 }
		)

	return {
		r: total.r / colors.length,
		g: total.g / colors.length,
		b: total.b / colors.length,
	}
}
