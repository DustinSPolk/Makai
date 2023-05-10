import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  Nav,
  Row,
  InputGroup,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import ThreadCard from "./ThreadCard";
import { Formik, Form as FormikForm, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import userService from "services/userService";
import ContactCard from "./ContactCard";
import toastr from "toastr";

const _logger = debug.extend("ChatSidebar");

function ChatSidebar(props) {
  const [threadData, setThreadData] = useState({
    arrayOfThreads: [],
    threadComponents: [],
  });

  const [contactData, setContactData] = useState({
    arrayofContacts: [],
    contactComponents: [],
  });

  useEffect(() => {
    let threadsData = props.threads;

    setThreadData((prevState) => {
      const newThreadData = { ...prevState };
      newThreadData.arrayOfThreads = threadsData;
      newThreadData.threadComponents = threadsData.map(mapThreads);
      return newThreadData;
    });
  }, [props.threads]);

  const mapThreads = (thread) => {
    return (
      <ThreadCard
        threadData={thread}
        key={thread.id}
        onThreadClick={props.onThreadClick}
        currentRecipientId={props.currentRecipientId}
      />
    );
  };

  const chatRecipientInput = {
    query: "",
  };

  const onChatRecipientInputSubmit = (values, actions) => {
    actions.setSubmitting(false);

    userService
      .onClickSearchUser(values.query, 0, 10)
      .then(onSearchUserSuccess)
      .catch(onSearchUserError);
  };

  const onSearchUserSuccess = (response) => {
    const users = response.item.pagedItems;

    setContactData((prevState) => {
      const newContactData = { ...prevState };
      newContactData.arrayofContacts = users;
      newContactData.contactComponents = users.map(mapSearchResults);
      return newContactData;
    });
  };

  const onSearchUserError = (error) => {
    _logger(error);
    toastr.error("Failed to retrieve users");
  };

  const mapSearchResults = (contact) => {
    const contactInfo = {
      avatarUrl: contact.avatarUrl,
      name: `${contact.firstName} ${contact.lastName}`,
      id: contact.id,
    };

    return (
      <ContactCard
        contactData={contactInfo}
        key={contact.id}
        onContactClick={onContactClick}
      />
    );
  };

  const onContactClick = (contactId) => {
    props.setCurrentRecipientId(contactId);
    props.setChat([]);
  };

  const popoverResults = () => {
    if (contactData.contactComponents.length > 0) {
      return contactData.contactComponents;
    } else {
      return "No results found";
    }
  };

  const popover = (
    <Popover id="recipient-search-results">
      <Popover.Body>
        <Nav className="border-0">{popoverResults()}</Nav>
      </Popover.Body>
    </Popover>
  );

  return (
    <div
      className={classNames("chat-sidebar", {
        "start-0": props.isSidebarHidden,
      })}
    >
      <div className="contacts-list">
        <Nav className="border-0">{threadData.threadComponents}</Nav>
      </div>
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={chatRecipientInput}
          onSubmit={onChatRecipientInputSubmit}
        >
          <FormikForm>
            <Row>
              <InputGroup size="sm">
                <Field
                  name="query"
                  className="form-control search-contact-input"
                  type="text"
                  placeholder="Search users"
                ></Field>
                <OverlayTrigger
                  trigger="click"
                  placement="top-end"
                  overlay={popover}
                  rootClose={true}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    className="search-contact-btn"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </Button>
                </OverlayTrigger>
              </InputGroup>
            </Row>
          </FormikForm>
        </Formik>
      </div>
    </div>
  );
}

ChatSidebar.propTypes = {
  isSidebarHidden: PropTypes.bool.isRequired,
  threads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string,
    })
  ),
  onThreadClick: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  setCurrentRecipientId: PropTypes.func.isRequired,
  currentRecipientId: PropTypes.number,
};

export default React.memo(ChatSidebar);
