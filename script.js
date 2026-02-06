let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
let currentFilter = 'All';

const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const addBtn = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total-amount');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');

function filterExpenses(category) {
    currentFilter = category;
    renderExpenses();
}

function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;

    const filtered = expenses.filter(e => currentFilter === 'All' || e.category === currentFilter);

    filtered.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div><strong>${expense.name}</strong> <br><small>${expense.category}</small></div>
            <div>
                <span>$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${index})">X</button>
            </div>
        `;
        expenseList.appendChild(li);
        total += expense.amount;
    });

    totalDisplay.innerText = total.toFixed(2);
    localStorage.setItem('myExpenses', JSON.stringify(expenses));
}

addBtn.addEventListener('click', () => {
    const name = nameInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (name && !isNaN(amount)) {
        expenses.push({ name, amount, category });
        nameInput.value = '';
        amountInput.value = '';
        renderExpenses();
    }
});

function deleteExpense(index) {
    expenses.splice(index, 1);
    renderExpenses();
}

// Theme Logic
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Export Logic
exportBtn.addEventListener('click', () => {
    let csv = "Name,Amount,Category\n" + expenses.map(e => `${e.name},${e.amount},${e.category}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerText = '☀️ Light Mode';
}

renderExpenses();