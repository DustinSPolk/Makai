import React from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { Formik, Form as FormikForm, Field } from "formik";
import { Button, InputGroup, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import "./messages.css";

const _logger = debug.extend("MessageInput");

function MessageInput(props) {
  const messageDetails = {
    message: "",
    subject: "",
    recipientId: 8,
    senderId: 1,
    dateSent: "",
    dateRead: "2023-04-23",
  };

  const onSubmit = (values, actions) => {
    const isMessageProvided = values.message && values.message !== "";
    const isRecipientIdProvided =
      values.recipientId && values.recipientId !== "";
    const isSenderIdProvided = values.senderId && values.senderId !== "";

    if (isMessageProvided && isRecipientIdProvided && isSenderIdProvided) {
      props.sendMessage(values);
      actions.setSubmitting(false);
      actions.resetForm({
        values: {
          message: "",
          subject: "",
          recipientId: 577,
          senderId: 1,
          dateSent: "",
          dateRead: "2023-04-23",
        },
      });
    } else {
      Toastify({
        text: "Please provide a message",
        className: "chat-error-toast",
        duration: 3000,
      }).showToast();
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={messageDetails}
      onSubmit={onSubmit}
    >
      <FormikForm>
        <Row>
          <InputGroup>
            <Field
              name="message"
              className="form-control msg-input"
              type="text"
              placeholder="Type your message"
            ></Field>
            <Button type="submit" variant="primary" className="send-chat-btn">
              Send
            </Button>
          </InputGroup>
        </Row>
      </FormikForm>
    </Formik>
  );
}

MessageInput.propTypes = {
  sendMessage: PropTypes.func,
};

export default MessageInput;
