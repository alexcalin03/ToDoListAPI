import Notification from "../models/Notification";
const API_BASE = "http://127.0.0.1:8000";
import { fetchTodos,renderTodos,renderWholeTodo } from "./ManageTodos";
import { fetchProjects, renderProjects } from "./ManageProjects";



export const fetchNotifications = async(API_BASE) =>{
    const token = localStorage.getItem('authToken');
    if(!token){
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/notifications/`,{
        method: 'GET',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        }
    });

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching notifications');
    }

    const data = await response.json();
    console.log('Notifications response:', data);
    const notifications = data.map(notification => new Notification(
        notification.id,
        notification.todo__id,
        notification.todo__title,
        notification.sender__username,
        notification.recipient__username,
        notification.message,
        notification.status,
        notification.created_at
    ));

    return notifications;
};

export const renderNotifications = (notifications) =>{
    const notificationPopup = document.getElementById('notification-popup');
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';
    console.log('Notifications:', notifications);
    if (notifications.every(notification => notification.status === 'Cleared')){
        const noNotifications = document.createElement('p');
        noNotifications.textContent = 'No notifications at the moment.';
        notificationList.appendChild(noNotifications);
        return;
    };

    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        
        // Apply different classes based on notification status
        if (notification.status === 'Pending') {
            notificationItem.classList.add('pending-notification');
            notificationItem.innerHTML = `
                <p>${notification.message}</p>
                <button class="accept-notification" data-id="${notification.id}">Accept</button>
                <button class="decline-notification" data-id="${notification.id}">Decline</button>
            `;
        } else if (notification.status === 'Informational') {
            notificationItem.classList.add('informational-notification');
            notificationItem.innerHTML = `
                <p>${notification.message}</p>
            `;
        } else if (notification.status === 'Responded') {
            notificationItem.classList.add('responded-notification');
            notificationItem.innerHTML = `
                <p>${notification.message}</p>
            `;
        } 
    
        notificationList.appendChild(notificationItem);
    });
    

    notificationList.addEventListener('click', async (e) => {
        const notificationId = e.target.dataset.id;
        if (!notificationId) return;
    
        try {
            if (e.target.classList.contains('accept-notification')) {
                const notificationPopup = document.getElementById('notification-popup');
                await respondToNotification(API_BASE, notificationId, 'accept');
                const projects = await fetchProjects(API_BASE);
                const todos = await fetchTodos(API_BASE);
                renderProjects(projects, todos, renderTodos);
                renderTodos(todos);
                const updatedNotifications = await fetchNotifications(API_BASE);
                renderNotifications(updatedNotifications);
                await markInformationalAsResponded(API_BASE);
                updateNotificationCounter(updatedNotifications);
                notificationPopup.classList.add('hidden');
                console.log('Notification accepted:', notificationId);


            } else if (e.target.classList.contains('decline-notification')) {
                const notificationPopup = document.getElementById('notification-popup');
                await respondToNotification(API_BASE, notificationId, 'decline');
                const projects = await fetchProjects(API_BASE);
                const todos = await fetchTodos(API_BASE);
                renderProjects(projects, todos, renderTodos);
                renderTodos(todos);
                const updatedNotifications = await fetchNotifications(API_BASE);
                renderNotifications(updatedNotifications);
                await markInformationalAsResponded(API_BASE);
                updateNotificationCounter(updatedNotifications);
                notificationPopup.classList.add('hidden');
                console.log('Notification declined:', notificationId);
            }
        } catch (error) {
            console.error('Error responding to notification:', error);
            alert('Failed to respond to notification.');
        }
    });
};

export const sendNotification = async (API_BASE, notificationPayload) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`${API_BASE}/send_notification/`, {
            method: 'POST',
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
            let errorMessage = 'Error sending notification';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
                console.error('Failed to parse error response', parseError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in sendNotification:', error.message);
        throw error;
    }
};


export const respondToNotification = async(API_BASE, notificationId, status) =>{
    const token = localStorage.getItem('authToken');
    if(!token){
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/respond_notification/${notificationId}/`,{
        method: 'POST',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: status }),

    });

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error responding to notification');
    }

    const data = await response.json();
    return data;
};

export const updateNotificationCounter = (notifications) => {
    const counter = document.getElementById('notification-counter');
    const unreadCount = notifications.filter(notification => notification.status === 'Informational' || notification.status==='Pending').length;

    if (unreadCount > 0) {
        counter.textContent = unreadCount;
        counter.classList.remove('hidden');
    } else {
        counter.textContent = 0;
        counter.classList.add('hidden');
    }
};

export const markInformationalAsResponded = async (API_BASE) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/mark_informational_as_responded/`, {
        method: 'POST',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error marking informational notifications as responded');
    }

    return await response.json();
};

export const markAllAsCleared = async (API_BASE) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/mark_all_as_cleared/`, {
        method: 'POST',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error marking all notifications as cleared');
    }

    return await response.json();
};

