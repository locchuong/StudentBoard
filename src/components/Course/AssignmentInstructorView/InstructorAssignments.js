import React, { useState, useRef } from "react";
import { useParams, Link, useRouteMatch } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Alert,
} from "react-bootstrap";

// Import DraftJS editor
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

export default function InstructorAssignments() {
  const { courseObjects } = useAuth();
  const { addAssignment } = useCourse();
  const { url } = useRouteMatch();
  const fileInputRef = useRef();
  const releaseDateRef = useRef();
  const dueDateRef = useRef();
  const totalPointsRef = useRef();
  const pointStepRef = useRef();
  const titleRef = useRef();
  const { courseId } = useParams();
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  const course = courseObjects.find(({ id }) => id === courseId);

  function renderAssignments() {
    let jsx = [];
    if (course.assignments) {
      Object.keys(course.assignments)
        .sort(
          (a, b) =>
            course.assignments[b].creationDate -
            course.assignments[a].creationDate
        )
        .forEach((key) => {
          const assignment = course.assignments[key];
          jsx.push(
            <Row
              key={`assignment-${key}`}
              className="p-3"
              style={{ borderBottom: "1px solid lightgrey" }}
            >
              <Col className="d-flex justify-content-start align-items-center">
                <Link to={`${url}/${key}`} style={{ color: "black" }}>
                  <strong className="mb-0">{assignment.title}</strong>
                </Link>
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <strong>{assignment.totalPoints}</strong>
              </Col>
              <Col className="d-flex justify-content-center">
                {assignment.isPublished ? "✔️" : "❌"}
              </Col>
              <Col className="text-center">
                <strong className="mb-0">
                  {new Date(assignment.creationDate).toDateString()}
                </strong>
              </Col>
              <Col className="text-center">
                <strong className="mb-0">
                  {new Date(assignment.releaseDate).toLocaleString()}
                </strong>
              </Col>
              <Col className="text-right">
                <strong className="mb-0">
                  {new Date(assignment.dueDate).toLocaleString()}
                </strong>
              </Col>
            </Row>
          );
        });
    } else {
      jsx.push(<div key={`assignment-empty`}></div>);
    }
    return (
      <Container fluid className="pt-3 pl-5 pr-5">
        <Row className="p-3" style={{ borderBottom: "1px solid lightgrey" }}>
          <Col>
            <h5 className="text-muted">Title</h5>
          </Col>
          <Col className="text-center">
            <h5 className="text-muted">Points</h5>
          </Col>
          <Col className="text-center">
            <h5 className="text-muted">Published</h5>
          </Col>
          <Col className="text-center">
            <h5 className="text-muted">Creation Date</h5>
          </Col>
          <Col className="text-center">
            <h5 className="text-muted">Release Date</h5>
          </Col>
          <Col className="text-right">
            <h5 className="text-muted">Due Date</h5>
          </Col>
        </Row>
        {jsx}
      </Container>
    );
  }

  // Handle adding the Assignment Object to Course
  async function handleAddAssignment(e) {
    e.preventDefault();
    try {
      setMessage("");
      const rawState = convertToRaw(editorState.getCurrentContent());
      await addAssignment(
        course,
        titleRef.current.value,
        JSON.stringify(rawState),
        selectedFiles,
        totalPointsRef.current.value,
        pointStepRef.current.value,
        !isPrivate,
        new Date(releaseDateRef.current.value).valueOf(),
        new Date(dueDateRef.current.value).valueOf()
      );
      setMessage("Successfully created an assignment!");
      setShowAdd(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Assignments</h3>
        {!showAdd && (
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => {
              setEditorState(EditorState.createEmpty());
              setSelectedFiles(null);
              setShowAdd(true);
            }}
          >
            Add Assignment
          </Button>
        )}
      </div>
      <hr></hr>
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {!showAdd ? (
        renderAssignments()
      ) : (
        <Form onSubmit={handleAddAssignment}>
          <Card className="card-outline-dark">
            <Card.Header>New Assignment</Card.Header>
            <Card.Body>
              <Form.Group id="assignmentTitle">
                <Form.Label>Assignment Title</Form.Label>
                <Form.Control type="text" ref={titleRef} required />
              </Form.Group>
              <Form.Group id="assignmentContent">
                <Form.Label>Description</Form.Label>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  toolbar={{
                    options: [
                      "inline",
                      "fontSize",
                      "fontFamily",
                      "textAlign",
                      "list",
                      "link",
                      "image",
                      "history",
                    ],
                  }}
                />
              </Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>Total Points</Form.Label>
                  <Form.Control
                    ref={totalPointsRef}
                    type="number"
                    defaultValue={100}
                    min={1}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>Point Step Value</Form.Label>
                  <Form.Control
                    ref={pointStepRef}
                    type="number"
                    defaultValue={0.5}
                    min={0.25}
                    max={0.5}
                    step={0.25}
                    required
                  />
                </Col>
              </Form.Row>
              <Form.Row className="mt-2">
                <Col>
                  <Form.Label>Release Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    ref={releaseDateRef}
                    min={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    ref={dueDateRef}
                    min={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)}
                    required
                  />
                </Col>
              </Form.Row>
              <Form.Group className="mt-2" id="assignmentAttachments">
                <Form.File
                  ref={fileInputRef}
                  id="fileButton"
                  className="d-none"
                  multiple
                  onChange={(e) => {
                    if (e.target.files.length === 0) {
                      setSelectedFiles(null);
                    } else {
                      setSelectedFiles(e.target.files);
                    }
                  }}
                />
                <Card className="mt-2 border-0">
                  <Card.Header className="p-1">
                    <p className="m-0">Attachments</p>
                  </Card.Header>
                  <Card.Body className="pl-2">
                    {selectedFiles && (
                      <>
                        {Array.from(selectedFiles).map((file, index) => {
                          return (
                            <p key={`#file${index}`} className="m-0">
                              {file.name} ✔️
                            </p>
                          );
                        })}
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Form.Group>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" size="sm" type="submit">
                {isPrivate ? "Save Changes" : "Publish"}
              </Button>
              <Button
                className="ml-3"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current.click()}
              >
                Upload File
              </Button>
              <Form.Check
                className="d-inline-block ml-3"
                type="switch"
                id="custom"
                label="Private"
                onChange={(e) => {
                  if (e.target.checked) setIsPrivate(true);
                  else setIsPrivate(false);
                }}
              />
              <Button
                variant="link"
                className="float-right"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </Card.Footer>
          </Card>
        </Form>
      )}
    </div>
  );
}
