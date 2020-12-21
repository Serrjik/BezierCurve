/*
	Класс для работы с канвасом.
	Содержит методы для отрисовки кругов, прямых линий.
*/
class Canvas {
	constructor (param) {
		// Элемент с канвасом.
		this.el = document.querySelector(param.el)
		// Контекст элемента с канвасом.
		this.context = this.el.getContext('2d')
		// Размеры канваса.
		this.el.width = param.width
		this.el.height = param.height
		// Цвет фона канваса.
		this.background = param.background

		// Очищаем канвас при инициализации.
		this.clear()
	}

	// Метод очищает канвас.
	clear () {
		const { context } = this

		context.beginPath()
		context.fillStyle = this.background
		context.rect(0, 0, this.el.width, this.el.height)
		context.fill()
	}

	// Метод отрисовывает круг по переданным параметрам.
	drawCircle (param) {
		const { context } = this

		context.beginPath()
		context.arc(param.x, param.y, param.r, 0, 2 * Math.PI)

		// Если передан цвет заливки:
		if (param.fillStyle) {
			context.fillStyle = param.fillStyle
			context.fill()
		}

		// Если передан цвет обводки:
		if (param.strokeStyle) {
			context.strokeStyle = param.strokeStyle
			context.stroke()
		}
	}

	// Метод отрисовывает прямую линию по переданным параметрам.
	drawLine (param) {
		const { context } = this

		context.beginPath()
		context.moveTo(param.x1, param.y1)
		context.lineTo(param.x2, param.y2)

		context.lineWidth = param.lineWidth ?? 1

		// Если передан цвет обводки:
		if (param.strokeStyle) {
			context.strokeStyle = param.strokeStyle
			context.stroke()
		}
	}

	/*
		Метод отрисовывает неподвижную сетку на заднем плане. Принимает объект
		со смещением сетки относительно верхнего левого угла, размерами ячейки
		сетки, толщина линий сетки, цвет линий сетки.
	*/
	drawGrid (param) {
		this.context.strokeStyle = param.strokeStyle
		this.context.lineWidth = param.lineWidth

		// Отрисовать вертикальные линии сетки.
		for (let i = 0; i < this.el.width / param.cellSize; i++) {
			this.context.beginPath()
			this.context.moveTo(param.offsetX + i * param.cellSize, 0)
			this.context.lineTo(param.offsetX + i * param.cellSize, this.el.height)
			this.context.stroke()
		}

		// Отрисовать горизонтальные линии сетки.
		for (let i = 0; i < this.el.height / param.cellSize; i++) {
			this.context.beginPath()
			this.context.moveTo(0, param.offsetY + i * param.cellSize)
			this.context.lineTo(this.el.width, param.offsetY + i * param.cellSize)
			this.context.stroke()
		}
	}

	// Метод сохраняет состояние канваса.
	save () {
		this.context.save()
	}

	// Метод восстанавливает сохранённое состояние канваса.
	restore () {
		this.context.restore()
	}

	/*
		Метод смещает канвас относительно верхнего левого угла
		на переданное расстояние.
	*/
	translate (x, y) {
		this.context.translate(x, y)
	}

	// Метод масштабирует контекст канваса согласно переданному масштабу.
	scale (s) {
		this.context.scale(s, s)
	}
}