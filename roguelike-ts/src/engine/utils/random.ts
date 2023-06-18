/**
 * Возвращает случайное число от 0 до 1
 * @returns {number} Случайное число
 */

function plain() {
    return Math.random();
}

/**
 * Выбирает элемент из массива с учетом веса
 * @template T
 * @param {[T, number][]} xs - Массив элементов с их весами
 * @returns {T} - Выбранный элемент
 * @throws {Error} - Если не удалось сгенерировать элемент
 */
function pickWithWeight<T>(xs: [T, number][]): T {
    const length = xs.map((x) => x[1]).reduce((a, x) => a + x, 0);
    const dot = Math.random() * length;

    let sum = 0;
    for (const [elem, weigth] of xs) {
        sum += weigth;
        if (sum > dot) {
            return elem;
        }
    }

    throw new Error('can not generate');
}

export const Random = {
    plain,
    pickWithWeight
};
