/**
 * Выбирает случайные элементы из массива.
 * @template T
 * @param {Array<T>} arr - Исходный массив.
 * @param {number} count - Количество элементов для выбора.
 * @returns {Array<T>} Массив случайно выбранных элементов.
 */
 function getRandomElements(arr, count) {
    // Проверка, достаточно ли элементов в массиве
    if (arr.length < count) {
        return arr;
    }

    // Создание копии массива для предотвращения изменения исходного массива
    let copyArr = [...arr];
    let result = [];

    for (let i = 0; i < count; i++) {
        // Генерация случайного индекса
        let randomIndex = Math.floor(Math.random() * copyArr.length);

        // Добавление выбранного элемента в результат
        result.push(copyArr[randomIndex]);

        // Удаление выбранного элемента из копии массива
        copyArr.splice(randomIndex, 1);
    }

    return result;
}