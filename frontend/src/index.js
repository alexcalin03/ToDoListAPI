import './styles.css';
import { fetchProjects, renderProjects, createProject, activeProjectId, deleteProject, editProject } from './ManageProjects.js';
import { fetchTodos, renderTodos, addTodo, activeTodoId, deleteTodo, populateEditTodoForm , editTodo, renderWholeTodo} from './ManageTodos.js';
import { fetchNotifications, renderNotifications, sendNotification, respondToNotification, updateNotificationCounter, markInformationalAsResponded, markAllAsCleared } from './ManageNotifications.js';
import { logoutUser } from './api_requests.js';

console.log("Hello.Webpack");
const API_BASE = "http://127.0.0.1:8000";

const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const logoutButton = document.getElementById('logout-button');
const accountButton = document.getElementById('account-button');

menuIcon.addEventListener('click', () => {
    menu.classList.toggle('show');
});
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
        menu.classList.remove('show');
    }
});

  export function updateUIState() {
    const deleteProjectButton = document.getElementById('delete-project-button');
    const deleteTodoButton = document.getElementById('delete-todo-button');
    const editProjectButton = document.getElementById('edit-project-button');
    const editTodoButton = document.getElementById('edit-todo-button');

    // If no project selected or on "All todos", hide the delete project button
    if (!activeProjectId) {
        deleteProjectButton.classList.add('hidden');
        editProjectButton.classList.add('hidden');

        
    } else {
        deleteProjectButton.classList.remove('hidden');
        editProjectButton.classList.remove('hidden');
        
    }

    // If no todo selected, hide the delete todo button
    if (!activeTodoId) {
        deleteTodoButton.classList.add('hidden');
        editTodoButton.classList.add('hidden');
    } else {
        deleteTodoButton.classList.remove('hidden');
        editTodoButton.classList.remove('hidden');
    }
}




