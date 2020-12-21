class Point extends Observer {
	// Приватные поля.
	#x
	#y

	// Класс принимает координаты точки.
	constructor (x, y) {
		super()

		// Приватные поля.
		this.#x = x
		this.#y = y
	}

	get x () {
		return this.#x
	}

	set x (x) {
		return (this.#x = x)
		this.dispatch()
	}

	get y () {
		return this.#y
	}

	set y (y) {
		return (this.#y = y)
		this.dispatch()
	}
}