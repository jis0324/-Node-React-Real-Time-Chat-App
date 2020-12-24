import React, { useState, useEffect } from "react";
import Service from "../services/service";

const ChatRoom = (props) => {

  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const onChangeSearchKey = (e) => {
    const searchkey = e.target.value
    setLoading(true);
    
    if (searchkey === "") {
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
      Service.getSearchContactList(searchkey).then(
        (response) => {
          console.log(response.data.data);
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
    console.log(id)
    Service.addContact(id).then(
      (response) => {
        console.log(response);
      }, 
      (error) => {
        console.log(error);
      }
    );
  };
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
                CONTACT LIST
              </div>
              <div className="panel-body p-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Username..."
                  id="search"
                  onChange={onChangeSearchKey}
                />
                {loading ? (
                  <span className="spinner-border spinner-border-sm d-block mx-auto"></span>
                ) : (
                  <div className="contact-list my-3">
                    {userList.map((user, index) => (
                      <div key={index} onClick={() => handleAddContact(user._id)} className="contact-user py-2 row m-auto">
                        <div className="col-md-4 col-sm-4">
                          <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" className="profile-photo-lg" />
                        </div>
                        <div className="col-md-8 col-sm-8 m-auto">
                          <h5>{user.username}</h5>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                )}
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
                <div className="input-group">
                  <input className="form-control" placeholder="Enter a message:" size="105" id="message"
                  ></input>
                  <span className="input-group-btn">
                    <input type="button" id="send" name="send" className="btn btn-info" value="SEND"></input>
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