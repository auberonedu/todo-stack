document.addEventListener('DOMContentLoaded', function () {
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
    startVisualizationButton.addEventListener('click', function () {
      const itemsText = todoItemsInput.value.trim();
      if (itemsText !== '') {
        listItems = itemsText.split('\n').map((item) => item.trim()).filter((item) => item !== '');
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
    listNameInput.addEventListener('keypress', function (event) {
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
      printButton.addEventListener('click', function () {
        printedTitlesDisplay.textContent += name + '\n';
      });
  
      const finishButton = document.createElement('button');
      finishButton.textContent = 'Finished';
      finishButton.className = 'finish-button';
      finishButton.disabled = true; // Initially disabled
      finishButton.style.display = 'none'; // Hidden for non-top items
      finishButton.addEventListener('click', function () {
        stackContainer.removeChild(listDiv);
        updateFinishButtonVisibility();
      });
  
      buttonGroup.appendChild(printButton);
      buttonGroup.appendChild(finishButton);
  
      listHeader.appendChild(titleSpan);
      listHeader.appendChild(buttonGroup);
  
      // Create list items with checkboxes
      const itemsDiv = document.createElement('div');
      itemsDiv.className = 'list-items';
  
      listItems.forEach(function (itemText, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function () {
          if (checkbox.checked) {
            label.style.textDecoration = 'line-through'; // Strike-through text
          } else {
            label.style.textDecoration = 'none';
          }
          updateFinishButtonState(listDiv); // Check if all items are checked
        });
  
        const label = document.createElement('label');
        label.textContent = `${index + 1}. ${itemText}`;
  
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
        updateFinishButtonVisibility(); // Update visibility after adding new list
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
      const existingLists = stackContainer.querySelectorAll('.list');
      existingLists.forEach((list) => list.classList.add('move-down'));
  
      setTimeout(() => {
        existingLists.forEach((list) => list.classList.remove('move-down'));
        callback();
      }, 300); // Match the duration of the CSS animation
    }
  
    // Update the visibility of "Finished" buttons
    function updateFinishButtonVisibility() {
      const lists = stackContainer.querySelectorAll('.list');
      lists.forEach((list, index) => {
        const finishButton = list.querySelector('.finish-button');
        if (index === 0) {
          finishButton.style.display = 'block'; // Show for the top item
        } else {
          finishButton.style.display = 'none'; // Hide for other items
        }
      });
    }
  
    // Update the state of the "Finished" button for a list
    function updateFinishButtonState(listDiv) {
      const checkboxes = listDiv.querySelectorAll('.list-item input[type="checkbox"]');
      const finishButton = listDiv.querySelector('.finish-button');
      const allChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);
      finishButton.disabled = !allChecked; // Enable if all items are checked
    }
  });
  