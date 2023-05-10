import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import "./messages.css";
import { formatTime } from "../../utils/dateFormater";
import { Row } from "react-bootstrap";

const _logger = debug.extend("Message");

function Message(props) {
  const isSentByCurrentUser = props?.sender.id === props?.userId;

  const messageColor = () => {
    if (isSentByCurrentUser) {
      return "message-display-sent";
    } else {
      return "message-display";
    }
  };

  const messageAlignment = () => {
    if (isSentByCurrentUser) {
      return "chat-msg-row-sent d-flex align-items-end flex-column";
    } else {
      return "chat-msg-row";
    }
  };

  return (
    <Row className={messageAlignment()}>
      <div className={messageColor()}>
        <p className="mb-2">{props?.message}</p>
        <p className="msg-sent-time">{formatTime(props?.dateSent)}</p>
      </div>
    </Row>
  );
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  subject: PropTypes.string,
  recipient: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  sender: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  dateSent: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  dateRead: PropTypes.string,
  userId: PropTypes.number.isRequired,
};

export default Message;
