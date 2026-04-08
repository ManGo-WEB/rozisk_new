document.querySelectorAll('.menu a').forEach(item => {
	item.addEventListener('click', () => {
		document.getElementById('menu-toggle').checked = false;
	});
});



function submitInput() {
	const inputValue = inputField.value;
	message.textContent = `Успешно отправлено: ${inputValue}`;
	inputField.value = '';
}

document.querySelectorAll('.accordion-header').forEach(header => {
	header.addEventListener('click', () => {
		const item = header.parentElement;
		item.classList.toggle('open');
	});
});

