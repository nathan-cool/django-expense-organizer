const searchField = document.getElementById('searchField');
const tableOutput = document.querySelector('.table-output');
const mainTable = document.querySelector('.main-table');
const tbody = document.querySelector('.table-body');
tableOutput.style.display = 'none';


searchField.addEventListener('keyup', (e) => {
	const searchValue = e.target.value;
	if (searchValue.length > 0) {
		fetch('/search_expenses/', {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ searchText: searchValue }),
			method: 'POST'
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('data', data);
				tableOutput.style.display = 'block';
				mainTable.style.display = 'none';

				if (data.length === 0) {
					tableOutput.innerHTML = 'No results found';
				}
				else (data.length > 0) {
					let rowsHtml = data
						.map((item) => {
							const editUrl = urlTemplates.editExpense.replace(
								'{id}',
								item.id
							);
							const deleteUrl =
								urlTemplates.deleteExpense.replace(
									'{id}',
									item.id
								);

							return `
              <tr>
                <td>${item.description.substring(0, 20)}</td>
                <td>${item.amount}</td>
                <td>${item.category}</td>
                <td>${item.date}</td>
                <td>${item.invoice_number}</td>
                <td>${item.reference}</td>
                <td>
                  <a class="btn btn-sm btn-primary" href="${editUrl}">Edit</a>
                  <a class="btn btn-sm btn-danger" href="${deleteUrl}" onclick="return confirm('Are you sure you want to delete this expense?')">Delete</a>
                </td>
              </tr>
            `;
						})
						.join('');

					tbody.innerHTML = rowsHtml;
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				tableOutput.innerHTML =
					'An error occurred. Please try again later.';
			});
	} else {
		tableOutput.style.display = 'none';
		mainTable.style.display = 'block';
	}
});