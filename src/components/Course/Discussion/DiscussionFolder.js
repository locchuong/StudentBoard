import React, { useState, useRef } from "react";
import { useCourse } from "../../../contexts/CourseContext";
import { Button, Modal, Form, Card, Dropdown } from "react-bootstrap";
import folderIcon from "../../../media/icons/folderIcon.png";

export default function DiscussionFolder(props) {
  const { updateDiscussionFolder, deleteDiscussionFolder } = useCourse();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const folderRenameRef = useRef();

  async function handleUpdateFolder(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDiscussionFolder(
        props.course.id,
        props.folder.id,
        folderRenameRef.current.value
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowEditModal(false);
  }
  async function handleDeleteFolder() {
      try {
          setLoading(true);
          await deleteDiscussionFolder(props.course, props.folder.id);
      } catch(error) {
          console.log(error);
      }
  }
  return (
    <div>
      <Card className="discussion-folder-card">
        <Card.Body className="d-flex p-2 justify-content-between align-items-center">
          <div className="flex-grow-1 d-flex align-items-center overflow-hidden">
            <img
              src={folderIcon}
              alt="Logo"
              width="25"
              height="25"
              className="mr-2"
            />
            <p className="m-0 d-inline-block discussion-post-text">
              {props.folder.folderName}
            </p>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              size="sm"
              className="d-flex justify-content-center align-items-center"
              style={{ width: "20px", height: "20px" }}
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowEditModal(true)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDeleteFolder()}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>
      {/* Edit Folder Modal */}
      <Modal
        show={showEditModal}
        backdrop="static"
        animation={false}
        size="lg"
        onHide={() => setShowEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Folder</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateFolder}>
          <Modal.Body className="p-3">
            <Form.Control
              ref={folderRenameRef}
              type="text"
              placeholder="Folder Name"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={loading}
              className="mr-auto"
              variant="success"
              type="submit"
              size="sm"
            >
              Update
            </Button>
            <Button
              disabled={loading}
              variant="link"
              onClick={() => setShowEditModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
