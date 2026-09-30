// Initialize Data Storage
let users = JSON.parse(localStorage.getItem('neoBankUsers')) || {};
let currentUser = null;
let isAdmin = false;

// --- Navigation Functions ---
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function logout() {
    currentUser = null;
    isAdmin = false;
    document.getElementById('nav-logout').style.display = 'none';
    document.getElementById('nav-login').style.display = 'inline-block';
    document.getElementById('nav-register').style.display = 'inline-block';
    showSection('login-section');
}

// --- User Functions ---
function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) return alert("Please fill all fields");
    if (users[username]) return alert("Username already exists!");

    // Create new user with $0 balance
    users[username] = {
        password: password,
        balance: 0
    };
    
    saveData();
    alert("Account Created! Please Login.");
    showSection('login-section');
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        
        // Check if admin (Hardcoded for demo: admin/admin)
        if (username === 'admin' && password === 'admin') {
            isAdmin = true;
            loadAdminDashboard();
        } else {
            loadUserDashboard();
        }

        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('nav-logout').style.display = 'inline-block';
        
    } else {
        alert("Invalid Username or Password");
    }
}

function loadUserDashboard() {
    showSection('user-dashboard');
    document.getElementById('welcome-msg').innerText = `Welcome, ${currentUser}`;
    updateBalanceDisplay();
}

function simulateDeposit() {
    users[currentUser].balance += 500;
    saveData();
    updateBalanceDisplay();
    alert("Deposit Successful!");
}

function updateBalanceDisplay() {
    const balance = users[currentUser].balance;
    document.getElementById('user-balance').innerText = `$${balance.toFixed(2)}`;
}

// --- Admin Functions ---
function loadAdminDashboard() {
    showSection('admin-dashboard');
    renderUserList();
}

function adminUpdateBalance() {
    const targetUser = document.getElementById('admin-target-user').value;
    const newBalance = parseFloat(document.getElementById('admin-set-balance').value);

    if (!users[targetUser]) {
        alert("User not found!");
        return;
    }

    // Update balance instantly
    users[targetUser].balance = newBalance;
    saveData();
    
    alert(`Balance for ${targetUser} updated to $${newBalance}`);
    renderUserList(); // Refresh list
    
    // Clear inputs
    document.getElementById('admin-target-user').value = '';
    document.getElementById('admin-set-balance').value = '';
}

function renderUserList() {
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    
    for (let user in users) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${user}</span> <span>$${users[user].balance.toFixed(2)}</span>`;
        list.appendChild(li);
    }
}

// --- Utility ---
function saveData() {
    localStorage.setItem('neoBankUsers', JSON.stringify(users));
}