import React, { useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  Container,
  Card,
  Button,
  Form,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../../../stylesheets/Files.css";
import Folder from "./Folder.js";
import addFolderIcon from "../../../media/icons/addFolderIcon.png";

export default function Files() {
  const { courseId } = useParams();
  const { courseObjects, userObject } = useAuth();
  const { addFolder } = useCourse();
  const folderNameRef = useRef();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [uploaderProgress, setUploaderProgress] = useState(0);
  const [addFileName, setAddFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const course = courseObjects.find(({ id }) => id === courseId);

  // Handles add folder
  async function handleAddFolder(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await addFolder(courseId, folderNameRef.current.value);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowAddFolder(false);
  }
  return (
    <div className="position-relative">
      {/* Header */}
      <div className="d-flex justify-content-between">
        <h3>Files</h3>
        <div>
          {userObject && userObject.isInstructor && (
            <Button
              className="files-add-folder-btn"
              variant="outline-dark"
              disabled={loading}
              onClick={() => setShowAddFolder(true)}
            >
              <img src={addFolderIcon} alt="Logo" width="25" height="25" />
            </Button>
          )}
        </div>
      </div>
      <hr></hr>
      {/* File Uploader */}
      {showUploader && (
        <Card className="files-uploader">
          <Card.Header className="files-uploader-header">
            Uploader
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setShowUploader(false)}
            >
              x
            </Button>
          </Card.Header>
          <Card.Body>
            {addFileName}
            <ProgressBar
              className="w-100 file-uploader-progress"
              now={uploaderProgress}
              max={100}
            ></ProgressBar>
          </Card.Body>
        </Card>
      )}
      {/* Dynamically map course folders (in course.files) to Folder component */}
      <Container className="pt-3 pl-5 pr-5">
        {course.files &&
          Object.keys(course.files)
            .sort(
              (a, b) =>
                course.files[a].creationDate - course.files[b].creationDate
            )
            .map((key) => (
              <Folder
                key={key}
                courseId={courseId}
                folder={course.files[key]}
                setShowUploader={setShowUploader}
                setUploaderProgress={setUploaderProgress}
                setAddFileName={setAddFileName}
              ></Folder>
            ))}
      </Container>
      {/* Add Folder Modal */}
      <Modal
        show={showAddFolder}
        backdrop="static"
        animation={false}
        size="md"
        centered
        onHide={() => setShowAddFolder(false)}
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <h5>New Folder</h5>
        </Modal.Header>
        <Form onSubmit={handleAddFolder}>
          <Modal.Body className="p-3">
            <Form.Control
              ref={folderNameRef}
              type="text"
              placeholder="Folder Name"
              required
            />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            <Button
              disabled={loading}
              variant="link"
              className="text-dark"
              size="sm"
              onClick={() => setShowAddFolder(false)}
            >
              <strong>Close</strong>
            </Button>
            <Button
              disabled={loading}
              className="ml-2"
              variant="primary"
              size="sm"
              type="submit"
            >
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
