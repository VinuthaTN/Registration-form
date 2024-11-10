document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const dob = document.getElementById('dob').value;
  const termsAccepted = document.getElementById('terms').checked;

  // Validate email
  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Validate date of birth for age between 18 and 50
  const dobDate = new Date(dob);
  const age = calculateAge(dobDate);
  
  if (age < 18) {
    alert('You are not eligible to register as you are below 18 years old.');
    return;
  } else if (age > 50) {
    alert('You are not eligible to register as you are above 50 years old.');
    return;
  }

  // Store data in local storage
  const user = { name, email, password, dob, termsAccepted };
  saveUserData(user);

  // Update the table
  addUserToTable(user);

  // Reset form
  document.getElementById('registrationForm').reset();
});

// Function to calculate age
function calculateAge(dobDate) {
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

// Function to validate email format
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

// Function to save user data to localStorage
function saveUserData(user) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
}

// Function to load user data from localStorage
function loadUserData() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.forEach(user => addUserToTable(user));
}

// Function to add user data to table with delete button
function addUserToTable(user) {
  const tableBody = document.getElementById('userTableBody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <td>${user.dob}</td>
    <td>${user.termsAccepted}</td>
    <td><button onclick="deleteUser('${user.email}')">Delete</button></td>
  `;

  tableBody.appendChild(row);
}

// Function to delete user from the table and localStorage
function deleteUser(email) {
  // Remove user from localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.filter(user => user.email !== email); // Filter out the user with matching email
  localStorage.setItem('users', JSON.stringify(users));

  // Refresh table
  loadTable();
}

// Function to load the table with current users
function loadTable() {
  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = ""; // Clear existing rows
  loadUserData(); // Reload data from localStorage and add rows
}

// Load data on page load
window.onload = loadTable;
