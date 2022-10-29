const btns = document.querySelectorAll('.btn');
const display = document.getElementById('displayField');
const buttons = document.getElementById('buttons');
let expression = '';
let currentExpression = '';
let expressionArray = '';
let arr = [];
let arr1 = [];
let arr2 = [];
let sum = 0;
const btnEqual = document.getElementById('equal');
display.value = expression;
const operands = ["+", '-', '*', '/'];
const operandsHigh = ['^', '!']
const parentheseRegex = /\(([^()]*)\)/
btns.forEach(btn => btn.addEventListener('click', function () { addInput(event.target.value) }));
btnEqual.addEventListener('click', function() { equal() });
document.addEventListener("keydown", function() { addInput(event.key) })

function addInput(value) {
    if (value === 'c' || value === 'C') {
        arr2 = [];
        currentExpression = '';
    } else if (value === 'Enter') {
        equal();
        return;
    } else if (value === 'Backspace') {
        if (currentExpression.length === 1 && arr2.length > 0) {
            currentExpression = arr2[arr2.length - 1];
            arr2.pop();
        } else if (currentExpression.length === 1) {
            currentExpression = '';
        } else {
            currentExpression = currentExpression.replace(/.$/,'');
        }    
    } else if (currentExpression === '' && arr2.length === 0) {
        if (!isNaN(value)) {
            currentExpression = value;
        } else if (value === '(') {
            currentExpression = value;
        } else if (value === '.') {
            currentExpression = '0' + value;
        } else {
            return;
        }
    } else if (!isNaN(value)) { // numbers
        if (!isNaN(currentExpression)) {
            console.log(currentExpression);
            currentExpression = currentExpression + value;
        } else if (currentExpression === ')') {
            arr2.push(currentExpression);
            arr2.push('*');
            currentExpression = value;
        } else if (operands.includes(currentExpression) || currentExpression === '(' || currentExpression === '^') {
            arr2.push(currentExpression);
            currentExpression = value;
        } else if (currentExpression === '!') {
            arr2.push(currentExpression);
            arr2.push('*');
            currentExpression = value;
        }
    } else if (value === '.') { // decimal
        if (currentExpression.includes('.')) {
            return;
        } else if (currentExpression === '') {
            currentExpression = '0.'
        } else if (operands.includes(currentExpression) || currentExpression === '(') {
            arr2.push(currentExpression);
            currentExpression = '0.'
        } else if (currentExpression === ')' || operandsHigh.includes(currentExpression)) {
            arr2.push(currentExpression);
            arr2.push ('*');
            currentExpression = '0.'
        } else if (!isNaN(currentExpression)) {
            currentExpression = currentExpression + value;
        } 
    } else if (operands.includes(value)) { // operands
        if (operands.includes(currentExpression)) {
            currentExpression = value;
        } else if (!isNaN(currentExpression) || currentExpression === ')') {
            arr2.push(currentExpression);
            currentExpression = value;
        } 
    } else if (value === '(') {     // open parentheses
        if (!isNaN(currentExpression) || operandsHigh.includes(currentExpression) || currentExpression === ')') {
            arr2.push(currentExpression);
            arr2.push('*');
            currentExpression = value;

        } else if (operands.includes(currentExpression) || currentExpression === '(') {
            arr2.push(currentExpression);
            currentExpression = value;
        }
    } else if (value === ')') {     // close parentheses
        if (currentExpression === '^') {
            arr2.push('^');
            currentExpression = ')';
        } else if (operands.includes(currentExpression)) {
            return;
        } else if (!isNaN(currentExpression)) {
            arr2.push(currentExpression);
            currentExpression = value;
        }
    } else if (operandsHigh.includes(value)) { // high operands
        if (!isNaN(currentExpression) || currentExpression === ')') {
            arr2.push(currentExpression);
            currentExpression = value;
        } else {
            return;
        }
        } else if (value === 'neg') {       // negative
            if (currentExpression === '') {
                arr2.push('(');
                currentExpression = '-'
            } else if (arr2[arr2.length - 1] === '-' && arr2[arr2.length - 2] === '(') {
                console.log('pop one')
                arr2.pop();
                arr2.pop();
            } else if (arr2[arr2.length - 1] === '-') {
                console.log('pop both')
                arr2.pop();
            } else if (!isNaN(currentExpression)) {
                arr2.push('(');
                arr2.push('-');
            } else if (operands.includes(currentExpression)) {
                arr2.push(currentExpression);
                arr2.push('(');
                currentExpression = '-';
            }
        }
        if (currentExpression === '' & arr2.length > 0) {
            currentExpression = arr2[length - 1];
            arr2.pop();
        }
        expression = arr2.join('') + currentExpression;
        display.value = expression;
    }

