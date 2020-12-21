// Класс который соответствует кривой Безье.
class Bezier extends Observer {
	// Приватные поля.
	// Кривая Безье.
	#curve
	// Флаг - если поднят, то нужно обновить состояние кривой Безье.
	#newState = false
	// Флаг - есть ли анимация.
	#animation = false

	constructor (params) {
		super()

		// Узлы кривой Безье.
		this.nodes = []

		// Кривая Безье.
		this.#curve = []
		// Флаг - если поднят, то нужно обновить состояние кривой Безье.
		this.#newState = false

		// Точность подсчёта кривой Безье (шаг).
		this.step = params.step,
		// Флаг - показать контрольные точки.
		this.showCtrlPoints = params.showCtrlPoints ?? true,
		// Флаг - показать контрольные линии.
		this.showCtrlLines = params.showCtrlLines ?? true,

		// Флаг - есть ли анимация.
		this.#animation = params.animation ?? false
		// Отображаемая часть кривой Безье (от 0 до 1).
		this.part = 1
		/*
			Скорость анимации кривой Безье
			(1 / количество секунд, требуемое для цикла анимации).
		*/
		this.speed = 1 / 2

		// Цвета контрольных точек 1-го, 2-го, 3-го и т.д. уровней.
		this.colors = params.colors ?? ['red']

		// Добавить узлы в массив узлов кривой Безье.
		this.add(...params.nodes)
	}

	/*
		Метод добавляет узлы в массив узлов кривой Безье.
		Принимает неопределённое количество аргументов.
	*/
	add (...nodes) {
		// Пройти по всем узлам кривой Безье.
		for (const node of nodes) {
			// Если узел ещё НЕ добавлен:
			if (!this.nodes.includes(node)) {
				// Добавить выбранный узел к узлам кривой Безье.
				this.nodes.push(node)

				/*
					Подписать точку на прослушивание. Если subscribe сработает,
					нужно произвести перерендеринг кривой Безье. Если
					какая-нибудь из координат изменится, нужно поднять флаг
					#newState.
				*/
				node.subscribe(() => {
					this.#newState = true
					this.dispatch()
				})

				/*
					Добавлен узел к кривой Безье, значит поднимаем флаг
					обновления состояния кривой Безье.
				*/
				this.#newState = true
			}
		}
	}

	remove () {}

