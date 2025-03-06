// 初始化任务数据和本地存储
let tasks = JSON.parse(localStorage.getItem('cyberTasks')) || {}
const currentDate = new Date().toISOString().split('T')[0]
let currentTab = 'pending';

// DOM元素
const taskInput = document.getElementById('taskInput')
const addBtn = document.getElementById('addBtn')
const dateInput = document.getElementById('dateInput')
const taskList = document.getElementById('taskList')

// 初始化日期选择器
dateInput.value = currentDate

// 任务操作函数
function addTask() {
    const text = taskInput.value.trim()
    const date = dateInput.value
    if (!text) return

    const task = {
        id: Date.now(),
        text,
        date,
        completed: false,
        created: new Date().toISOString()
    }

    tasks[date] = tasks[date] || []
    tasks[date].push(task)
    saveTasks()
    renderTasks()
    taskInput.value = ''
}

function toggleTask(date, id) {
    const task = tasks[date].find(t => t.id === id)
    task.completed = !task.completed
    saveTasks()
    renderTasks()
}

function deleteTask(date, id) {
    tasks[date] = tasks[date].filter(t => t.id !== id)
    saveTasks()
    renderTasks()
}

// 数据持久化
function saveTasks() {
    localStorage.setItem('cyberTasks', JSON.stringify(tasks))
}

// 任务渲染
function renderTasks() {
    const dailyTasks = Object.values(tasks).flat().filter(task => {
        if (currentTab === 'pending') return !task.completed
        if (currentTab === 'completed') return task.completed
        return true
    })
    
    const currentDateObj = new Date(dateInput.value)
    const today = new Date().setHours(0,0,0,0)
    
    taskList.innerHTML = dailyTasks.map((task, index) => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask('${currentDate}', ${task.id})">
                <span class="task-number">${index + 1}.</span>
                <span class="task-text">${task.text}</span>
                <div class="date-display">
                    <span class="current-date">【当前日期】${new Date(currentDate).toLocaleDateString('zh-CN')}</span>
                    <span class="task-date">【待办日期】${new Date(task.date).toLocaleDateString('zh-CN')}</span>
                </div>
                ${currentTab === 'pending' && new Date(task.date).setHours(0,0,0,0) < today ? '<span class="timeout-label">⏰ 已超时</span>' : ''}
            </div>
            <button class="cyber-button delete-btn" 
                    onclick="deleteTask('${currentDate}', ${task.id})">
                ✖️ 删除
            </button>
        </div>
    `).join('')
}

// 事件监听
addBtn.addEventListener('click', addTask)
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask()
})

// 初始渲染
renderTasks()

// 添加选项卡切换事件
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentTab = button.dataset.tab;
    renderTasks();
  });
});