document.addEventListener('DOMContentLoaded', function () {
  const initialSetup = document.getElementById('initial-setup');
  const todoItemsInput = document.getElementById('todo-items-input');
  const startVisualizationButton = document.getElementById('start-visualization-button');

  const includeReturnValueCheckbox = document.getElementById('include-return-value-checkbox');
  const includeLocalVariablesCheckbox = document.getElementById('include-local-variables-checkbox');
  const localVariablesSection = document.getElementById('local-variables-section');
  const localVariablesInput = document.getElementById('local-variables-input');

  const mainContainer = document.getElementById('main-container');
  const stackContainer = document.getElementById('stack-container');
  const addListButton = document.getElementById('add-list-button');
  const listNameInput = document.getElementById('list-name-input');
  const printedTitlesDisplay = document.getElementById('printed-titles-display');

  // Container for the most recent return value
  const mostRecentReturnValueContainer = document.getElementById('most-recent-return-value-container');
  const returnValueDisplay = document.getElementById('return-value-display');

  let listItems = [];

  // These flags/arrays will be determined after Start Visualization
  let includeReturnValue = false;
  let includeLocalVariables = false;
  let localVariableNames = [];

  // Show/hide local variables text area based on checkbox
  includeLocalVariablesCheckbox.addEventListener('change', function() {
      if (this.checked) {
          localVariablesSection.style.display = 'block';
      } else {
          localVariablesSection.style.display = 'none';
      }
  });

  // Event listener for starting the visualization
  startVisualizationButton.addEventListener('click', function () {
      const itemsText = todoItemsInput.value.trim();
      if (itemsText !== '') {
          listItems = itemsText
              .split('\n')
              .map((item) => item.trim())
              .filter((item) => item !== '');

          if (listItems.length > 0) {
              // Determine user’s choices
              includeReturnValue = includeReturnValueCheckbox.checked;
              includeLocalVariables = includeLocalVariablesCheckbox.checked;

              if (includeLocalVariables) {
                  const varsText = localVariablesInput.value.trim();
                  if (varsText !== '') {
                      localVariableNames = varsText
                          .split('\n')
                          .map(v => v.trim())
                          .filter(v => v !== '');
                  }
              }

              // If user wants return values, show the container
              if (includeReturnValue) {
                  mostRecentReturnValueContainer.style.display = 'block';
              }

              // Hide initial setup, show main
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

    // Print button
    const printButton = document.createElement('button');
    printButton.textContent = 'Print';
    printButton.addEventListener('click', function () {
      printedTitlesDisplay.textContent += name + '\n';
    });
    buttonGroup.appendChild(printButton);

    // Return button (replaces "Finished")
    const returnButton = document.createElement('button');
    returnButton.textContent = 'Return';
    returnButton.className = 'finish-button';
    returnButton.style.display = 'none'; // Hidden for non-top items

    // If including return value, add a text input for it
    let returnValueInput = null;
    if (includeReturnValue) {
      returnValueInput = document.createElement('input');
      returnValueInput.type = 'text';
      returnValueInput.placeholder = 'Return value';
      returnValueInput.className = 'return-value-input';
      returnValueInput.style.display = 'none'; // show only on top item
      buttonGroup.appendChild(returnValueInput);
    }

    // Return button event
    returnButton.addEventListener('click', function () {
      // If we are including return values, capture it
      if (includeReturnValue && returnValueInput) {
        returnValueDisplay.textContent = returnValueInput.value || '(empty)';
      }
      // Pop this 'call' off the stack
      stackContainer.removeChild(listDiv);
      updateTopItemUI();
    });
    buttonGroup.appendChild(returnButton);

    listHeader.appendChild(titleSpan);
    listHeader.appendChild(buttonGroup);

    // Create container for local variables if needed
    let localVarsDiv = null;
    if (includeLocalVariables && localVariableNames.length > 0) {
      localVarsDiv = document.createElement('div');
      localVarsDiv.className = 'local-variables-section';

      const heading = document.createElement('h3');
      heading.textContent = 'Local Variables';
      localVarsDiv.appendChild(heading);

      localVariableNames.forEach(varName => {
          const varDiv = document.createElement('div');
          varDiv.className = 'local-variable';
          varDiv.textContent = varName + ': ';
          const varInput = document.createElement('input');
          varInput.type = 'text';
          varDiv.appendChild(varInput);
          localVarsDiv.appendChild(varDiv);
      });
    }

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
      });

      const label = document.createElement('label');
      label.textContent = `${index + 1}. ${itemText}`;

      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);

      itemsDiv.appendChild(itemDiv);
    });

    // Assemble the list and add it to the stack
    listDiv.appendChild(listHeader);
    if (localVarsDiv) {
      listDiv.appendChild(localVarsDiv);
    }
    listDiv.appendChild(itemsDiv);

    // Animation + insertion
    animateStackBeforeAdding(() => {
      stackContainer.insertBefore(listDiv, stackContainer.firstChild);
      updateTopItemUI(); // Update after adding new list
    });
  }

  // Function to generate a random pastel color
  function generateRandomPastelColor() {
    const r = Math.floor(Math.random() * 128 + 128); // Light red
    const g = Math.floor(Math.random() * 128 + 128); // Light green
    const b = Math.floor(Math.random() * 128 + 128); // Light blue
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Function to animate the stack moving down before adding a new item
  function animateStackBeforeAdding(callback) {
    const existingLists = stackContainer.querySelectorAll('.list');
    existingLists.forEach((list) => list.classList.add('move-down'));

    setTimeout(() => {
      existingLists.forEach((list) => list.classList.remove('move-down'));
      callback();
    }, 300); // Match the duration of the CSS animation
  }

  // This function updates:
  //   - Which item is "top of the stack" (index 0)
  //   - Display the Return button (and Return Value input) for only the top
  //   - Enable local variable text boxes only for the top item
  function updateTopItemUI() {
    const lists = stackContainer.querySelectorAll('.list');
    lists.forEach((list, index) => {
      const isTop = (index === 0);

      // Show or hide the Return button
      const returnButton = list.querySelector('.finish-button');
      if (returnButton) {
        returnButton.style.display = isTop ? 'block' : 'none';
      }

      // If we have a return value input, only enable/show it on top
      const returnValueInput = list.querySelector('.return-value-input');
      if (returnValueInput) {
        if (isTop) {
          returnValueInput.style.display = 'inline-block';
          returnValueInput.disabled = false;
        } else {
          returnValueInput.style.display = 'none';
          returnValueInput.disabled = true;
        }
      }

      // Local variable text inputs
      const localVarInputs = list.querySelectorAll('.local-variable input');
      localVarInputs.forEach(input => {
        input.disabled = !isTop;
      });
    });
  }
});
