import Todo from "../models/Todo.js";
import { updateUIState } from "./index.js";
export let activeTodoId = null;
export const setActiveTodoId = (id) => {
    activeTodoId = id;
};


 export const fetchTodos = async(API_BASE) =>{
    // try
    const token = localStorage.getItem('authToken');
    if(!token){
        throw new Error('No token found');
    }
    const response = await fetch(`${API_BASE}/user_todos/`,{
        method:'GET',
        headers:{
             "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        }});
        if(!response.ok){
            throw new Error('Error fetching todos');
            return[];
        }
        const data = await response.json();
        return data.map(todo => new Todo(todo.id, todo.title, todo.description, todo.due_date, todo.priority, todo.project_id));
};

export const renderWholeTodo=(todo)=>{
        const content = document.getElementById('todocontent');
        content.innerHTML='';
        const title = document.createElement('h2');
        title.textContent=todo.title;
        const description = document.createElement('p');
        description.textContent = todo.description;
        todocontent.appendChild(title);
        todocontent.appendChild(description);
};

export const populateEditTodoForm = (projects, todo) => {
    const projectDropdown = document.getElementById('edit-todo-project');
    projectDropdown.innerHTML = '';

    const noneOption = document.createElement('option');
    noneOption.value = ''; // Empty value for "None"
    noneOption.textContent = 'None'; // Display text
    projectDropdown.appendChild(noneOption);

    projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id; // Use project.id for the option value
        option.textContent = project.name; // Display project name
        projectDropdown.appendChild(option);
    });

    if (todo.project_id) {
        projectDropdown.value = todo.project_id; // Set the dropdown's value to the correct project ID
    } else {
        projectDropdown.value = ''; 
    }
    const titleInput = document.getElementById('edit-todo-title');
    const descriptionTextarea = document.getElementById('edit-todo-description');
    const dueDateInput = document.getElementById('edit-todo-due-date');
    const priorityInput = document.getElementById('edit-todo-priority');

    titleInput.value = todo.title || '';
    descriptionTextarea.value = todo.description || '';
    dueDateInput.value = todo.dueDate || '';
    priorityInput.value = todo.priority || '';

};



export const openEditTodoPopup = (todo, projects) => {
    const editPopup = document.getElementById('edit-todo-popup');
    const titleInput = document.getElementById('edit-todo-title');
    const descriptionTextarea = document.getElementById('edit-todo-description');
    const dueDateInput = document.getElementById('edit-todo-due-date');
    const priorityInput = document.getElementById('edit-todo-priority');

    // Populate the fields with the current todo data
    titleInput.value = todo.title;
    descriptionTextarea.value = todo.description;
    dueDateInput.value = todo.due_date;
    priorityInput.value = todo.priority;

    // Populate the project dropdown
    populateProjectDropdown(projects);

    // Set the current project as selected
    const projectDropdown = document.getElementById('edit-todo-project');
    projectDropdown.value = todo.project;

    // Show the popup
    editPopup.classList.remove('hidden');
};


 export const renderTodos = (todos) =>{
    const content = document.getElementById('content');
    content.innerHTML = '';

    const removeActiveClass = () => {
        const allTodoItems = content.querySelectorAll('.todo-item');
        allTodoItems.forEach(item => item.classList.remove('active'));
    };

    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        todoDiv.setAttribute('data-text', `${todo.title} - ${todo.priority} (${todo.dueDate})`);
        todoDiv.onclick=()=>{
            removeActiveClass();
          todoDiv.classList.add('active');
          setActiveTodoId(todo.id);
             renderWholeTodo(todo);
             updateUIState();
            }
             content.appendChild(todoDiv);
    });
};

export const addTodo = async (API_BASE, todo) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`${API_BASE}/create_todo/`, {
            method: 'POST',
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get error details from the backend
            throw new Error(errorData.error || 'Error adding todo');
        }

        const data = await response.json(); // Parse the response
        return data; // Return the response for further processing
    } catch (error) {
        console.error('Error in addTodo:', error.message); // Log error details
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

export const deleteTodo = async (API_BASE, todoId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/delete_todo/${todoId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting todo');
    }

    const data = await response.json();
    const content = document.getElementById('todocontent');
    content.innerHTML = '';
    return data;
};

export const editTodo = async (API_BASE, todoId, todo) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`${API_BASE}/update_todo/${todoId}/`, {
            method: 'PUT',
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            throw new Error(errorData.error || 'Error editing todo');
        }

        const data = await response.json();
        console.log('Edited todo:', data);
    } catch (error) {
        console.error('Error editing todo:', error.message);
        throw error;
    }
};

