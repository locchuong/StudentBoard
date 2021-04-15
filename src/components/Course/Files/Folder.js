import React, { useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  DropdownButton,
  Dropdown,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useCourse } from "../../../contexts/CourseContext";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../stylesheets/Folder.css";

export default function Folder(props) {
  // Course Context
  const { addFile, deleteFile, deleteFolder, updateFolder } = useCourse();
  const { userObject } = useAuth();
  // Initialize Input refs
  const folderRenameRef = useRef();
  const fileInputRef = useRef();
  // Handles disabling dom elements during async calls
  const [loading, setLoading] = useState(false);
  // Handles show update folder modal
  const [showUpdateFolder, setShowUpdateFolder] = useState(false);
  // Handles add file to folder
  async function handleAddFile() {
    try {
      setLoading(false);
      props.setAddFileName(fileInputRef.current.files[0].name);
      props.setShowUploader(true);
      await addFile(
        props.courseId,
        props.folder,
        fileInputRef.current.files[0],
        props.setUploaderProgress
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  // Handles update folder (Name)
  async function handleUpdateFolder() {
    try {
      setLoading(true);
      await updateFolder(
        props.courseId,
        props.folder.id,
        folderRenameRef.current.value
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowUpdateFolder(false);
  }
  // Handles delete folder
  async function handleDeleteFolder() {
    try {
      setLoading(true);
      await deleteFolder(props.courseId, props.folder.id);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  async function handleDeleteFile(fileIndex) {
    try {
      setLoading(true);
      await deleteFile(props.courseId, props.folder, fileIndex);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  return (
    <>
      <Row className="mb-3">
        <Col>
          <Card className="card-outline-dark">
            <Card.Header className="folder-header">
              <strong>{props.folder.name}</strong>
              {/* Hidden File Input */}
              <Form.File
                className="d-none"
                ref={fileInputRef}
                onChange={() => handleAddFile()}
              ></Form.File>
              {/* Folder Dropdown Menu */}
              {userObject && userObject.isInstructor && (
                <DropdownButton variant="outline-light" title="" size="sm">
                  {/* Folder Dropdown for Add File */}
                  <Dropdown.Item onClick={() => fileInputRef.current.click()}>
                    Add File
                  </Dropdown.Item>
                  {/* FOlder Dropdown for Update Folder */}
                  <Dropdown.Item
                    onClick={() => {
                      setShowUpdateFolder(true);
                    }}
                  >
                    Rename
                  </Dropdown.Item>
                  {/* Folder Dropdown for Delete Folder */}
                  <Dropdown.Item onClick={handleDeleteFolder}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              )}
            </Card.Header>
            {/* Dynamically map course folder's files */}
            <Card.Body>
              {props.folder.files &&
                props.folder.files.map((element, index) => {
                  return (
                    <div className="d-flex mb-2">
                      <Button
                        key={`${element.fileName}`}
                        variant="link"
                        target="popup"
                        className="text-left flex-grow-1"
                        href={element.downloadURL}
                      >
                        {element.fileName}
                      </Button>
                      {userObject && userObject.isInstructor && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteFile(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Folder Modal */}
      <Modal
        show={showUpdateFolder}
        backdrop="static"
        animation={false}
        size="md"
        centered
        onHide={() => setShowUpdateFolder(false)}
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <h5>Rename</h5>
        </Modal.Header>
        <Form onSubmit={handleUpdateFolder}>
          <Modal.Body className="p-3">
            <Form.Control
              ref={folderRenameRef}
              type="text"
              placeholder="Folder Name"
              defaultValue={props.folder.name}
            />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            <Button
              disabled={loading}
              variant="link"
              className="text-dark"
              size="sm"
              onClick={() => setShowUpdateFolder(false)}
            >
              <strong>Close</strong>
            </Button>
            <Button
              disabled={loading}
              variant="primary"
              className="ml-2"
              type="submit"
              size="sm"
            >
              Rename
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
