// Select elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const filterAll = document.getElementById('filterAll');
const filterCompleted = document.getElementById('filterCompleted');
const filterPending = document.getElementById('filterPending');
const emptyState = document.getElementById('emptyState');
const taskPriority = document.getElementById('taskPriority');
const taskCategory = document.getElementById('taskCategory');
const taskDueDate = document.getElementById('taskDueDate');
const sortTasks = document.getElementById('sortTasks');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const themeToggle = document.getElementById('themeToggle');
const notification = document.getElementById('notification');

// API endpoints
const API_BASE_URL = 'http://localhost:5000/api';

// Load tasks from backend when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const tasks = await response.json();
    taskList.innerHTML = '';
    tasks.forEach(appendTaskToUI);
    updateEmptyState();
    updateTaskStats();
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Add task event
function handleAddTask(e) {
  e.preventDefault();
  addTask();
}

addTaskButton.addEventListener('click', handleAddTask);

// Add "Enter" key functionality
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

// Add event listeners to filter buttons
filterAll.addEventListener('click', () => {
  setActiveFilter(filterAll);
  filterTasks('all');
});
filterCompleted.addEventListener('click', () => {
  setActiveFilter(filterCompleted);
  filterTasks('completed');
});
filterPending.addEventListener('click', () => {
  setActiveFilter(filterPending);
  filterTasks('pending');
});

// Add sort functionality
sortTasks.addEventListener('change', () => {
  const tasks = Array.from(taskList.children);
  sortTasksList(tasks, sortTasks.value);
});

function setActiveFilter(activeButton) {
  [filterAll, filterCompleted, filterPending].forEach(button => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
}

async function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    addShakeAnimation();
    showNotification('Please enter a task!', 'warning');
    return;
  }

  // Check for duplicate task
  if (isTaskDuplicate(taskText)) {
    addShakeAnimation();
    showNotification('This task already exists!', 'error');
    return;
  }

  // Create a new task
  const task = {
    text: taskText,
    completed: false,
    priority: taskPriority.value,
    category: taskCategory.value,
    dueDate: taskDueDate.value
  };

  try {
    // Add pulse animation to button
    addTaskButton.classList.add('button-pulse');
    setTimeout(() => addTaskButton.classList.remove('button-pulse'), 1000);

    // Save to backend
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const newTask = await response.json();

    // Add task to the UI
    appendTaskToUI(newTask);

    // Clear the input fields
    taskInput.value = '';
    taskPriority.value = 'medium';
    taskCategory.value = 'personal';
    taskDueDate.value = '';
    
    // Update stats and empty state
    updateTaskStats();
    updateEmptyState();

    // Show success notification
    showNotification('Task added successfully!', 'success');
  } catch (error) {
    console.error('Error adding task:', error);
    showNotification('Failed to add task. Please try again.', 'error');
  }
}

function appendTaskToUI(task) {
  // Create a new list item
  const li = document.createElement('li');
  li.dataset.id = task._id;
  
  // Create task content container
  const taskContent = document.createElement('div');
  taskContent.className = 'task-content';

  // Create task title with priority indicator
  const taskTitle = document.createElement('div');
  taskTitle.className = 'task-title';
  const priorityIndicator = document.createElement('span');
  priorityIndicator.className = `task-priority-indicator priority-${task.priority}`;
  taskTitle.appendChild(priorityIndicator);
  taskTitle.appendChild(document.createTextNode(task.text));
  taskContent.appendChild(taskTitle);

  // Create task details
  const taskDetails = document.createElement('div');
  taskDetails.className = 'task-details';
  
  // Add category
  const categorySpan = document.createElement('span');
  categorySpan.innerHTML = `<i class="fas fa-tag"></i> ${task.category}`;
  taskDetails.appendChild(categorySpan);

  // Add due date if exists
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const dueDateSpan = document.createElement('span');
    dueDateSpan.innerHTML = `<i class="fas fa-clock"></i> ${dueDate.toLocaleDateString()}`;
    taskDetails.appendChild(dueDateSpan);
  }

  taskContent.appendChild(taskDetails);
  li.appendChild(taskContent);

  // Create buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-buttons';

  // Add "completed" class if the task is completed
  if (task.completed) {
    li.classList.add('completed');
  }

  // Create a complete button
  const completeButton = document.createElement('button');
  completeButton.className = 'complete-btn';
  completeButton.innerHTML = task.completed ? 
    '<i class="fas fa-undo"></i>' : 
    '<i class="fas fa-check"></i>';
  completeButton.addEventListener('click', async () => {
    try {
      // Add completing animation to button
      completeButton.classList.add('completing');
      
      const updatedTask = { ...task, completed: !task.completed };
      const response = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Add completing animation to task
      li.classList.add('completing');
      
      // Wait for animation to finish before updating UI
      setTimeout(() => {
        li.classList.toggle('completed');
        completeButton.innerHTML = updatedTask.completed ? 
          '<i class="fas fa-undo"></i>' : 
          '<i class="fas fa-check"></i>';
        li.classList.remove('completing');
        completeButton.classList.remove('completing');
        updateTaskStats();
      }, 600);

    } catch (error) {
      console.error('Error updating task:', error);
      // Remove animation if there's an error
      completeButton.classList.remove('completing');
    }
  });

  // Create a delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener('click', async () => {
    try {
      // Add deleting animation to button
      deleteButton.classList.add('deleting');
      
      const response = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Add deleting animation to task
      li.classList.add('deleting');
      
      // Wait for animation to finish before removing
      setTimeout(() => {
        li.remove();
        updateEmptyState();
        updateTaskStats();
      }, 500);

    } catch (error) {
      console.error('Error deleting task:', error);
      // Remove animation if there's an error
      deleteButton.classList.remove('deleting');
    }
  });

  // Append buttons to buttons container
  buttonsDiv.appendChild(completeButton);
  buttonsDiv.appendChild(deleteButton);

  // Append buttons container to list item
  li.appendChild(buttonsDiv);

  // Append list item to the list
  taskList.appendChild(li);
}

