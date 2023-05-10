import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { Card, Col, Row } from "react-bootstrap";

const _logger = debug.extend("ContactCard");

function ContactCard(props) {
  return (
    <>
      <Card
        bg="dark"
        className="mb-1 chat-contact-card"
        onClick={() => props.onContactClick(props.contactData.id)}
      >
        <Card.Body className="py-3">
          <Row>
            <Col xs={2}>
              <img
                src={props.contactData.avatarUrl}
                alt="avatar"
                className="thread-user-avatar"
              />
            </Col>
            <Col>
              <h6 className="thread-name">{props.contactData.name}</h6>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

ContactCard.propTypes = {
  contactData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
  }).isRequired,
  onContactClick: PropTypes.func.isRequired,
};

export default React.memo(ContactCard);
