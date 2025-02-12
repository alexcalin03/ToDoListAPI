export default class Notification {
    constructor(id, todo, todoTitle, sender, recipient, message, status, created_at) {
        this.id = id;
        this.todo = todo;
        this.todoTitle = todoTitle;
        this.sender = sender;
        this.recipient = recipient;
        this.message = message;
        this.status = status;
        this.created_at = created_at;
    }
}