import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Service from "../services/service";

const API_URL = "http://localhost:8080";

const ChatRoom = (props) => {

  const [user, setUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [oldMessageList, setOldMessageList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [chatObj, setChatObj] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = socketIOClient(API_URL);

  useEffect(() => {
    Service.checkAuthorized().then(
      (response) => {
        if (response.data.user) {
          setUser(response.data.user);
          socketInitialize(response.data.user);
        }
      },
      (error) => {
        if (error.response.data.message === "No token provided!" || error.response.data.message === "!Unauthorized!") {
          props.history.push("/login");
          window.location.reload();
        } else {
          setUserList([]);
        };
      }
    );
    
    return () => socket.disconnect();

  }, []);

  const socketInitialize = (u) => {
    socket.emit("PublicJoin", u);

    socket.on("OnlineUsers", users => {
      setUserList(users);
    });

    socket.on("Notification", message => {
      var tempData = notificationList
      tempData.unshift(message)
      setNotificationList(tempData);
    });

  };

  const onChangeMessage = (e) => {
    setNewMessage(e.target.value);
  }

  const handleSendMessage = () => {
    if (chatObj._id) {
      var sendData = {
        room: roomName,
        user: Service.authInfo().id,
        receiver: chatObj._id,
        message: newMessage,
      }
      socket.emit("newMessage", sendData);
    }
      
  }
  // const [newMessage, setNewMessage] = useState("");

  // const handleNewMessageChange = (event) => {
  //     setNewMessage(event.target.value);
  // };

  // const handleSendMessage = () => {
  //     sendMessage(newMessage);
  //     setNewMessage("");
  // };

  return (
    <>
      <div className="p-4 row">
        <div className="col-md-3">
          <div className="userWrap">
            <div className="panel panel-primary">
              <div className="panel-heading">
                ONLINE USERs
              </div>
              <div className="panel-body p-2">
                <div className="contact-list my-3">
                  { userList.map((user, index) => (
                      <div key={index} className="contact-user py-2 row m-auto">
                        <div className="col-md-4 col-sm-4">
                          <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                        </div>
                        <div className="col-md-8 col-sm-8 m-auto">
                          <h5>{user.username}</h5>
                        </div>
                      </div>
                    ))
                  }
                  {loading ? (
                    <span className="spinner-border spinner-border-sm d-block mx-auto"></span>
                  ) : (
                      <span></span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="contentWrap">
            <div className="panel panel-primary">
              <div className="panel-heading">
              PUBLIC CHAT ROOM
              </div>
              <div className="panel-body p-2">
                <div className="notifications">
                  { notificationList && (
                    notificationList.map((notification, index) => (
                      <p key={index}>{notification}</p>
                    ))
                  )}
                </div>
                <hr />
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Enter a message:"
                    size="105"
                    value={newMessage}
                    onChange={onChangeMessage}
                  />
                  <span className="input-group-btn">
                    <input type="button"
                      className="btn btn-info"
                      value="SEND"
                      disabled={newMessage? false : true}
                      onClick={handleSendMessage}
                    />
                  </span>
                </div>
                <ul className="media-list">
                  <li className="media">
                    <div className="media-body">
                      <div id="chat">
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div id="notification"></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ChatRoom;