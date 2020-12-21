/*
	Класс Mouse для слежения за событиями мыши над элементами
	и выдачи координат мыши.
*/
class Mouse {
	/*
		Конструктор принимает элемент,
		над которым класс будет прослушивать события мыши.
	*/
	constructor (el) {
		// Текущие координаты мыши.
		this.x = 0
		this.y = 0

		// Координаты мыши в предыдущем tick'е.
		this.pX = 0
		this.pY = 0

		// Смещения мыши между tick'ами.
		this.dX = 0
		this.dY = 0

		// Текущая дельта скролла колёсика мыши.
		this.cDelta = 0
		// Предыдущая дельта скролла колёсика мыши.
		this.pDelta = 0
		// Разность текущей и предыдущей дельт скролла колёсика мыши.
		this.delta = 0

		// Прожата ли ЛКМ.
		this.left = false
		// Была ли прожата ЛКМ в прошлом обновлении экрана.
		this.pLeft = false

		/*
			Находится ли мышь над элементом,
			над которым класс прослушивает события.
		*/
		this.over = false
		this.el = el
		// Произошёл ли клик ЛКМ.
		this.click = false
		// Флаг - первый ли раз вызывается функция tick?
		this.firstTick = true

		/*
			Повесить обработчик события mouseenter на элемент,
			над которым прослушиваем события.
		*/
		this.el.addEventListener('mouseenter', e => this.mouseenterHandler(e))

		/*
			Повесить обработчик события mouseout на элемент,
			над которым прослушиваем события.
		*/
		this.el.addEventListener('mouseout', e => this.mouseoutHandler(e))

		/*
			Повесить обработчик события mousemove на элемент,
			над которым прослушиваем события.
		*/
		this.el.addEventListener('mousemove', e => this.mousemoveHandler(e))

		/*
			Повесить обработчик события прожатия клавиши мыши mousedown на
			элемент, над которым прослушиваем события.
		*/
		this.el.addEventListener('mousedown', e => this.mousedownHandler(e))

		/*
			Повесить обработчик события отпускания клавиши мыши mouseup на
			элемент, над которым прослушиваем события.
		*/
		this.el.addEventListener('mouseup', e => this.mouseupHandler(e))

		/*
			Повесить обработчик события прокрутки колёсика мыши wheel
			на элемент, над которым прослушиваем события.
		*/
		this.el.addEventListener('wheel', e => this.wheelHandler(e))
	}

	// Метод запоминает состояние прожатия ЛКМ и определяет клик мыши.
	tick () {
		// Определить, произошёл ли клик ЛКМ.
		this.click = !this.pLeft && this.left
		// Запомнить состояние прожатия ЛКМ.
		this.pLeft = this.left

		// Смещения мыши между tick'ами.
		this.dX = this.x - this.pX
		this.dY = this.y - this.pY

		// Запомним координаты мыши в предыдущем tick'е.
		this.pX = this.x
		this.pY = this.y

		/*
			Разность текущей и предыдущей дельт
			скролла колёсика мыши между tick'ами.
		*/
		this.delta = this.cDelta - this.pDelta

		// Установить предыдущую дельту скролла колёсика мыши.
		this.pDelta = this.cDelta
	}

	// Обработчик события mouseenter.
	mouseenterHandler (event) {
		// Установить нахождение мыши над элементом.
		this.over = true

		// Если функция tick вызывается первый раз:
		if (this.firstTick) {
			// Смещения мыши между tick'ами.
			this.dX = 0
			this.dY = 0

			this.x = event.clientX
			this.y = event.clientY

			// Запомним координаты мыши в предыдущем tick'е.
			this.pX = event.clientX
			this.pY = event.clientY
		}

		// Установить флаг "функция tick вызывается первый раз" в false.
		this.firstTick = false
	}

	// Обработчик события mouseout.
	mouseoutHandler (event) {
		// Снять нахождение мыши над элементом.
		this.over = false

		// Установить флаг "функция tick вызывается первый раз" в false.
		this.firstTick = false
	}

	// Обработчик события mousemove.
	mousemoveHandler (event) {
		// Координаты элемента, над которым прослушиваем события.
		const rect = this.el.getBoundingClientRect()

		/*
			Координаты мыши относительно элемента,
			над которым прослушиваем события.
		*/
		this.x = event.clientX - rect.left
		this.y = event.clientY - rect.top

		// Установить флаг "функция tick вызывается первый раз" в false.
		this.firstTick = false
	}

	// Обработчик события mousedown.
	mousedownHandler (event) {
		// Если в событии код ЛКМ:
		if (event.button === 0) {
			// Установить прожатие ЛКМ.
			this.left = true
		}
	}

	// Обработчик события mouseup.
	mouseupHandler (event) {
		// Если в событии код ЛКМ:
		if (event.button === 0) {
			// Снять прожатие ЛКМ.
			this.left = false
		}
	}

	// Обработчик события прокрутки колёсика мыши wheelHandler.
	wheelHandler (event) {
		// Текущая дельта скролла колёсика мыши.
		this.cDelta += event.deltaY / 100
	}
}