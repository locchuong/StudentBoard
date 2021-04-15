import React, { useState, useRef } from "react";
import { Form, Card, Button, Col, Alert } from "react-bootstrap";
//DraftJS Editor
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useCourse } from "../../../contexts/CourseContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function DiscussionNewPost() {
  const { courseId } = useParams();
  const { addDiscussionPost } = useCourse();
  const titleRef = useRef(null);
  const { currentUser, userObject, courseObjects } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const course = courseObjects.find(({ id }) => id === courseId);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isUserAnonymousRef = useRef();
  const isPostPublicRef = useRef();
  const discussions = course?.discussions;
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  async function handleAddDiscussionPost(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");
      const rawState = convertToRaw(editorState.getCurrentContent());
      await addDiscussionPost(
        titleRef.current.value,
        course,
        JSON.stringify(rawState),
        isUserAnonymousRef.current.value === "true" ? true : false,
        selectedFolder,
        isPostPublicRef.current.checked
      );
      e.target.reset();
      setMessage("Successfully created Discussion Post!");
      setEditorState(EditorState.createEmpty());
      setSelectedFolder(null);
    } catch (error) {
      setError(
        "An error has occured while trying to create the Discussion Post!"
      );
    }
    setLoading(false);
  }
  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleAddDiscussionPost}>
        <Card className="card-outline-dark" style={{ overflow: "hidden" }}>
          <Card.Header
            border="secondary"
            className="py-2 font-weight-bold text-muted"
          >
            New Post
          </Card.Header>
          <Card.Body>
            <Form.Row className="mb-3 flex-nowrap">
              <Col className="text-right">
                <Form.Label className="font-weight-bold text-muted">
                  Post to
                </Form.Label>
              </Col>
              <Col xs={10} className="d-flex">
                <Form.Check
                  type="radio"
                  label="Entire Class"
                  name="isPublicRadios"
                  ref={isPostPublicRef}
                  required
                />
                <Form.Check
                  className="ml-2"
                  type="radio"
                  label="Instructors"
                  name="isPublicRadios"
                  required
                />
              </Col>
            </Form.Row>
            <Form.Row className="mb-3 flex-nowrap align-items-center">
              <Col className="text-right">
                <Form.Label className="font-weight-bold text-muted">
                  Select Folder:
                </Form.Label>
              </Col>
              <Col xs={10}>
                {discussions?.folders &&
                  Object.keys(discussions.folders).map((key, index) => {
                    return (
                      <Button
                        variant="outline-dark"
                        className={`${index !== 0 ? "ml-2" : ""} my-1 p-1`}
                        key={key}
                        active={selectedFolder === key}
                        size="sm"
                        onClick={() => setSelectedFolder(key)}
                      >
                        {discussions.folders[key].folderName}
                      </Button>
                    );
                  })}
              </Col>
            </Form.Row>
            <Form.Row className="mb-3 flex-nowrap align-items-center">
              <Col className="text-right">
                <Form.Label className="font-weight-bold text-muted">
                  Title
                </Form.Label>
              </Col>
              <Col xs={10}>
                <Form.Control
                  type="text"
                  ref={titleRef}
                  required
                  maxLength={100}
                  placeholder="Post Title"
                />
              </Col>
            </Form.Row>
            <Form.Row className="mb-3 flex-nowrap">
              <Col className="text-right">
                <Form.Label className="mt-2 font-weight-bold text-muted">
                  Summary
                </Form.Label>
              </Col>
              <Col xs={10}>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  wrapperClassName="wrapper-class p-0 mt-3"
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
              </Col>
            </Form.Row>
            <Form.Row className="mb-3 flex-nowrap">
              <Col className="text-right">
                <Form.Label className="font-weight-bold text-muted">
                  Show my name as
                </Form.Label>
              </Col>
              <Col xs={10}>
                <Form.Control
                  as="select"
                  ref={isUserAnonymousRef}
                  size="sm"
                  disabled={currentUser.uid === course.instructorId}
                  style={{ maxWidth: "300px" }}
                >
                  <option value={false}>{userObject.name}</option>
                  <option value={true}>Anonymous to Classmates</option>
                </Form.Control>
              </Col>
            </Form.Row>
            <Form.Row className="mb-1 flex-nowrap">
              <Col></Col>
              <Col xs={10}>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    size="sm"
                  >
                    Publish
                  </Button>
                  <Button
                    disabled={loading}
                    variant="danger"
                    type="reset"
                    size="sm"
                    onClick={() => setEditorState(EditorState.createEmpty())}
                  >
                    Reset
                  </Button>
                </div>
              </Col>
            </Form.Row>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </Form>
    </div>
  );
}
