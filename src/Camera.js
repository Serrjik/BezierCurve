// Класс Camera собирает информацию о масштабе и сдвиге в приложении и канвасе.
class Camera extends Observer {
	// Сдвиг от левого верхнего угла.
	#offsetX
	#offsetY
	// Масштаб.
	#scale
	
	constructor () {
		super()

		// Сдвиг от левого верхнего угла.
		this.#offsetX = 0
		this.#offsetY = 0

		// Масштаб.
		this.#scale = 1
		// Коэффициент масштабирования.
		this.scaleStep = -0.1
	}

	get offsetX () {
		return this.#offsetX
	}

	set offsetX (value) {
		// Установить приватное поле.
		this.#offsetX = value
		// Уведомить об изменении камеры.
		this.dispatch()
		return value
	}

	get offsetY () {
		return this.#offsetY
	}

	set offsetY (value) {
		// Установить приватное поле.
		this.#offsetY = value
		// Уведомить об изменении камеры.
		this.dispatch()
		return value
	}

	get scale () {
		return this.#scale
	}

	set scale (value) {
		// Установить приватное поле.
		this.#scale = value
		// Уведомить об изменении камеры.
		this.dispatch()
		return value
	}

}