function filterTasks(filter) {
  const tasks = document.querySelectorAll('#taskList li');
  tasks.forEach((task) => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'pending':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
    }
  });
}

function sortTasksList(tasks, sortBy) {
  const sortedTasks = tasks.sort((a, b) => {
    const taskA = getTaskFromLocalStorage(a.dataset.id);
    const taskB = getTaskFromLocalStorage(b.dataset.id);

    switch (sortBy) {
      case 'dateAdded':
        return new Date(taskB.dateAdded) - new Date(taskA.dateAdded);
      case 'dueDate':
        if (!taskA.dueDate) return 1;
        if (!taskB.dueDate) return -1;
        return new Date(taskA.dueDate) - new Date(taskB.dueDate);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[taskA.priority] - priorityOrder[taskB.priority];
      case 'category':
        return taskA.category.localeCompare(taskB.category);
      default:
        return 0;
    }
  });

  // Reappend sorted tasks
  sortedTasks.forEach(task => taskList.appendChild(task));
}

function updateTaskStats() {
  const tasks = document.querySelectorAll('#taskList li');
  const completed = document.querySelectorAll('#taskList li.completed').length;
  
  totalTasks.textContent = `Total: ${tasks.length}`;
  completedTasks.textContent = `Completed: ${completed}`;
  pendingTasks.textContent = `Pending: ${tasks.length - completed}`;
}

function updateEmptyState() {
  const tasks = document.querySelectorAll('#taskList li');
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
}

// Theme switching
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Add ripple effect to button
document.getElementById('addTaskButton').addEventListener('click', function(e) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  this.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => ripple.remove(), 600);
});

// Add these styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .shake {
    animation: shake 0.3s ease-in-out;
  }

  @keyframes slide-out {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .slide-out {
    animation: slide-out 0.3s ease-out forwards;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .button-pulse {
    animation: pulse 1s ease-out;
  }

  @keyframes success-bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .success-bounce {
    animation: success-bounce 0.5s ease-out;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    animation: ripple 0.6s linear;
  }

  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes completing {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .completing {
    animation: completing 0.6s ease-out;
  }

  @keyframes deleting {
    to {
      transform: scale(0);
      opacity: 0;
    }
  }

  .deleting {
    animation: deleting 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

function addShakeAnimation() {
  const input = document.getElementById('taskInput');
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 300);
}

function addSuccessAnimation() {
  const button = document.getElementById('addTaskButton');
  button.classList.add('success-bounce');
  setTimeout(() => button.classList.remove('success-bounce'), 500);
}

// Show notification function
function showNotification(message, type = 'error') {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  // Add shake animation for errors
  if (type === 'error') {
    notification.classList.add('shake');
    setTimeout(() => notification.classList.remove('shake'), 500);
  }
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Check if task already exists
function isTaskDuplicate(taskText) {
  const tasks = Array.from(taskList.children);
  return tasks.some(task => {
    const taskTitle = task.querySelector('.task-title');
    return taskTitle && taskTitle.textContent.trim().toLowerCase() === taskText.toLowerCase();
  });
}
