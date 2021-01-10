import axios from "axios";

const API_URL = "http://localhost:8080/api/";

const authInfo = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return user;
  } else {
    return {};
  }
}

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const checkAuthorized = () => {
  return axios.get(API_URL + "checkauth", { headers: authHeader() });
};

const getContactList = () => {
  return axios.get(API_URL + "contactlist", { headers: authHeader() });
};

const getSearchContactList = (key) => {
  return axios.get(API_URL + "searchcontactlist", { headers: authHeader(), params: {searchkey: key} });
}

const addContact = (id) => {
  var data = {"contactId": id};
  return axios
    .post(API_URL + "addcontact", data, {
      headers: authHeader(),
    })
}

const getMessages = (obj_id) => {
  return axios
    .get(API_URL + "getmsgs", { headers: authHeader(), params: {objId: obj_id} });
}

// const getUserBoard = () => {
//   return axios.get(API_URL + "user", { headers: authHeader() });
// };

// const getModeratorBoard = () => {
//   return axios.get(API_URL + "mod", { headers: authHeader() });
// };

// const getAdminBoard = () => {
//   return axios.get(API_URL + "admin", { headers: authHeader() });
// };

export default {
  authInfo,
  checkAuthorized,
  getPublicContent,
  getContactList,
  getSearchContactList,
  addContact,
  getMessages
  // getUserBoard,
  // getModeratorBoard,
  // getAdminBoard,
};
