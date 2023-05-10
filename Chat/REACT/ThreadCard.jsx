import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";

const _logger = debug.extend("ThreadCard");

function ThreadCard(props) {
  return (
    <>
      <Card
        className="chat-thread-card"
        onClick={() => props.onThreadClick(props.threadData.id)}
      >
        <Card.Body className="py-3">
          <Row>
            <Col xs={2}>
              <img
                src={props.threadData.avatarUrl}
                alt="avatar"
                className="thread-user-avatar"
              />
            </Col>
            <Col>
              <h6 className="thread-name">{`${props.threadData.firstName} ${props.threadData.lastName}`}</h6>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

ThreadCard.propTypes = {
  threadData: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  onThreadClick: PropTypes.func.isRequired,
  currentRecipientId: PropTypes.number,
};

export default React.memo(ThreadCard);
