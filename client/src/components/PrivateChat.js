import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Service from "../services/service";

const API_URL = "http://localhost:8080";

const ChatRoom = (props) => {

  const [userList, setUserList] = useState([]);
  const [oldMessageList, setOldMessageList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [chatObj, setChatObj] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = socketIOClient(API_URL);

  useEffect(() => {
    Service.getContactList().then(
      (response) => {
        setUserList(response.data.data);
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

  const onChangeSearchKey = (e) => {
    // const searchkey = e.target.value
    setLoading(true);
    setSearchKey(e.target.value);

    if (e.target.value === "") {
      setSearchFlag(false);

      Service.getContactList().then(
        (response) => {
          setUserList(response.data.data);
          setLoading(false);
        },
        (error) => {
          if (error.response.data.message === "No token provided!" || error.response.data.message === "!Unauthorized!") {
            props.history.push("/login");
            window.location.reload();
          } else {
            setUserList([]);
          };
          setLoading(false);
        }
      );
    } else {
      setSearchFlag(true);

      Service.getSearchContactList(e.target.value).then(
        (response) => {
          setUserList(response.data.data);
          setLoading(false);
        },
        (error) => {
          if (error.response.data.message === "No token provided!" || error.response.data.message === "!Unauthorized!") {
            props.history.push("/login");
            window.location.reload();
          } else {
            setUserList([]);
          };
          setLoading(false);
        }
      );
    };

  };

  const handleAddContact = (id) => {
    setSearchFlag(false);
    setSearchKey("");

    Service.addContact(id).then(
      (response) => {
        setUserList(response.data.data);
      },
      (error) => {
        console.log(error);
        setUserList([]);
      }
    );
  };

  const handleChatContact = (obj, e) => {
    e.target.classList.add('active');
    setChatObj(obj);

    var sendData = {
      userId: Service.authInfo().id,
      objId: obj._id
    }

    socket.emit("join", sendData, (messages, room) => {
      setRoomName(room);
      setOldMessageList(messages);
    });

    // Service.getMessages(obj._id).then(
    //   (response) => {
    //     console.log(response);


    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

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
                {searchFlag ? "SEARCH LIST" : "CONTACT LIST"}
              </div>
              <div className="panel-body p-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Username..."
                  id="search"
                  value={searchKey}
                  onChange={onChangeSearchKey}
                />

                <div className="contact-list my-3">
                  {searchFlag ? (
                    userList.map((user, index) => (
                      <div key={index} onClick={() => handleAddContact(user._id)} className="contact-user py-2 row m-auto">
                        <div className="col-md-4 col-sm-4">
                          <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                        </div>
                        <div className="col-md-8 col-sm-8 m-auto">
                          <h5>{user.username}</h5>
                        </div>
                      </div>
                    ))
                  ) : (
                      userList.map((user, index) => (
                        <div key={index} onClick={(e) => handleChatContact(user, e)} className="contact-user py-2 row m-auto">
                          <div className="col-md-4 col-sm-4">
                            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                          </div>
                          <div className="col-md-8 col-sm-8 m-auto">
                            <h5>{user.username}</h5>
                          </div>
                        </div>
                      ))
                    )}
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
                CHAT BOX
              </div>
              <div className="panel-body p-2">
                <h4 className="mx-2">{chatObj.username}</h4>
                {chatObj.username ? <hr /> : ""}
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