export default async function bulkLoadAssets(images: string[]) {
	var promises: Promise<HTMLImageElement>[] = []

	images.forEach((image) => {
		promises.push(
			new Promise((resolve, reject) => {
				const img = new Image()
				img.addEventListener('load', function () {
					resolve(img)
				})
				img.addEventListener('error', function (error) {
					reject(error)
				})
				img.src = image
			})
		)
	})

	return await Promise.all(promises)
}