	// Геттер возвращает копию кривой Безье.
	get curve () {
		return JSON.parse(JSON.stringify(this.#curve))
	}

	set animation (v) {
		this.#animation = v
		this.dispatch()
	}

	get animation () {
		return this.#animation
	}

	// Метод принимает узлы кривой Безье, точность и возвращает саму кривую.
	static getCurve (nodes, step) {
		// Набор точек кривой, который возвращает функция.
		const result = []
		// Количество узлов кривой Безье.
		const n = nodes.length - 1

		// Пройти по времени с шагом step.
		for (let t = 0; t <= 1; t = Math.min(1, t + step)) {
			const point = {
				x: 0,
				y: 0,
			}

			// Пройти по всем узлам кривой Безье.
			for (let k = 0; k <= n; k++) {
				// Коэффициент b.
				const b = C(n, k) * t**k * (1 - t)**(n - k)
				const node = nodes[k]

				point.x += node.x * b,
				point.y += node.y * b,

				result.push(point)
			}

			if (t === 1) {
				break
			}
		}

		return result
	}

	/*
		Метод принимает исходные узлы кривой Безье,
		точность и возвращает саму кривую.
	*/
	// static getCurve (originalNodes, step) {
	// 	const result = []

	// 	for (let part = 0; part <= 1; part = Math.min(1, part + step)) {
	// 		let nodes = originalNodes

	// 		// Пока вспомогательных точек кривой Безье на текущей итерации > 1:
	// 		while (nodes.length > 1) {
	// 			// Посчитать вспомогательные точки кривой Безье заново.
	// 			const newNodes = []

	// 			// Высчитать часть пройденного пути среди всех пар точек.
	// 			// Пройти по тем вспомогательным точкам, что есть сейчас.
	// 			for (let i = 0; i < nodes.length - 1; i++) {
	// 				newNodes.push(
	// 					getPointBetween(
	// 						nodes[i].x,
	// 						nodes[i].y,
	// 						nodes[i + 1].x,
	// 						nodes[i + 1].y,
	// 						part,
	// 					)
	// 				)
	// 			}

	// 			nodes = newNodes
	// 		}

	// 		/*
	// 			Последнюю в цикле вспомогательную точку
	// 			кладём внутрь кривой Безье.
	// 		*/
	// 		result.push(nodes[0])

	// 		if (part === 1) {
	// 			break
	// 		}
	// 	}

	// 	return result
	// }

	// Метод проводит пересчёт кривой Безье (логическая часть, без отрисовки).
	tick ({ secondPart }) {
		// Если поднят флаг обновления состояния кривой Безье:
		if (this.#newState) {
			// Пересчитать кривую Безье заново.
			this.#curve = Bezier.getCurve(this.nodes, this.step)
		}

		// Если поднят флаг наличия анимации:
		if (this.animation) {
			// Если скорость анимации кривой Безье > 0:
			if (this.speed > 0) {
				// Отображаемая часть кривой Безье.
				this.part = Math.min(1, this.part + secondPart * this.speed)

				// Если кривая Безье нарисована полностью:
				if (this.part === 1) {
					this.speed *= -1
				}
			}

			// Если скорость анимации кривой Безье < 0:
			else {
				// Отображаемая часть кривой Безье.
				this.part = Math.max(0, this.part + secondPart * this.speed)

				// Если кривая Безье НЕ нарисована:
				if (this.part === 0) {
					this.speed *= -1
				}
			}
		}

		// Если флаг наличия анимации опущен:
		else {
			// Отображаемая часть кривой Безье после выключения анимации.
			this.part = 1
		}
	}

	/*
		Метод отрисовывает кривую Безье со вспомогательными элементами.
		Принимает экземпляр канваса.
	*/
	draw (canvas) {
		// Если поднят флаг "Показать контрольные точки":
		// if (this.showCtrlPoints) {
		// 	// Отрисовать контрольные точки.
		// 	// Пройти по всем узлам кривой Безье.
		// 	for (const node of this.nodes) {
		// 		canvas.drawCircle({
		// 			x: node.x,
		// 			y: node.y,
		// 			r: 5,
		// 			fillStyle: 'red',
		// 		})
		// 	}
		// }
		// Если поднят флаг "Показать контрольные линии":
		// if (this.showCtrlLines) {
		// 	// Нарисовать прямые линии между узлами кривой Безье.
		// 	for (let i = 0; i < this.nodes.length - 1; i++) {
		// 		canvas.drawLine({
		// 			x1: this.nodes[i].x,
		// 			y1: this.nodes[i].y,
		// 			x2: this.nodes[i + 1].x,
		// 			y2: this.nodes[i + 1].y,
		// 			strokeStyle: 'red',
		// 			// Толщина линии.
		// 			lineWidth: 1.5,
		// 		})
		// 	}
		// }

		// Длина кривой Безье.
		const curveLength = getCurveLength(
			this.#curve.slice(0, this.#curve.length)
		)

		// Длина отображаемой части кривой Безье.
		const curveLengthPart = getCurveLength(
			this.#curve.slice(0, this.part * this.#curve.length)
		)

		// Контекст канваса.
		const { context } = canvas
		// Отображаемая часть кривой Безье.
		const part = this.animation ? this.part : 1

		// Пройти по всем вспомогательным точкам 1-го уровня кривой Безье.
		// Вспомогательные точки первого уровня.
		let nodes = this.nodes
		for (let i = 0; i < this.nodes.length; i++) {
			// Цвет вспомогательных точек и линий:
			const color = this.colors[i % this.colors.length]

			// Отрисовать вспомогательные точки первого уровня.
			for (const node of nodes) {
				canvas.drawCircle({
					x: node.x,
					y: node.y,
					r: 5,
					fillStyle: color,
				})
			}

			// Если вспомогательных точек кривой Безье на текущей итерации > 1:
			if (nodes.length > 1) {
				// Нарисовать прямые линии между узлами кривой Безье.
				for (let i = 0; i < nodes.length - 1; i++) {
					canvas.drawLine({
						x1: nodes[i].x,
						y1: nodes[i].y,
						x2: nodes[i + 1].x,
						y2: nodes[i + 1].y,
						strokeStyle: color,
						// Толщина линии.
						lineWidth: 1.5,
					})
				}

				// Посчитать вспомогательные точки кривой Безье заново.
				const newNodes = []

				// Высчитать часть пройденного пути среди всех пар точек.
				// Пройти по тем вспомогательным точкам, что есть сейчас.
				for (let i = 0; i < nodes.length - 1; i++) {
					newNodes.push(
						getPointBetween(
							nodes[i].x,
							nodes[i].y,
							nodes[i + 1].x,
							nodes[i + 1].y,
							this.part,
						)
					)
				}

				nodes = newNodes
			}

			// Если анимация отсутствует:
			if (!this.animation) {
				/*
					Выходим из цикла, отрисовав только
					вспомогательные элементы 1-го уровня.
				*/
				break
			}
		}

		context.beginPath()
		// Поместить перо в стартовую позицию.
		context.moveTo(this.#curve[0].x, this.#curve[0].y)

		// Пройти по всем точкам кривой Безье, кроме первой.
		for (let i = 1; i < this.#curve.length - 1; i++) {
			// Задать отрезки линии для отрисовки.
			context.lineTo(this.#curve[i].x, this.#curve[i].y)
		}

		context.strokeStyle = 'black'
		context.lineWidth = 2
		// Если поднят флаг наличия анимации:
		// if (this.animation) {
			// Зарегистрировать отрисовку части линии Безье.
			context.setLineDash([curveLengthPart, curveLength])
		// }
		// Если флаг наличия анимации НЕ поднят:
		// else {
			// Зарегистрировать отрисовку кривой Безье полностью.
			// context.setLineDash([])
		// }

		// Отрисовать линию.
		context.stroke()
	}

	// Метод возвращает узел кривой Безье под мышью. Принимает координаты мыши.
	getPointUnder (x, y) {
		// Пройти по всем узлам кривой Безье.
		for (const node of this.nodes) {
			// Расстояние между центром узла кривой Безье и указателем мыши.
			const dist = getDist(x, y, node.x, node.y)
			/*
				Если мышь находится над узлом кривой Безье
				(расстояние от центра узла в пределах диаметра):
			*/
			if (dist <= 10) {
				// Возвратить этот узел!
				return node
			}
		}
	}
}