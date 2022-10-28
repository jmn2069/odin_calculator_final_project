const btns = document.querySelectorAll('.btn');
const display = document.getElementById('displayField');
const buttons = document.getElementById('buttons');
let equation;
let expression = '';
let expressionArray = '';
let arr = [];
let arr1 = [];
let sum = 0;
const btnEqual = document.getElementById('equal');
display.value = expression;
const operands = ["+", '-', '*', '/', '^', '!'];
const validInput = ['(', ')', '^', '=', '.'];
const parentheseRegex = /\(([^()]*)\)/
const numRegex = /^\D*(\d+(?:\.\d+)?)/gm
btns.forEach(btn => btn.addEventListener('click', function () { addInput(event.target.value) }));
btnEqual.addEventListener('click', function() { equal() });
document.addEventListener("keydown", function() { addInput(event.key) })

function addInput(value) {
    if (value === 'c' || value === 'C') {
        expression = '';
        display.value = expression;
        arr = [];
        arr1 = [];
        return;
    } else if (value ==='Enter') {
        equal();
        return;
    } else if (value === 'Backspace') {
        expression = expression.replace(/.$/,'');
        display.value = expression;
    } else if (expression.length === 0 && (!isNaN(value) || value === '(')) {
        expression += value;
        display.value = expression;
        return;
    } else if (expression.length === 0 && (isNaN(value) || value != '(')) {
        console.log('Invalid expression');
        return;
    } else if (operands.includes(value) && operands.includes(expression.charAt(expression.length - 1))) {
        expression = expression.replace(/.$/,value);
        display.value = expression;
    } else if (!isNaN(expression.charAt(expression.length - 1)) && value === '(') {
        expression += '*';
        expression += value;
        display.value = expression;
    } else if (!isNaN(value) || validInput.includes(value) || operands.includes(value)) {
        expression += value;
        display.value = expression;
    }
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
    expressionToArray(expression);
    let sum = evalExpression(expression);
    if (sum === undefined || sum === null) {
        display.value = 'Invalid expression';
        arr = [];
        expression = '';
    } else {
        display.value = sum;
        expression = sum;
        sum = 0;
        arr = [];
    }
}

function evalExpression(expressionToEval) {
    let sum = 0;
    while (expressionToEval.includes('^')) {
        let indexE = arr.indexOf('^');
        sum = exponent(arr[indexE - 1], arr[indexE + 1])
        arr.splice(indexE - 1, 3, sum)
        expressionToEval = arr.join('');
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
        } else if (operands.includes(expressionArray[i])) {
            arr.push(expressionArray[i]);
        }
        if ((operands.includes(expressionArray[i + 1]) && string != '') || (i === expressionArray.length - 1 && string != '')) {
            if (isInt(string)) {
                arr.push(parseInt(string))
                string = '';
            } else {
                arr.push(parseFloat(string));
                string = '';
            }
        }
    }
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