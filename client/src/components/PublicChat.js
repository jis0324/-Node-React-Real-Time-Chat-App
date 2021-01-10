import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import Service from "../services/service";

const API_URL = "http://localhost:8080";

const ChatRoom = (props) => {
  const messagesEndRef = useRef(null);
  
  const [user, setUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  // const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  // const [searchFlag, setSearchFlag] = useState(false);
  const [chatObj, setChatObj] = useState({});
  const [newMessage, setNewMessage] = useState("");
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
        if (error.response.data.message === "No token provided!" || error.response.data.message === "Unauthorized!") {
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

    socket.on("OldPublicMessages", messages => {
      setMessageList(messages);
      scrollToBottom();
    });

    socket.on("Notification", message => {
      var tempList = notificationList
      tempList.unshift(message)
      tempList = tempList.slice(0, 5);
      setNotificationList(tempList);
    });

  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  socket.on("NewMsgUpdate", newmsg => {
    updateMsgList(newmsg);
    scrollToBottom();
  });

  const updateMsgList = (message) => {
    console.log(messageList)
    setMessageList(prev => prev.concat(message));
  }

  const onChangeMessage = (e) => {
    setNewMessage(e.target.value);
  }

  const handleSendMessage = () => {
    var sendData = {
      user: Service.authInfo().id,
      message: newMessage,
    }

    setNewMessage("");
    socket.emit("PublicNewMsg", sendData);
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
      <div className="px-3 row">
        <div className="col-md-4">
          <div className="userWrap">
            <div className="panel panel-primary">
              <div className="panel-heading">
                ONLINE USERs
              </div>
              <div className="panel-body p-2">
                <div className="contact-list my-3">
                  { userList.map((onlineuser, index) => (
                      <div key={index} className={"contact-user py-2 row m-auto " + (user.username === onlineuser.username ? 'active' : '')}>
                        <div className="col-md-4 col-sm-4">
                          <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                        </div>
                        <div className="col-md-8 col-sm-8 m-auto">
                          <h5>{onlineuser.username}</h5>
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
        <div className="col-md-8">
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
                  <hr />
                </div>
                <ul className="chat-list">
                  { messageList.map((message, index) => (
                    <li className="media" key={index}>
                      <div className="chat-body">
                        <div className="contact-user py-2 row m-auto">
                          <div className="mr-3">
                            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                          </div>
                          <div className="">
                            <div className="d-flex">
                              <b className="mr-2">{message.user.username}</b>
                              <span><small>{message.date.split("T")[0]}</small></span>
                            </div>
                            <span>{message.message}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  <div ref={messagesEndRef} />
                </ul>
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