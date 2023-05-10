import Flex from "components/common/Flex";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Container } from "react-bootstrap";
import MessageInput from "./MessageInput";
import ChatWindow from "./ChatWindow";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { API_HOST_PREFIX } from "../../services/serviceHelpers";
import debug from "sabio-debug";
import "./messages.css";
import messageService from "services/messageService";
import PropTypes from "prop-types";
import ChatSidebar from "./ChatSidebar";
import toastr from "toastr";

const _logger = debug.extend("Chat");

function Chat(props) {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);
  latestChat.current = chat;
  const userId = props.currentUser.id;

  const [uniqueThreads, setUniqueThreads] = useState([]);
  const [currentRecipientId, setCurrentRecipientId] = useState();

  const [isScrollToBottom, setIsScrollToBottom] = useState(true);

  useEffect(() => {
    messageService
      .getUniqueContacts()
      .then(onGetUniqueContactsSuccess)
      .catch(onGetUniqueContactsError);
  }, []);

  const onGetUniqueContactsSuccess = (response) => {
    const contacts = response.item;
    setUniqueThreads(contacts);
  };

  const onGetUniqueContactsError = (response) => {
    _logger("error", response);
  };

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_HOST_PREFIX}/chathub`)
      .withAutomaticReconnect()
      .build();

    setConnection(connection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message, senderId, msgId) => {
            message.id = msgId;
            message.senderId = senderId;
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);
            setChat(updatedChat);
            setIsScrollToBottom(true);
          });
        })
        .catch((e) => _logger("Connection failed: ", e));
    }
  }, [connection]);

  const [msgKey, setMsgKey] = useState(0);

  const sendMessage = async (messageValues) => {
    const messageDetails = {
      id: `new${msgKey}`,
      message: messageValues.message,
      subject: messageValues.subject,
      recipient: {
        id: currentRecipientId,
      },
      sender: {
        id: userId,
      },
      dateSent: new Date(),
      dateRead: messageValues.dateRead,
    };

    setMsgKey(msgKey + 1);

    const messageData = {
      message: messageValues.message,
      subject: messageValues.subject,
      recipientId: currentRecipientId,
      senderId: userId,
      dateSent: new Date(),
      dateRead: messageValues.dateRead,
    };

    const updatedChat = [...latestChat.current];

    updatedChat.push(messageDetails);
    setChat(updatedChat);

    setIsScrollToBottom(true);

    messageService
      .add(messageData)
      .then(onMessageSendSuccess)
      .catch(onMessageSendError);
  };

  const onMessageSendSuccess = (response) => {
    _logger("success", response);

    setIsScrollToBottom(false);

    messageService
      .getUniqueContacts()
      .then(onGetUniqueContactsSuccess)
      .catch(onGetUniqueContactsError);
  };

  const onMessageSendError = (error) => {
    _logger("error", error);
    toastr.error("Failed to send message");
  };

  const onThreadClick = useCallback((threadId) => {
    messageService
      .getChatHistory(userId, threadId)
      .then(onGetChatHistorySuccess)
      .catch(onGetChatHistoryError);

    setCurrentRecipientId(threadId);

    setIsScrollToBottom(true);
  }, []);

  const onGetChatHistorySuccess = (response) => {
    const messageHistory = response.item;

    setChat((prevState) => {
      let newState = [...prevState];
      newState = messageHistory;
      return newState;
    });
  };

  const onGetChatHistoryError = (response) => {
    _logger("error", response);
  };

  return (
    <Container className="chat-display">
      <Card className="card-chat overflow-hidden">
        <Card.Body as={Flex} className="h-100 ps-3 pb-2 mb-1">
          <ChatSidebar
            isSidebarHidden={isSidebarHidden}
            threads={uniqueThreads}
            onThreadClick={onThreadClick}
            setCurrentRecipientId={setCurrentRecipientId}
            currentRecipientId={currentRecipientId}
            setChat={setChat}
            className="pr-3"
          />
          <ChatWindow
            userId={userId}
            chat={chat}
            setIsSidebarHidden={setIsSidebarHidden}
            isScrollToBottom={isScrollToBottom}
            setIsScrollToBottom={setIsScrollToBottom}
            currentRecipientId={currentRecipientId}
          />
        </Card.Body>
        <Card.Footer className="pt-0">
          <MessageInput sendMessage={sendMessage} />
        </Card.Footer>
      </Card>
    </Container>
  );
}

Chat.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default React.memo(Chat);
