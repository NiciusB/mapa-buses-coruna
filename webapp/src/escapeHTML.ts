export default function escapeHTML(unsafeText: string): string {
	let div = document.createElement('div')
	div.innerText = unsafeText
	return div.innerHTML
}
