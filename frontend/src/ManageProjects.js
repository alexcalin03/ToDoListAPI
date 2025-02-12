 import Project from "../models/Project.js";
 import { updateUIState } from "./index.js";
 import { setActiveTodoId, activeTodoId } from "./ManageTodos.js";
 export let activeProjectId = null;
 export const setActiveProjectId = (id) => {
  activeProjectId = id;
 };


 
 export const fetchProjects = async(API_BASE) =>{
  const token = localStorage.getItem('authToken');
  if(!token){
    throw new Error('No token found');
  }
  const response = await fetch(`${API_BASE}/user_projects/`,{
    headers:{
      'Authorization': `Token ${token}`,
      "Content-Type": "application/json",
      },
      });

    if(!response.ok){
      throw new Error('Error fetching projects');
      return[];
      }
      const data = await response.json();
      return data.map(project => new Project(project.id, project.name));

   }
  ;

export const renderProjects = (projects, todos, renderTodosCallback) => {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  const removeActiveClass = () => {
      const allProjectItems = sidebar.querySelectorAll('.project-item');
      allProjectItems.forEach(item => item.classList.remove('active'));
  };

  const clearTodoContent = () =>{
    const todoContent = document.getElementById('todocontent');
    todoContent.innerHTML='';
  }

  const defaultProject = document.createElement('div');
  defaultProject.setAttribute('data-text', 'All todos');
  defaultProject.classList.add('project-item');
  defaultProject.onclick = () => {
      removeActiveClass();
      defaultProject.classList.add('active');
      setActiveProjectId(null);
      console.log("TODO URI PROSTEA", todos);
      renderTodosCallback(todos);
      updateUIState();
  };
  sidebar.appendChild(defaultProject);
  projects.forEach(project => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-item');
      projectDiv.setAttribute('data-text', project.name);
      projectDiv.onclick = () => {
          removeActiveClass();
          clearTodoContent();
          projectDiv.classList.add('active');
          setActiveProjectId(project.id);
          setActiveTodoId(null);
          const filteredTodos = todos.filter(todo => Number(todo.project_id) === project.id);
          renderTodosCallback(filteredTodos);
          updateUIState();
      };
      sidebar.appendChild(projectDiv);
  });
};

export const createProject = async (API_BASE, name) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      throw new Error('No token found');
  }

  try {
      const response = await fetch(`${API_BASE}/create_project/`, {
          method: 'POST',
          headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
      });

      if (!response.ok) {
          throw new Error('Failed to create project');
      }

      const data = await response.json();

      // Fetch and re-render projects after creating a new one
      const projects = await fetchProjects(API_BASE);
      renderProjects(projects);
  } catch (error) {
      console.error('Error creating project:', error);
      alert('An error occurred while creating the project.');
  }
};

export const deleteProject = async (API_BASE, projectId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE}/delete_project/${projectId}/`, {
      method: 'DELETE',
      headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
      }
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error deleting project');
  }

  const data = await response.json();
  return data;
};

export const editProject = async (API_BASE, project_id, name) => {
  if (!name || typeof name !== 'string') {
      throw new Error('Invalid project name');
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
      throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE}/update_project/${project_id}/`, {
      method: 'PUT',
      headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Error updating project');
  }

  const data = await response.json();
  return data;
};