function equal() {
    while ((expression.match(/\(/g) || []).length != (expression.match(/\)/g) || []).length) {
        if ((expression.match(/\(/g) || []).length > (expression.match(/\)/g) || []).length) {
            expression += ')';
        } else if ((expression.match(/\(/g) || []).length < (expression.match(/\)/g) || []).length){
            expression = '(' + expression;
        }
    }
    while (expression.includes('(')) {
        arr1 = parentheseRegex.exec(expression);
        expressionToArray(arr1[1]);
        let newValue = evalExpression(arr1[1]);
        expression = expression.replace(arr1[0], newValue);
    }
    console.log('equal ' + expression)
    expressionToArray(expression);
    let sum = evalExpression(expression);
    if (sum === undefined || sum === null) {
        display.value = 'Invalid expression';
        arr = [];
        expression = '';
    } else {
        display.value = sum;
        if (sum != 0){
            currentExpression = sum;
        } else {
            currentExpression = '';
        }
        sum = 0;
        arr = [];
        arr2 = [];
        if (currentExpression.includes('-')) {
            arr2.push('-')
            currentExpression = currentExpression.substring(1);
        }
    }
}

function evalExpression(expressionToEval) {
    let sum = 0;
    let count = 0;
    while (expressionToEval.includes('^') && count < 5) {
        let indexE = arr.indexOf('^');
        console.log('indexE: ' + indexE)
        console.log('expressionToEval: ' + expressionToEval)
        sum = exponent(arr[indexE - 1], arr[indexE + 1])
        arr.splice(indexE - 1, 3, sum)
        expressionToEval = arr.join('');
        console.log('expressionToEval: ' + expressionToEval);
        console.log('arr: ' + arr);
        count++;
    }
    while (expressionToEval.includes('!')) {
        let indexF = arr.indexOf('!');
        sum = factorial(arr[indexF - 1]);
        arr.splice(indexF - 1, 2, sum);
        expressionToEval = arr.join('');
    }
    while (expressionToEval.includes('*') || expressionToEval.includes('/')) {
        let indexM = arr.indexOf('*');
        let indexD = arr.indexOf('/');
        if (indexM > 0 && indexD > 0) {
            if (indexM < indexD) {
                sum = multiply(arr[indexM - 1], arr[indexM + 1])
                arr.splice(indexM - 1, 3, sum)
            } else {
            sum = divide(arr[indexD - 1], arr[indexD + 1])
            arr.splice(indexD - 1, 3, sum)
        }
    } else if (indexM > 0) {
        sum = multiply(arr[indexM - 1], arr[indexM + 1])
        arr.splice(indexM - 1, 3, sum)
    } else if (indexD > 0) {
        sum = divide(arr[indexD - 1], arr[indexD + 1])
        arr.splice(indexD - 1, 3, sum)
    }
    expressionToEval = arr.join('');
}
    while (expressionToEval.includes('+') || expressionToEval.includes('-') && arr.length > 2) {
        let indexA = arr.indexOf('+');
        let indexS = arr.indexOf('-');
        if (indexA > 0 && indexS > 0) {
            if (indexA < indexS) {
                sum = add(arr[indexA - 1], arr[indexA + 1]);
                arr.splice(indexA - 1, 3, sum);
            } else {
                sum = subtract(arr[indexS - 1], arr[indexS + 1]);
                arr.splice(indexS - 1, 3, sum);
            }
        } else if (indexA > 0) {
            sum = add(arr[indexA - 1], arr[indexA + 1]);
            arr.splice(indexA - 1, 3, sum);
        } else if (indexS > 0) {
            sum = subtract(arr[indexS - 1], arr[indexS + 1]);
            arr.splice(indexS - 1, 3, sum);
        }
        expressionToEval = arr.join('');
    }
    arr = [];
    return expressionToEval
}

function expressionToArray (expressionArray) {
    let string = '';
    for (let i = 0; i < expressionArray.length; i++) {
        if (!isNaN(expressionArray[i]) || expressionArray[i] === '.') {
            string += expressionArray[i];
        } else if ((expressionArray[i] === '-' && i === 0) || (expressionArray[i] === '-' && operands.includes(expressionArray[i - 1]))){
            string += expressionArray[i];
        } else if (operands.includes(expressionArray[i]) || operandsHigh.includes(expressionArray[i])) {
            arr.push(expressionArray[i]);
        }
        if (((operands.includes(expressionArray[i + 1]) || operandsHigh.includes(expressionArray[i + 1])) && string != '') || (i === expressionArray.length - 1 && string != '')) {
            if (isInt(string)) {
                arr.push(parseInt(string))
                string = '';
            } else {
                arr.push(parseFloat(string));
                string = '';
            }
        }
    }
    console.log('expressionToArray (arr): ' + arr)
}

function isInt(n) {
    return n % 1 === 0;
 }

function add(a, b) {
    return (a * 10 + b * 10) / 10;
}

function subtract(a, b) {
    return (a * 10 - b * 10) / 10;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function exponent(a, b) {
    return a ** b;
}

function factorial (a) {
    if (a < 0) {
        return -1;
    }
    if (a === 0 || a === 1) {
        return 1;
    } else {
    return (a * factorial(a - 1));
    }
}