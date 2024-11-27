document.addEventListener('DOMContentLoaded', function() {
    const initialSetup = document.getElementById('initial-setup');
    const todoItemsInput = document.getElementById('todo-items-input');
    const startVisualizationButton = document.getElementById('start-visualization-button');

    const mainContainer = document.getElementById('main-container');
    const stackContainer = document.getElementById('stack-container');
    const addListButton = document.getElementById('add-list-button');
    const listNameInput = document.getElementById('list-name-input');
    const printedTitlesDisplay = document.getElementById('printed-titles-display');

    let listItems = [];

    // Event listener for starting the visualization
    startVisualizationButton.addEventListener('click', function() {
        const itemsText = todoItemsInput.value.trim();
        if (itemsText !== '') {
            listItems = itemsText.split('\n').map(item => item.trim()).filter(item => item !== '');
            if (listItems.length > 0) {
                initialSetup.style.display = 'none';
                mainContainer.style.display = 'block';
            } else {
                alert('Please enter at least one to-do item.');
            }
        } else {
            alert('Please enter at least one to-do item.');
        }
    });

    // Event listener for adding a new list with button or Enter key
    addListButton.addEventListener('click', addListFromInput);
    listNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addListFromInput();
        }
    });

    // Function to add a new list from input
    function addListFromInput() {
        const listName = listNameInput.value.trim();
        if (listName !== '') {
            addNewList(listName);
            listNameInput.value = '';
        } else {
            alert('Please enter a value.');
        }
    }

    // Function to add a new list to the stack
    function addNewList(name) {
        // Create main list container
        const listDiv = document.createElement('div');
        listDiv.className = 'list';
        listDiv.style.backgroundColor = generateRandomPastelColor(); // Set random pastel background

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

        // Add animation to stack
        animateStackBeforeAdding(() => {
            stackContainer.insertBefore(listDiv, stackContainer.firstChild);
        });
    }

    // Function to generate a random pastel color
    function generateRandomPastelColor() {
        const r = Math.floor(Math.random() * 128 + 128); // Light red
        const g = Math.floor(Math.random() * 128 + 128); // Light green
        const b = Math.floor(Math.random() * 128 + 128); // Light blue
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Function to animate the stack moving down
    function animateStackBeforeAdding(callback) {
        // Temporarily add a class to existing lists for animation
        const existingLists = stackContainer.querySelectorAll('.list');
        existingLists.forEach(list => list.classList.add('move-down'));

        // Wait for animation to complete, then execute callback
        setTimeout(() => {
            existingLists.forEach(list => list.classList.remove('move-down'));
            callback();
        }, 300); // Match the duration of the CSS animation
    }
});
