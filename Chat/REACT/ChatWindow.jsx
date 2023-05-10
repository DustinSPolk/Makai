import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import PropTypes from "prop-types";
import "./messages.css";
import { Col } from "react-bootstrap";
import userService from "services/userService";
import toastr from "toastr";

const _logger = debug.extend("ChatWindow");

function ChatWindow(props) {
  const [chat, setChat] = useState(props.chat);
  const messagesEndRef = useRef();

  const [currentChatName, setCurrentChatName] = useState(null);

  useEffect(() => {
    setChat(props.chat);
    if (props.isScrollToBottom) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
      props.setIsScrollToBottom(false);
    }
  }, [props.chat]);

  useEffect(() => {
    if (props.currentRecipientId) {
      userService
        .getById(props.currentRecipientId)
        .then(onGetRecipientSuccess)
        .catch(onGetRecipientError);
    }
  }, [props.currentRecipientId]);

  const onGetRecipientSuccess = (response) => {
    const recipient = response.item;
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;
    setCurrentChatName(recipientName);
  };

  const onGetRecipientError = (error) => {
    _logger(error);
    toastr.error("Failed to retrieve message recipient info");
  };

  const chatMessages = chat.map((msg) => (
    <Message
      key={msg.id}
      message={msg.message}
      subject={msg.subject}
      recipient={msg.recipient}
      sender={msg.sender}
      dateSent={msg.dateSent}
      dateRead={msg.dateRead}
      userId={props.userId}
    />
  ));

  return (
    <>
      <Col>
        <div className="chat-window">{chatMessages}</div>
        <div ref={messagesEndRef} />
      </Col>
    </>
  );
}

ChatWindow.propTypes = {
  chat: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      message: PropTypes.string,
      subject: PropTypes.string,
      recipient: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string,
      }),
      sender: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string,
      }),
      dateSent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      dateRead: PropTypes.string,
    })
  ),
  setIsScrollToBottom: PropTypes.func.isRequired,
  isScrollToBottom: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  currentRecipientId: PropTypes.number,
};

export default ChatWindow;
