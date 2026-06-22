document.querySelectorAll('.accordion-header').forEach(header => {
	header.addEventListener('click', () => {
		const item = header.parentElement;
		item.classList.toggle('open');
	});
});

if (window.ymaps && document.getElementById('map')) {
	ymaps.ready(() => {
		const coords = [51.830841, 107.592991];
		const map = new ymaps.Map('map', {
			center: coords,
			zoom: 17,
			type: 'yandex#hybrid',
			controls: ['zoomControl', 'fullscreenControl']
		});
		const placemark = new ymaps.Placemark(coords, {
			balloonContentHeader: 'Детективное агентство «Розыск»',
			balloonContentBody: 'Улан-Удэ, ул. Борсоева, 7А, офис 200',
			balloonContentFooter: 'Пн–Пт 10:00–19:00, по записи',
			hintContent: 'Детективное агентство «Розыск»'
		}, { preset: 'islands#redDotIcon' });
		map.geoObjects.add(placemark);
		placemark.balloon.open();
		map.behaviors.disable('scrollZoom');
	});
}
