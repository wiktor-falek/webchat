class ClientHandler {
    constructor() {
        this._id = 0;
        this.onlineUsers = {};
    }
    add(client) {
        client.id = this._id;
        this._id += 1;
        this.onlineUsers[client.id] = client;
    }
    remove(client) {
        delete this.onlineUsers[client.id];
    }
    logClients() {
        console.log(this.onlineUsers);
    }
}

export default new ClientHandler();