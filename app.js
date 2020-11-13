// Global Variables

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal');
const searchBar = document.getElementById('searchBar');
const leftArrow = document.createElement('button');
const rightArrow = document.createElement('button');

// Pulls Employee Data

fetch(urlAPI)
	.then((res) => res.json())
	.then((res) => res.results)
	.then(displayEmployees)
	.catch((err) => console.log(err));

// Displays Employee Data on Main Page

function displayEmployees(employeeData) {
	employees = employeeData;

	let employeeHTML = '';

	employees.forEach((employee, index) => {
		let name = employee.name;
		let email = employee.email;
		let city = employee.location.city;
		let picture = employee.picture;

		employeeHTML += `
    <div class="card" data-index=${index}>
      <img class="avatar" src="${picture.large}" />
      <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
      </div>
    </div>
    `;
	});

	gridContainer.innerHTML = employeeHTML;
}

// Displays Employee Data When Employee is Selected

function displayModal(index) {
	let {
		name,
		dob,
		phone,
		email,
		location: { city, street, state, postcode },
		picture,
	} = employees[index];

	let date = new Date(dob.date);

	const modalHTML = `
		<button class="modal-close">X</button>
    <img class="avatar" src="${picture.large}" />
    <div class="modal-text">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
			<p class="address">${city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${street.number} ${
		street.name
	}, ${state} ${postcode}</p>
      <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
	`;

	overlay.classList.remove('hidden');
	modalContainer.innerHTML = modalHTML;

	leftArrow.id = 'leftArrow';
	modalContainer.appendChild(leftArrow);
	document.getElementById('leftArrow').innerHTML = `<`;

	rightArrow.id = 'rightArrow';
	modalContainer.appendChild(rightArrow);
	document.getElementById('rightArrow').innerHTML = `>`;

	const modalClose = document.querySelector('.modal-close');
	modalClose.addEventListener('click', () => {
		overlay.classList.add('hidden');
	});
}

gridContainer.addEventListener('click', (e) => {
	if (e.target !== gridContainer) {
		const card = e.target.closest('.card');
		let index = card.getAttribute('data-index');

		displayModal(index);

		rightArrow.addEventListener('click', () => {
			if (index < employees.length - 1) {
				index++;
				displayModal(index);
			}
		});

		leftArrow.addEventListener('click', () => {
			if (index > 0) {
				index--;
				displayModal(index);
			}
		});
	}
});

// Search Filter for Employees

searchBar.addEventListener('keyup', (e) => {
	const searchString = e.target.value.toLowerCase();

	const empNames = document.querySelectorAll('.card h2');

	const filteredResults = empNames.forEach((name) => {
		if (!name.textContent.toLowerCase().includes(searchString)) {
			name.closest('.card').classList.add('hidden');
		} else if (name.textContent.toLowerCase().includes(searchString)) {
			name.closest('.card').classList.remove('hidden');
		}
	});

	return filteredResults;
});
