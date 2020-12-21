// В этом файле создаём экземпляры классов Canvas и Bezier.

/*
	Экземпляр класса Application. Принимает в качестве параметра объект класса
	Canvas, с которым будем работать.
*/
const app = new Application({
	// Элемент с канвасом для поиска через CSS-выражение.
	el: 'canvas',
	// Цвет фона канваса.
	background: '#d2d2d2',
})

// Экземпляр кривой Безье.
const bezier = new Bezier({
	// Точность подсчёта кривой Безье (шаг).
	step: 0.001,
	// Показать контрольные линии.
	showCtrlLines: true,
	// Показать контрольные точки.
	showCtrlPoints: true,
	// Количество узлов и их местоположение.
	nodes: [
		new Point(200, 450),
		new Point(200, 200),
		new Point(500, 150),
		new Point(550, 350),
		// new Point(500, 550),
		// new Point(200, 500),
		// new Point(200, 250),
	],
	// Цвета контрольных точек 1-го, 2-го, 3-го и т.д. уровней.
	colors: ['red', 'green', 'blue', 'pink'],
	// Флаг - есть ли анимация.
	animation: true,
})

// Если в localStorage есть сохранённая конфигурация приложения:
if (localStorage.getItem('__bezier__')) {
	// Сохранённые параметры приложения.
	const params = JSON.parse(localStorage.getItem('__bezier__'))

	// Если были сохранены параметры камеры:
	if (params.camera) {
		// Изменить текущие параметры приложения на сохранённые.
		Object.assign(app.camera, params.camera)
	}

	// Если были сохранены точки кривой Безье:
	if (params.nodes) {
		// Удалить все точки кривой Безье.
		bezier.nodes = []

		// Пройти по всем сохранённым точкам кривой Безье.
		bezier.add(...params.nodes.map(node => new Point(node.x, node.y)))
	}

	// Если были сохранены параметры анимации:
	if (params.hasOwnProperty('animation')) {
		bezier.animation = params.animation
	}
}

// Подписаться на события приложения.
app.subscribe(() => {
	// Параметры приложения, которые нужно сохранить.
	const params = {
		// Наличие анимации.
		animation: bezier.animation,
		camera: {
			offsetX: app.camera.offsetX,
			offsetY: app.camera.offsetY,
			scale: app.camera.scale,
		},
		// Узлы кривой Безье.
		nodes: bezier.nodes.map((node) => ({ x: node.x, y: node.y })),
	}

	// При изменении параметров приложения сохранить конфигурацию.
	localStorage.setItem('__bezier__', JSON.stringify(params))
})

/*
	Добавить в массив элементов, которые хотим отрисовывать,
	экземпляр класса Безье.
*/
app.add(bezier)

// Инициализировать графический интерфейс для изменения кривой Безье.
guiInit()

// /*
// 	Добавить функцию-обработчик для анимирования кривой Безье в массив
// 	функций-обработчиков элемента класса, который обеспечивает базовую анимацию.
// */
// app.tickHandlers.push(() => {

// })

// Узел кривой Безье, на который кликнули.
let pointUnderMouse = null

/*
	Добавить функцию-обработчик в массив функций-обработчиков элемента класса,
	который обеспечивает базовую анимацию.
*/
app.tickHandlers.push(() => {
	/*
		Если мышь находится над элементом, над которым прослушиваем события
		мыши, отображаются контрольные точки кривой Безье и на одной из этих
		точек кликнули:
	*/
	if (app.mouse.over && app.mouse.click && bezier.showCtrlPoints) {
		/*
			Найти узел кривой Безье
			с учётом смещения и масштабирования контекста канваса.
		*/
		pointUnderMouse = bezier.getPointUnder(
			(app.mouse.x -  app.camera.offsetX) / app.camera.scale,
			(app.mouse.y -  app.camera.offsetY) / app.camera.scale
		)
	}

	// Если всё ещё не нашли точку с узлом кривой Безье, но прожата ЛКМ:
	if (!pointUnderMouse && app.mouse.left) {
		// Двигать саму камеру вслед за указателем мыши!
		app.camera.offsetX += app.mouse.dX
		app.camera.offsetY += app.mouse.dY
	}

	// Если ЛКМ отпущена:
	if (!app.mouse.left) {
		/*
		Теперь нет узла кривой Безье, на который кликнули
		(если до этого передвигали узел, то теперь не передвигаем).
	*/
		pointUnderMouse = null
	}

	/*
		Если есть узел кривой Безье на который кликнули
		и при этом мышь находится над экземпляром канваса:
	*/
	if (app.mouse.over && pointUnderMouse) {
		/*
			Этот узел кривой Безье начинает преследовать указатель мыши
			с учётом смещения и масштабирования контекста канваса.
		*/
		pointUnderMouse.x = (app.mouse.x - app.camera.offsetX) / app.camera.scale
		pointUnderMouse.y = (app.mouse.y - app.camera.offsetY) / app.camera.scale
	}
})

/*
	Функция инициализирует графический интерфейс dat.GUI
	для изменения переменных JS.
*/
function guiInit () {
	// Объект графического интерфейса dat.GUI для изменения переменных JS.
	const gui = new dat.GUI()

	// Добавить категорию "Анимация" к отслеживанию объектом dat.GUI.
	const controller = gui.addFolder('Controller')
	// Указать, где следим, за чем следим.
	controller.add(bezier, 'animation').listen()
	controller.open()

	// Добавить категорию "Камера" к отслеживанию объектом dat.GUI.
	const cameraFolder = gui.addFolder('Camera')
	// Указать, где следим, за чем следим.
	cameraFolder.add(app.camera, 'offsetX').listen()
	cameraFolder.add(app.camera, 'offsetY').listen()
	cameraFolder.add(app.camera, 'scale', 0.4, 20).listen()
	cameraFolder.open()

	// const messages = {
	// 	deleteLabel: "Удалить точку"
	// }

	// Пройти по всем узлам кривой Безье.
	bezier.nodes.forEach((node, i) => {
		// Добавить категории "Узлы кривой Безье" к отслеживанию объектом dat.GUI.
		const folder = gui.addFolder(`Node ${i}`)
		// Указать, где следим, за чем следим.
		folder.add(node, 'x').listen()
		folder.add(node, 'y').listen()
		// Развернуть элементы панели графического интерфейса.
		folder.open()
	})
}

/*
	Добавить функцию-обработчик в массив функций-обработчиков элемента класса,
	который обеспечивает базовую анимацию.
*/
// app.tickHandlers.push(() => {
// 	// Модальное окно с настройками кривой Безье.
// 	const modal = document.querySelector('#modal')

// 	const table = document.createElement('table')
// 	// Создать по строке таблицы для каждого узла кривой Безье.
// 	for (const node of bezier.nodes) {
// 		const tr = document.createElement('tr')
// 		table.append(tr)

// 		tr.innerHTML = `
// 			<td>${node.x}</td>
// 			<td>${node.y}</td>
// 		`
// 	}

// 	modal.innerHTML = ''
// 	modal.append(table)
// })