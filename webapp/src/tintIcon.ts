export default function tintIcon(
	baseIcon: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
	color: string
): string {
	const canvas = document.createElement('canvas')
	canvas.width = baseIcon.width
	canvas.height = baseIcon.height
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Error while creating canvas')
	}

	ctx.drawImage(baseIcon, 0, 0)

	ctx.globalCompositeOperation = 'source-in'

	ctx.globalAlpha = 1

	ctx.fillStyle = color
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	return canvas.toDataURL()
}
