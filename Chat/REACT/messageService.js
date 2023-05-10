import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = {
  messagesUrl: `${API_HOST_PREFIX}/api/messages`,
};

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.messagesUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getChatHistory = (userId, secondUserId) => {
  const config = {
    method: "GET",
    url: `${endpoint.messagesUrl}/history?firstUserId=${userId}&secondUserId=${secondUserId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getUniqueContacts = () => {
  const config = {
    method: "GET",
    url: `${endpoint.messagesUrl}/unique`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const messageService = { add, getChatHistory, getUniqueContacts };
export default messageService;
