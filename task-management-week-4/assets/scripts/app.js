const taskTemplate = `
  <div class="task" draggable="true">
    <p class="task-title">{title}</p>
    <i class="delete-task fa fa-trash icon-red"></i>
    <div class="description">{description}</div>
    <div class="task-details">
      <div class="task-info">
        <div class="avatar"></div>
        <p class="task-code">
          {tag}
        </p>
      </div>
      <div class="task-status">
        <div class="task-type">
          <i class="fa {taskType}"></i>
        </div>
        <div class="task-priority">
          <i class="fa fa-arrow-up {priority}"></i>
        </div>
      </div>
    </div>
  </div>`;

const taskTypeIcons = {
  'task': 'fa-bookmark icon-blue',
  'improvement': 'fa-chart-line icon-teal',
  'bug': 'fa-bug icon-red'
};

const priorityIcons = {
  'low': 'icon-green',
  'medium': 'icon-yellow',
  'high': 'icon-orange',
  'urgent': 'icon-red',
};

const tasks = {
  backlog: [],
  selected: [],
  inProgress: [],
  done: []
};

const backlogDomElement = document.querySelector(".board section:first-child .tasks");
const selected = document.querySelector(".board section:nth-child(2) .tasks");
const inProgress = document.querySelector(".board section:nth-child(3) .tasks");
const done = document.querySelector(".board section:nth-child(4) .tasks");
const addTaskButton = document.getElementById("addTask").addEventListener("click", showForm);
console.log(done);

function compileToNode(domString) {
  const div = document.createElement("div");
  div.innerHTML = domString;

  return div.firstElementChild;
}

function compileTaskTemplate(title, tag, taskType, priority, description, template) {
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{description}", description)
    .replace("{tag}", tag)
    .replace("{taskType}", getTaskTypeIcon(taskType))
    .replace("{priority}", getPriorityIcon(priority));
  return compileToNode(compiledTemplate);
}

function addTask(title, taskType, priority, description, param) {
  const newTask = {
    title: title,
    taskType: taskType,
    priority: priority,
    description: description,
    tag: getId(taskType)
  };

  tasks[param].push(newTask);
  const task = compileTaskTemplate(newTask.title, newTask.tag, newTask.taskType, newTask.priority, newTask.description, taskTemplate);
  const bin = task.querySelector('.delete-task');

  bin.addEventListener("click", removeCard);

  task.addEventListener("click", myFunc);
  function myFunc() {
    localStorage.setItem("profile", JSON.stringify(newTask));
    window.open("assets/new page/index2.html");
  }
  if (param == 'backlog') {
    backlogDomElement.appendChild(task);
  }
  else if (param == 'inProgress') {
    inProgress.appendChild(task);
  }
  else if (param == 'done') {
    done.appendChild(task);
  }
  dragAndDrop();

}

(function fetchCard() {
  fetch('https://605dc9029386d200171bb3c2.mockapi.io/task')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.map(user => {

        if (user.status == 'backlog') {
          addTask(user.title, user.type, user.priority, user.description, 'backlog');
        }
        else if (user.status == 'inprogress') {
          addTask(user.title, user.type, user.priority, user.description, 'inProgress');

        }
        else if (user.status == 'done') {
          addTask(user.title, user.type, user.priority, user.description, 'done');
        }
        else {
          addTask(user.title, user.type, user.priority, user.description, 'selected');
        }


      })
      dragAndDrop();
    })
})()

function dragAndDrop() {
  const draggables = document.querySelectorAll(".task");
  console.log(draggables);
  const containers = document.querySelectorAll('.section');
  console.log(containers);
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    })
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    })
  })
  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      console.log('dragover container');
      const draggable = document.querySelector('.dragging');
      container.appendChild(draggable);
    })
  })

}


function removeCard(event) {
  event.stopPropagation();
  this.parentElement.remove();
  
  event.target.removeEventListener("click", removeCard);
}
/* dark mode*/
const checkDark = document.getElementById("checkbox");
console.log(checkDark);
checkDark.addEventListener("click", darkMode);

function darkMode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
  

}






function showForm() {
  const form = document.body.appendChild(showAddForm());
  form.classList.add('show');
  const closeButton = form.querySelector(".close");

  const closeAddTaskForm = () => {
    form.removeEventListener('submit', submitTask);
    closeButton.removeEventListener('click', closeAddTaskForm);
    form.classList.remove('show');
  }

  const submitTask = (event) => {
    event.preventDefault();

    const { target } = event;

    const title = target.querySelector('[name="title"]').value;
    const type = target.querySelector('[name="type"]').value;
    const priority = target.querySelector('[name="priority"]').value;
    const description = target.querySelector('[name="description"]').value;
    addTask(title, type, priority, description, 'backlog');
    closeAddTaskForm();
  }

  closeButton.addEventListener('click', closeAddTaskForm);
  form.addEventListener('submit', submitTask);
}

function getId(taskType) {
  const allTasks = Object.keys(tasks).reduce((accumulator, currentValue) => {
    return accumulator += tasks[currentValue].length;
  }, 0);
  // the id for a new task will be based on the number of total tasks in the board
  // with reduce, we get the total number of tasks
  const taskNumber = allTasks + 1;
  switch (taskType) {
    case 'task':
      return 'TASK-' + taskNumber;
    case 'improvement':
      return `IMPROVEMENT-${taskNumber}`;
    default:
      return 'BUG' + '-' + taskNumber;
  }
}

const getTaskTypeIcon = taskType => {
  const iconKeyValuePair = Object.entries(taskTypeIcons).find(([key, value]) => {
    return key === taskType; // since it's a one-liner there's no need for {} and 'return' keyword
  });
  return iconKeyValuePair[1]; // index 0 is the key, index 1 is the value in which we are interested
}

const getPriorityIcon = priority => {
  const iconKeyValuePair = Object.entries(priorityIcons).find(([key, value]) => {
    return key === priority; // since it's a one-liner there's no need for {} and 'return' keyword
  });
  return iconKeyValuePair[1]; // index 0 is the key, index 1 is the value in which we are interested
}


function showAddForm() {
  const formString = `
    <div class="backdrop hide">
      <div class="modal">
        <h2 class="title">Add a new task</h2>
        <i class="close fas fa-times fa-2x"></i>
        <form id="addTaskForm" action="" method="POST">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" required>
          <label for="description">Description</label>
          <input type="text" name="description" id="description">

          <label for="type">Type</label>
          <select name="type" id="type" required>
            <option disabled selected value></option>
            <option value="task">Task</option>
            <option value="improvement">Improvement</option>
            <option value="bug">Bug</option>
          </select>
          <label for="priority">Priority</label>
          <select name="priority" id="priority" required>
            <option disabled selected value></option>
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
            <option value="urgent">URGENT</option>
          </select>
          
          <button class="btn-add" name="submit" type="submit">Add task</button>
        </form>
      </div>
    </div>
    `.trim();

  return compileToNode(formString);
}


