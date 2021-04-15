import React, { useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import { useParams } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import DiscussionFolder from "./DiscussionFolder";
import addFolderIcon from "../../../media/icons/addFolderIcon.png";

export default function DiscussionFolders() {
  const { addDiscussionFolder} = useCourse();
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const folderNameRef = useRef();
  const { courseId } = useParams();
  const { courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  async function handleAddFolder(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await addDiscussionFolder(courseId, folderNameRef.current.value);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowAddModal(false);
  }

  return (
    <div>
      <Card className="card-outline-dark" style={{minHeight: "300px"}}>
        <Card.Header
          border="secondary"
          className="py-2 font-weight-bold text-muted"
        >
          Folder Manager
        </Card.Header>
        <Card.Body>
          <Container fluid>
            <Row className="mb-4">
              <Col className="d-flex justify-content-end">
                <Button
                  disabled={loading}
                  className="discussion-new-folder-btn"
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowAddModal(true)}
                >
                  <img
                    src={addFolderIcon}
                    alt="Logo"
                    width="20"
                    height="20"
                    className="mr-1"
                  />
                </Button>
              </Col>
            </Row>
            <Row>
              {course.discussions && course.discussions.folders && (
                <>
                  {Object.keys(course.discussions.folders)
                    .sort(
                      (a, b) =>
                        course.discussions.folders[b].creationDate -
                        course.discussions.folders[a].creationDate
                    )
                    .map((key) => {
                      return (
                        <Col xs={3} className="mb-2" key={key}>
                          <DiscussionFolder course={course} folder={course.discussions.folders[key]}></DiscussionFolder>
                        </Col>
                      );
                    })}
                </>
              )}
            </Row>
          </Container>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
      {/* Add Folder Modal */}
      <Modal
        show={showAddModal}
        backdrop="static"
        animation={false}
        size="md"
        centered
        onHide={() => setShowAddModal(false)}
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
            />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            <Button
              disabled={loading}
              variant="link"
              className="text-dark"
              size="sm"
              onClick={() => setShowAddModal(false)}
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