document.addEventListener('DOMContentLoaded', async() => {
    const addProjectButton = document.getElementById('add-project-button');
    const addTodoButton = document.getElementById('add-todo-button');
    const projectPopup = document.getElementById('add-project-popup');
    const todoPopup = document.getElementById('add-todo-popup');
    const closeProjectPopup = document.getElementById('close-project-popup');
    const closeTodoPopup = document.getElementById('close-todo-popup');
    const addProjectForm = document.getElementById('add-project-form');
    const addTodoForm = document.getElementById('add-todo-form');
    const deleteProjectButton = document.getElementById('delete-project-button');
    const deleteTodoButton = document.getElementById('delete-todo-button');
    const deleteTodoPopup = document.getElementById('delete-todo-popup');
    const deleteProjectPopup = document.getElementById('delete-project-popup');
    const closeDeleteProjectPopup = document.getElementById('close-delete-project-popup');
    const closeDeleteTodoPopup = document.getElementById('close-delete-todo-popup');
    const deleteProjectConfirmation = document.getElementById('delete-project-confirmation');
    const deleteTodoConfirmation = document.getElementById('delete-todo-confirmation');
    const editProjectPopup = document.getElementById('edit-project-popup');
    const editProjectButton = document.getElementById('edit-project-button');
    const editProjectForm = document.getElementById('edit-project-form');
    const closeEditProjectPopup = document.getElementById('close-edit-project-popup');
    const editTodoPopup = document.getElementById('edit-todo-popup');
    const editTodoButton = document.getElementById('edit-todo-button');
    const closeEditTodoPopup = document.getElementById('close-edit-todo-popup');
    const editTodoForm = document.getElementById('edit-todo-form');
    const notificationPopup = document.getElementById('notification-popup');
    const notificationButton = document.getElementById('notification-button');
    const closeNotificationPopup = document.getElementById('close-notification-popup');
    const sendNotificationButton = document.getElementById('send-notification-button');
    const sendNotificationForm = document.getElementById('send-notification-form');
    const sendNotificationPopup = document.getElementById('send-notification-popup');
    const closeSendNotificationPopup = document.getElementById('close-send-notification-popup');
    const clearNotificationsButton = document.getElementById('clear-notifications');

    sendNotificationButton.addEventListener('click', () => {
        sendNotificationPopup.classList.remove('hidden');
    });

    closeSendNotificationPopup.addEventListener('click', () => {
        sendNotificationPopup.classList.add('hidden');
    });

    notificationButton.addEventListener('click', async () => {
        notificationPopup.classList.remove('hidden');
        await markInformationalAsResponded(API_BASE);
    });

    clearNotificationsButton.addEventListener('click', async () => {
        await markAllAsCleared(API_BASE);
        const updatedNotifications = await fetchNotifications(API_BASE);
        await renderNotifications(updatedNotifications);
    });

    closeNotificationPopup.addEventListener('click',async () => {
        notificationPopup.classList.add('hidden');
        const notifications = await fetchNotifications(API_BASE);
        renderNotifications(notifications);
        updateNotificationCounter(notifications);
    });

    notificationPopup.addEventListener('click', (e) => {
        if (!e.target.closest('.popup-content')) {
            notificationPopup.classList.add('hidden');
        }
    });


    editProjectButton.addEventListener('click', () => {
        editProjectPopup.classList.remove('hidden');
    });

    closeEditProjectPopup.addEventListener('click', () => {
        editProjectPopup.classList.add('hidden');
    });

    editTodoButton.addEventListener('click', async () => {
        try {
            const projects = await fetchProjects(API_BASE);
            const todos = await fetchTodos(API_BASE);
            const todo = todos.find((t) => t.id === activeTodoId);
    
            if (!todo) {
                throw new Error('Todo not found');
            }
    
            populateEditTodoForm(projects, todo); // Pass the specific todo
            editTodoPopup.classList.remove('hidden');
        } catch (error) {
            console.error('Error opening edit todo popup:', error);
            alert('Failed to open edit todo popup');
        }
    });
    

    closeEditTodoPopup.addEventListener('click', () => {
        editTodoPopup.classList.add('hidden');
    });




     // Show pop-up when buttons are clicked
     addProjectButton.addEventListener('click', () => {
        projectPopup.classList.remove('hidden');
    });

    addTodoButton.addEventListener('click', () => {
        todoPopup.classList.remove('hidden');
    });

    // Hide pop-up when "Cancel" buttons are clicked
    closeProjectPopup.addEventListener('click', () => {
        projectPopup.classList.add('hidden');
    });

    closeTodoPopup.addEventListener('click', () => {
        todoPopup.classList.add('hidden');
    });

    deleteProjectButton.addEventListener('click', async () => {
        deleteProjectPopup.classList.remove('hidden');

    });

    deleteTodoButton.addEventListener('click', async () => {
        deleteTodoPopup.classList.remove('hidden');
    });

    closeDeleteProjectPopup.addEventListener('click', () => {
        deleteProjectPopup.classList.add('hidden');
    });

    closeDeleteTodoPopup.addEventListener('click', () => {
        deleteTodoPopup.classList.add('hidden');
    });

    





    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
    } else {
        
        
        // Proceed with showing the app
    }

    try{
        const projects = await fetchProjects(API_BASE);
        const todos = await fetchTodos(API_BASE);
        console.log(token);
        renderProjects(projects, todos, renderTodos);
        renderTodos(todos);
        const notifications = await fetchNotifications(API_BASE);
        console.log(notifications);
        renderNotifications(notifications);
        updateNotificationCounter(notifications);


        updateUIState();


    }catch(error){
        console.error('Error fetching projects, todos or notifications', error);
        alert('Error fetching projects, todos or notifications');
    };

    logoutButton.addEventListener('click', async () => {
        try {
            await logoutUser();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error logging out user', error);
            alert('Error logging out user');
        }
    });

    accountButton.addEventListener('click', (e) => {
        window.location.href = 'account.html';
    });

    addProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const projectName = document.getElementById('project-name').value;
        try {
            await createProject(API_BASE, projectName);
            const projects = await fetchProjects(API_BASE);
            const todos = await fetchTodos(API_BASE);
            renderProjects(projects, todos, renderTodos);
            projectPopup.classList.add('hidden');
        }catch(error){
            console.error('Error creating project', error);
            alert('Error creating project');
        }
    });

    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('todo-title').value;
        const description = document.getElementById('todo-description').value;
        const due_date = document.getElementById('todo-due-date').value;
        const priority = document.getElementById('todo-priority').value;
        const todo = { title, description, due_date, priority, project: activeProjectId };
        try {
            await addTodo(API_BASE, todo);
            const todos = await fetchTodos(API_BASE);
            renderTodos(todos);
            const projects = await fetchProjects(API_BASE);
            renderProjects(projects, todos, renderTodos);
            todoPopup.classList.add('hidden');
        } catch (error) {
            console.error('Error adding todo', error);
            alert('Error adding todo');
        }
    });

    deleteProjectConfirmation.addEventListener('click', async () => {
        try {
            await deleteProject(API_BASE, activeProjectId);
            const projects = await fetchProjects(API_BASE);
            const todos = await fetchTodos(API_BASE);
            renderProjects(projects, todos, renderTodos);
            deleteProjectPopup.classList.add('hidden');
        } catch (error) {
            console.error('Error deleting project', error);
            alert('Error deleting project');
        }
    });

    deleteTodoConfirmation.addEventListener('click', async () => {
        try {
            await deleteTodo(API_BASE, activeTodoId);
            const todos = await fetchTodos(API_BASE);
            const projects = await fetchProjects(API_BASE);
            renderTodos(todos);
            renderProjects(projects, todos, renderTodos);
            deleteTodoPopup.classList.add('hidden');
        } catch (error) {
            console.error('Error deleting todo', error);
            alert('Error deleting todo');
        }
    });

    editProjectForm.addEventListener('submit', async (e) => {
       e.preventDefault();
       const projectName = document.getElementById('edit-project-name').value;
       try {
           await editProject(API_BASE,activeProjectId, projectName);
           const projects = await fetchProjects(API_BASE);
           const todos = await fetchTodos(API_BASE);
           renderProjects(projects, todos, renderTodos);
           editProjectPopup.classList.add('hidden');
       } catch (error) {
           console.error('Error editing project', error);
           alert('Error editing project');
       }
    
    });

    editTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-todo-title').value;
        const description = document.getElementById('edit-todo-description').value;
        const dueDate = document.getElementById('edit-todo-due-date').value;
        const priority = document.getElementById('edit-todo-priority').value;
        const project = document.getElementById('edit-todo-project').value;
        const updatedTodo = { title, description, dueDate, priority, project };
    
        try {
            await editTodo(API_BASE, activeTodoId, updatedTodo);
            const todos = await fetchTodos(API_BASE);
            const currentTodo = todos.find((t) => t.id === activeTodoId);
            const projects = await fetchProjects(API_BASE);
            
            renderTodos(todos);
            renderProjects(projects, todos, renderTodos);
    
            if (currentTodo) {
                renderWholeTodo(currentTodo);
            } else {
                console.error('Todo not found after update.');
            }
    
            editTodoPopup.classList.add('hidden');
        } catch (error) {
            console.error('Error editing todo', error);
            alert('Error editing todo');
        }
    });

    sendNotificationForm.addEventListener('submit', async (e) =>{
        e.preventDefault();

        // Gather data from form fields
        const title = document.getElementById('send-todo-title').value;
        const description = document.getElementById('send-todo-description').value;
        const due_date = document.getElementById('send-todo-due-date').value;
        const priority = document.getElementById('send-todo-priority').value;
        const recipient = document.getElementById('send-todo-user').value;

        const notificationPayload = {
            title,
            description,
            due_date,
            priority,
            recipient,
        };

        try {
            const response = await sendNotification(API_BASE, notificationPayload);
            alert('Notification sent successfully!');
            sendNotificationPopup.classList.add('hidden');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Error sending notification. Please try again.');
        }
    });
    

    

});


    