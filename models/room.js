class Room{
  constructor() {
    this.users=[]
  }
  addUser(id, name, room) {
    const user = { id, name, room}
    this.users.push(user);
    return user;
   }

  findUserById(id) { 
  return this.user.find(item => id == item.id);
  }
  findUserByIndex(id) {
    return this.user.findIndex(item => id == item.id);
  }
  removeUserById(id) { 
    const index = this.findUserByIndex(id);
    const removeUser = this.users[index];
    this.users.slice(index, 1);
    return removeUser;
  }


  findUserByRoomName(roomName) {
    return this.users.filter(el =>  el.room===roomName)
  }
}

module.exports = Room;