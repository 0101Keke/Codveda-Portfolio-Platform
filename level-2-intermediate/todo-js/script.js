/*State and Storage*/

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let recycleBin = JSON.parse(localStorage.getItem("recycle")) || [];

let activeTopic = "all";
let showTodayOnly = false;

/*Element References*/

const taskTitle = document.getElementById("taskTitle");
const taskTopic = document.getElementById("taskTopic");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const repeatSelect = document.getElementById("repeat");

const topicFilter = document.getElementById("topicFilter");
const todayFilter = document.getElementById("todayFilter");
const addTaskBtn = document.getElementById("addTask");

const columns = {
    todo: document.getElementById("todo"),
    progress: document.getElementById("progress"),
    done: document.getElementById("done")
};

/*Filters*/

topicFilter.onchange = e => {
    activeTopic = e.target.value;
    render();
};

todayFilter.onclick = () => {
    showTodayOnly = !showTodayOnly;
    render();
};

/*Add Tasks*/

addTaskBtn.onclick = () => {
    const title = taskTitle.value.trim();
    const topic = taskTopic.value || "General";
    const date = taskDate.value;
    const time = taskTime.value;
    const repeat = repeatSelect.value;

    if (!title || !date || !time) return;

    const dueTimestamp = new Date(`${date}T${time}`).getTime();

    tasks.push({
        id: Date.now(),
        title,
        topic,
        due: dueTimestamp,          
        repeat,
        status: "todo",
        created: Date.now(),
        completed: null,
        subtasks: []
    });

    saveAndRender();

    taskTitle.value = "";
    taskTopic.value = "";
    taskDate.value = "";
    taskTime.value = "";
    repeatSelect.value = "none";
};

/*Logic*/

function getPriority(due) {
    const diff = (due - Date.now()) / 3600000;
    if (diff <= 24) return "red";
    if (diff <= 72) return "orange";
    return "yellow";
}

/*Render*/

function render() {
    Object.values(columns).forEach(c => c.innerHTML = "");

    tasks
        .filter(task => {
            if (activeTopic !== "all" && task.topic !== activeTopic) return false;

            if (showTodayOnly) {
                const today = new Date().toDateString();
                return new Date(task.due).toDateString() === today;
            }

            return true;
        })
        .forEach(task => {
            const div = document.createElement("div");
            const priority = task.status === "done" ? "green" : getPriority(task.due);

            div.className = `task ${priority}`;
            div.draggable = true;

            div.innerHTML = `
                <button class="delete-btn" title="Delete Task">✕</button>
                <strong>${task.title}</strong>
                <small>${task.topic}</small>
                <small>Due: ${new Date(task.due).toLocaleString()}</small>
                ${task.status !== "done" ? `<small>⌛ ${countdown(task.due)}</small>` : ""}
                ${task.completed ? `<small>✅ Completed: ${new Date(task.completed).toLocaleString()}</small>` : ""}
            `;

            /*Delete*/
            div.querySelector(".delete-btn").onclick = () => {
                recycleBin.push(task);
                tasks = tasks.filter(t => t.id !== task.id);
                saveAndRender();
            };

            /*Drag*/
            div.ondragstart = e => e.dataTransfer.setData("id", task.id);

            /*Subtasks only for "In Progress"*/
            if (task.status === "progress") {
                const subDiv = document.createElement("div");
                subDiv.className = "subtasks";

                task.subtasks.forEach(s => {
                    const label = document.createElement("label");
                    label.innerHTML = `
                        <input type="checkbox" ${s.done ? "checked" : ""}>
                        ${s.text}
                    `;

                    label.querySelector("input").onchange = () => {
                        s.done = !s.done;

                        if (task.subtasks.length && task.subtasks.every(st => st.done)) {
                            task.status = "done";
                            task.completed = Date.now();
                        }

                        saveAndRender();
                    };

                    subDiv.appendChild(label);
                });

                const input = document.createElement("input");
                input.placeholder = "Add subtask...";
                input.onkeydown = e => {
                    if (e.key === "Enter" && input.value.trim()) {
                        task.subtasks.push({ text: input.value.trim(), done: false });
                        saveAndRender();
                    }
                };

                subDiv.appendChild(input);
                div.appendChild(subDiv);
            }

            columns[task.status].appendChild(div);
        });

    updateTopicFilter?.();
}

/*Countdown*/

function countdown(due) {
    const diff = due - Date.now();
    if (diff <= 0) return "Expired";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
}

/*Drag and Drop*/

document.querySelectorAll(".column").forEach(col => {
    col.ondragover = e => e.preventDefault();

    col.ondrop = e => {
        const id = +e.dataTransfer.getData("id");
        const task = tasks.find(t => t.id === id);

        task.status = col.dataset.status;

        if (task.status === "done") {
            task.completed = Date.now();

            setTimeout(() => {
                recycleBin.push(task);
                tasks = tasks.filter(t => t.id !== task.id);
                saveAndRender();
            }, 86400000);
        } else {
            task.completed = null;
        }

        saveAndRender();
    };
});

/*Save and Render*/

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("recycle", JSON.stringify(recycleBin));
    render();
}

/*Auto Refresh*/

setInterval(render, 60000);
render();
