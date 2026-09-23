// 這個檔案用來管理待辦清單的資料、渲染與互動邏輯。
const STORAGE_KEY = 'todoList';
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');

// 讀取 localStorage 中的待辦資料，如果沒有資料則使用空陣列。
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 儲存目前待辦資料到 localStorage，確保重新整理後資料仍在。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 計算未完成的待辦數量並更新底部顯示文字。
function updateRemainingCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;
}

// 依照目前 todos 陣列來重新渲染清單，包含空狀態與計數更新。
function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記 ${todo.text} 為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', `刪除 ${todo.text}`);

    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    deleteBtn.addEventListener('click', () => {
      todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  updateRemainingCount();
}

// 新增待辦事項，輸入空白內容時不處理。
function addTodo() {
  const value = todoInput.value.trim();

  if (!value) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now(),
    text: value,
    completed: false,
  });

  todoInput.value = '';
  saveTodos();
  renderTodos();
  todoInput.focus();
}

addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// 初始載入時先渲染目前資料，確保頁面建立後內容即顯示。
renderTodos();
