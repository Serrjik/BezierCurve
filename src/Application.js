/*
	Класс конкатенирует в себе возможности канваса и
	обеспечивает базовую анимацию.
*/
class Application extends Observer {
	constructor(params) {
		super()

		// Объект класса Canvas, с которым будем работать.
		this.canvas = new Canvas({
			// Элемент с канвасом для поиска через CSS-выражение.
			el: 'canvas',
			// Размеры канваса.
			width: 500,
			height: 500,
			// Цвет фона канваса.
			background: '#d2d2d2',
		})

		// Экземпляр класса Mouse для слежения за событиями мыши.
		this.mouse = new Mouse(this.canvas.el)
		// Экземпляр класса Camera
		this.camera = new Camera()

		// Подписаться на изменения камеры.
		this.camera.subscribe(() => this.dispatch())

		// Время предыдущего обновления экрана.
		this.pTimestamp = 0

		// Массив элементов, которые хотим отрисовывать.
		this.container = []
		/*
			Массив функций, которые обрабатывают координаты или делают
			что-то ещё, связанное с анимацией.
		*/
		this.tickHandlers = []

		// Установить размеры элемента канваса равными текущим размерам окна.
		this.resize()
		// Повесить обработчик изменения размеров страницы на окно.
		window.addEventListener('resize', () => this.resize())

		requestAnimationFrame(x => this.tick(x))
	}

	// Метод добавляет элементы в массив элементов, которые хотим отрисовывать.
	add(...items) {
		// Пройти по всем добавляемым элементам.
		for (const item of items) {
			// Если добавляемый элемент ещё отсутствует в контейнере:
			if (!this.container.includes(item)) {
				// Положить элемент в контейнер.
				this.container.push(item)


				// Если элемент является экземпляром класса Observer:
				if (item instanceof Observer) {
					// Подписаться на прослушивание изменений элемента.
					item.subscribe(() => {
						this.dispatch()
					})
				}
			}
		}
	}

	// Метод обновляет экран.
	tick (timestamp) {
		requestAnimationFrame(x => this.tick(x))

		/*
			Сделать так, чтобы при масштабировании контекста канваса
			точка под указателем мыши оставалась неподвижной.
		*/
		// Если мышь над экземпляром канваса и произошла прокрутка колёсика:
		if (this.mouse.over && this.mouse.delta) {
			// Координаты мыши относительно абсолютных координат.
			const x = (app.mouse.x - app.camera.offsetX) / app.camera.scale
			const y = (app.mouse.y - app.camera.offsetY) / app.camera.scale

			// Установить масштаб.
			this.camera.scale += this.mouse.delta * this.camera.scaleStep
			this.camera.scale = Math.max(0.4, this.camera.scale)

			// Смещение экземпляра канваса.
			app.camera.offsetX = - x * app.camera.scale + app.mouse.x
			app.camera.offsetY = - y * app.camera.scale + app.mouse.y
		}

		// Время существования текущего изображения между обновлениями экрана.
		const diff = timestamp - this.pTimestamp
		// Какую часть секунды существует изображение между обновлениями экрана.
		const secondPart = diff / 1000
		// Количество обновлений экрана в секунду.
		const fps = Math.round(1000 / diff)

		// Изменим время предыдущего обновления экрана на текущее время.
		this.pTimestamp = timestamp

		// Пройти по всем функциям массива tickHandlers.
		for (const tickHandler of this.tickHandlers) {
			/*
				Вызвать выбранную функцию, чтобы изменить состояния элементов
				в контейнере container.
			*/
			tickHandler({
				timestamp,
				diff,
				secondPart,
				fps,
			})
		}

		// Пройти по каждому элементу из тех, которые хотим отрисовывать.
		for (const item of this.container) {
			// Вызвать для элемента функции tickHandler, которые пришли извне.
			item.tick({
				timestamp,
				diff,
				secondPart,
				fps,
			})
		}

		// Очистить канвас.
		this.canvas.clear()

		// Отрисовка неподвижной сетки на заднем плане.
		this.canvas.drawGrid({
			// Смещения относительно верхнего левого угла.
			offsetX: this.camera.offsetX % (75 * this.camera.scale),
			offsetY: this.camera.offsetY % (75 * this.camera.scale),
			// Размер ячейки.
			cellSize: 75 * this.camera.scale,
			// Толщина линий сетки.
			lineWidth: 0.5,
			// Цвет линий сетки.
			strokeStyle: 'green',
		})

		// Сохранить состояние канваса.
		this.canvas.save()
		// Сместить контекст канваса.
		this.canvas.translate(this.camera.offsetX, this.camera.offsetY)
		// Отмасштабировать контекст канваса.
		this.canvas.scale(this.camera.scale)

		// Пройти по массиву элементов, которые хотим отрисовывать.
		for (const item of this.container) {
			// Отрисовать выбранный элемент на переданном канвасе.
			item.draw(this.canvas)
		}

		// Восстановить сохранённое состояние канваса.
		this.canvas.restore()

		// Запомнить состояние прожатия ЛКМ.
		this.mouse.tick()
	}

	// Метод изменяет размеры канваса.
	resize () {
		// Установить размеры элемента канваса равными текущим размерам окна.
		this.canvas.el.width = window.innerWidth
		this.canvas.el.height = window.innerHeight
	}
}