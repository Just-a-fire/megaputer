QUnit.module('Модуль A');

function charToNum(char) {
	var parsed = parseInt(char, 10);
	if (parsed > 0)
		return parsed;
	return char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

QUnit.test('charToNum(char)', function(assert) {
	assert.equal(charToNum('a'),  1, 'a - соответствует числу 1');
	assert.equal(charToNum('b'),  2, 'b - соответствует числу 2');
	assert.equal(charToNum('j'),  10, 'j - соответствует числу 10');
	assert.equal(charToNum('z'),  26, 'z - соответствует числу 26');
	assert.equal(charToNum('A'),  1, 'A - соответствует числу 1');
});


QUnit.module('Модуль B');

function getNumberOfDigits(number) {
    return parseInt(number, 10).toString().length;
}

QUnit.test('getNumberOfDigits(number)', function(assert) {
	assert.equal(getNumberOfDigits(0),  1, 'Ноль - содержит одну цифру');
	assert.equal(getNumberOfDigits(1),  1, 'Один - содержит одну цифру');
	assert.equal(getNumberOfDigits(-2), 1, 'Минус два - содержит одну цифру'); // не пройден
	assert.equal(getNumberOfDigits(5),  1, 'Пять - содержит одну цифру');
	assert.equal(getNumberOfDigits(9.5), 1, 'Девять с половиной - содержит одну цифру'); // parseInt - округление
	assert.equal(getNumberOfDigits(10), 2, 'Десять - содержит две цифры');
	assert.equal(getNumberOfDigits(11), 2, 'Одиннадцать - содержит две цифры');
	assert.equal(getNumberOfDigits(50), 2, 'Пятьдесят - содержит две цифры');
	assert.equal(getNumberOfDigits(100), 3, 'Сто - содержит три цифры');
	assert.equal(getNumberOfDigits(1000000), 7, 'Миллион - содержит семь цифр');
});