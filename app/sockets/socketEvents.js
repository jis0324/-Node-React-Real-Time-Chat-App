// const Chat = require('../models/chat');
// const SocketEvents = require('../config/config');
const { json } = require("body-parser");
const controller = require("../controllers/controller");
const _ = require('lodash');

exports = module.exports = function(io) {

    var publicRoomUsers = [];
    var publicRoom = "PublicRoom";
    // var socketUsers = {};
    // var users = [];
    // var countChat = 0;

    // //Set Listeners
    io.sockets.on( "connection", function (socket) {

        socket.on("PublicJoin", function (user) {
            delete user.roles;
            delete user.password;
            delete user.__v;

            if (!containsObject(user, publicRoomUsers)) {
                publicRoomUsers.push(user);
            }

            socket.username = user.username;
            socket.join(publicRoom);

            // echo to client they've connected
            socket.emit("Notification", '🔵 you have connected to ' + publicRoom);
            socket.emit("OnlineUsers", publicRoomUsers);

            // echo to selected group that a person has connected to their group
            socket.broadcast.to(publicRoom).emit("Notification", '🔵' + socket.username + ' has connected to this room');
            socket.broadcast.to(publicRoom).emit("OnlineUsers", publicRoomUsers);
        });
        
        socket.on("disconnect", () => {
            var existFlag = false;
            for (let i = 0; i < publicRoomUsers.length; i++) {
                if (publicRoomUsers[i].username == socket.username) {
                    existFlag = true;
                    publicRoomUsers.splice(i, 1);
                    break;
                }
            }
            
            if (existFlag) {
                socket.broadcast.to(publicRoom).emit("Notification", '🔴 ' + socket.username + ' has disconnected');
                socket.broadcast.to(publicRoom).emit("OnlineUsers", publicRoomUsers);
                socket.leave(publicRoom);
            }
        });
        
        // socket.on("disconntect", function (data) {
        //     if (!socket.nickname) return;
        //     for (i = 0; i < users.length; i++) {
        //         if (users[i][0] == socket.nickname) {
        //             if (users[i][1] == socket.room) {
        //                 users.splice(i, 1)
        //                 break;
        //             }
        //         }
        //     }
        //     // userlist update
        //     updateNicknames([socket.nickname, socket.room]);
        //     // echo globally that this client has left
        //     socket.broadcast.to(socket.room).emit(SocketEvents.updatechat, '🔴', socket.nickname + ' has disconnected');
        //     delete socketUsers[socket.nickname+'_'+socket.room];
    
        //     socket.leave(socket.room);
        // });

        
        // // New Message
        // socket.on("newMessage", async data => {
        //     await controller.saveNewMessage(data);
        //     io.emit("newMessage", data);
        // });




        // private room join
        // socket.on(SocketEvents.privateRoomJoin, function (roomName, callback) {
        //     if (privateRooms.includes(roomName)) {
        //         callback(true);
        //     } else {
        //         callback(false)
        //     }
        // })

    
    //     // public room save
    //     socket.on(SocketEvents.publicRoomSave, function (roomName, callback) {
    //         if (publicRooms.includes(roomName)) {
    //             callback(false);
    //         } else {
    //             callback(true)
    //             publicRooms.push(roomName);
    
    //             socket.emit(SocketEvents.updaterooms, publicRooms);
    //             socket.broadcast.emit(SocketEvents.updaterooms, publicRooms);
    //         }
    //     })
   
    
    //     socket.on(SocketEvents.singleUser, function (data, callback) {
    //         var singleRoom = data[1] + Math.floor(countChat / 2);
    //         data = [data[0], singleRoom];
    //         if (isArrayInArray(users, data)) {
    //             callback('repeat');
    //         } else {
    //             callback('true');
    //             users.push(data);
    //             socket.nickname = data[0];
    //             socket.room = data[1];
    //             socketUsers[socket.nickname+'_'+socket.room] = socket;
    //             socket.join(data[1]);
    //             updateNicknames(data);
    
    //             // echo to client they've connected
    //             socket.emit(SocketEvents.updatechat, '🔵', 'you have connected to ' + singleRoom);
    //             // echo to selected group that a person has connected to their group
    //             socket.broadcast.to(data[1]).emit(SocketEvents.updatechat, '🔵', socket.nickname + ' has connected to this room');
    //         }
    //         countChat++;
    //     });
    
    //     socket.on(SocketEvents.newUser, function (data, callback) {
    //         if (isArrayInArray(users, data)) {
    //             callback(false);
    //         }
    //         else {
    //             callback(true);
    //             users.push(data);
    //             socket.nickname = data[0];
    //             socket.room = data[1];
    //             socketUsers[socket.nickname+'_'+socket.room] = socket;
    //             updateNicknames(data);
    
    //             // add the client's username to the global list
    //             // send client to selected group
    //             socket.join(data[1]);
    
    //             // old chat display
    //             Chat.find({ 'group': socket.room }, function (err, docs) {
    //                 if (err) throw err;
    //                 socket.emit(SocketEvents.loadOldMsgs, docs);
    //             })
    
    //             // echo to client they've connected
    //             socket.emit(SocketEvents.updatechat, '🔵', 'you have connected to ' + data[1]);
    //             // echo to selected group that a person has connected to their group
    //             socket.broadcast.to(data[1]).emit(SocketEvents.updatechat, '🔵', socket.nickname + ' has connected to this room');
    //         }
    //     })
    
    //     socket.on(SocketEvents.sendMessage, function (msg, blockList, callback) {
    //         var newMsg = new Chat({ nick: socket.nickname, group: socket.room, msg: msg });
    //         newMsg.save(function (err) {
    //             if (err) throw err;
    //             io.sockets.in(socket.room).emit(SocketEvents.newMessage, { nick: socket.nickname, group: socket.room, msg: msg , blockList: blockList })
    //         })
    //     });
    
    //     socket.on(SocketEvents.sendIndividualMessage, function (data, callback) {
    //         var senderKey = data[1] + '_' + socket.room;
    //         var socketId = socketUsers[senderKey].id;
    //         socket.broadcast.to(socketId).emit(SocketEvents.individualChat, {sender: socket.nickname, group: socket.room, reciever: data[1], msg: data[2]});
    //         socket.emit(SocketEvents.myChat, {sender: socket.nickname, group: socket.room, reciever: data[1], msg: data[2]});
    //     })
    
    //     socket.on(SocketEvents.disconnect, function (data) {
    //         if (!socket.nickname) return;
    //         for (i = 0; i < users.length; i++) {
    //             if (users[i][0] == socket.nickname) {
    //                 if (users[i][1] == socket.room) {
    //                     users.splice(i, 1)
    //                     break;
    //                 }
    //             }
    //         }
    //         // userlist update
    //         updateNicknames([socket.nickname, socket.room]);
    //         // echo globally that this client has left
    //         socket.broadcast.to(socket.room).emit(SocketEvents.updatechat, '🔴', socket.nickname + ' has disconnected');
    //         delete socketUsers[socket.nickname+'_'+socket.room];
    
    //         socket.leave(socket.room);
    //     });

    //     function isArrayInArray(arr, item) {
    //         var item_as_string = JSON.stringify(item);
        
    //         var contains = arr.some(function (ele) {
    //             return JSON.stringify(ele) === item_as_string;
    //         });
    //         return contains;
    //     }

    //     function updateNicknames(data) {
    //         var displayUsers = [];
    //         for (i = 0; i < users.length; i++) {
    //             if (users[i][1] == data[1]) {
    //                 displayUsers.push(users[i][0]);
    //             }
    //         }
    //         socket.broadcast.to(data[1]).emit(SocketEvents.usernames, displayUsers);
    //         socket.emit(SocketEvents.usernames, displayUsers);
    //     }
    });

    const getApiAndEmit = socket => {
        const response = new Date();
        // Emitting a new message. Will be consumed by the client
        socket.emit("FromAPI", response);
    };

    const containsObject = (obj, list) => {
        for (const item of list) {
            if (_.isEqual(obj, item)) {
                return true;
            }
        }
        return false;
    }
}