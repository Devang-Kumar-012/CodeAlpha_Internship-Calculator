const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '0';
let lastInput = '';
let resultDisplayed = false;

// Update display function
function updateDisplay() {
  display.textContent = currentInput;
}

// Clear display
function clearDisplay() {
  currentInput = '0';
  lastInput = '';
  resultDisplayed = false;
  updateDisplay();
}

// Append number or decimal
function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = num === '.' ? '0.' : num;
    resultDisplayed = false;
  } else {
    if (num === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && num !== '.') currentInput = num;
    else currentInput += num;
  }
  updateDisplay();
}

// Append operator
function appendOperator(op) {
  if (resultDisplayed) resultDisplayed = false;
  if (/[+\-*/]$/.test(currentInput)) {
    // Replace operator if last char is operator
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

// Calculate result
function calculate() {
  try {
    // Replace unicode × and ÷ if any (not needed here, but safe)
    const expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
    const answer = Function('"use strict";return (' + expression + ')')();
    currentInput = answer.toString();
    resultDisplayed = true;
    updateDisplay();
  } catch {
    currentInput = 'Error';
    resultDisplayed = true;
    updateDisplay();
  }
}

// Handle button click
buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('number')) {
      appendNumber(button.dataset.num);
    } else if (button.classList.contains('operator')) {
      appendOperator(button.dataset.op);
    } else if (button.id === 'clear') {
      clearDisplay();
    } else if (button.id === 'equals') {
      calculate();
    } else if (button.id === 'decimal') {
      appendNumber('.');
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
  } else if (e.key === '.') {
    appendNumber('.');
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    appendOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  } else if (e.key === 'Backspace') {
    if (resultDisplayed) {
      clearDisplay();
    } else {
      currentInput = currentInput.slice(0, -1) || '0';
      updateDisplay();
    }
  } else if (e.key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
