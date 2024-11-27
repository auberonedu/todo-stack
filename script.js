document.addEventListener('DOMContentLoaded', function() {
    const stackContainer = document.getElementById('stack-container');
    const addListButton = document.getElementById('add-list-button');
    const listNameInput = document.getElementById('list-name-input');
    const printedTitlesDisplay = document.getElementById('printed-titles-display');

    // Hard-coded items for each to-do list
    const listItems = [
        'Print value',
        'Check left',
        'Check right'
    ];

    // Event listener for adding a new list
    addListButton.addEventListener('click', function() {
        const listName = listNameInput.value.trim();
        if (listName !== '') {
            addNewList(listName);
            listNameInput.value = '';
        } else {
            alert('Please enter a list name.');
        }
    });

    // Function to add a new list to the stack
    function addNewList(name) {
        // Create main list container
        const listDiv = document.createElement('div');
        listDiv.className = 'list';

        // Create list header with title and buttons
        const listHeader = document.createElement('div');
        listHeader.className = 'list-header';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'list-title';
        titleSpan.textContent = name;

        const buttonGroup = document.createElement('div');

        const printButton = document.createElement('button');
        printButton.textContent = 'Print';
        printButton.addEventListener('click', function() {
            printedTitlesDisplay.textContent += name + '\n';
        });

        const finishButton = document.createElement('button');
        finishButton.textContent = 'Finished';
        finishButton.addEventListener('click', function() {
            stackContainer.removeChild(listDiv);
        });

        buttonGroup.appendChild(printButton);
        buttonGroup.appendChild(finishButton);

        listHeader.appendChild(titleSpan);
        listHeader.appendChild(buttonGroup);

        // Create list items with checkboxes
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'list-items';

        listItems.forEach(function(itemText) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const label = document.createElement('label');
            label.textContent = itemText;

            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);

            itemsDiv.appendChild(itemDiv);
        });

        // Assemble the list and add it to the stack
        listDiv.appendChild(listHeader);
        listDiv.appendChild(itemsDiv);

        // Insert the new list at the top of the stack
        stackContainer.insertBefore(listDiv, stackContainer.firstChild);
    }
});
