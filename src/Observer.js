// Класс слушает события.
class Observer {
	constructor () {
		// Слушатели - обработчики событий.
		this.handlers = []
	}

	/*
		Метод генерирует события. Принимает набор аргументов. Уведомляет всех
		заинтересованных об изменении объекта.
	*/
	dispatch (...args) {
		// Пройти по всем обработчикам.
		for (const handler of this.handlers) {
			handler(...args)
		}
	}

	/*
		Метод подписывает экземпляр класса на прослушивание изменений.
		Принимает функцию-слушатель. Возвращает функцию, которая отписывается
		от события.
	*/
	subscribe (handler) {
		this.handlers.push(handler)

		return () => {
			// Если обработчик есть в списке функций-слушателей:
			if (this.handlers.includes(handler)) {
				const index = this.handlers.indexOf(handler)
				this.handlers.splice(index, 1)
			}
		}
	}
}