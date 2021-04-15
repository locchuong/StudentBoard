import React, { useState, useRef } from "react";
import { useParams, Link, useRouteMatch } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import "../../../stylesheets/Announcements.css";

// Import DraftJS editor
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

export default function Announcements() {
  const { courseId } = useParams();
  const { url } = useRouteMatch();
  const { courseObjects, userObject, findInitials } = useAuth();
  const { addAnnouncement } = useCourse();
  const course = courseObjects.find(({ id }) => id === courseId);
  const titleRef = useRef(null);
  const [isPreview, setisPreview] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Handles disabling buttons on load
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  // Handles on change of editor
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  // Handle reseting the Editor's state
  const handleResetEditor = () => {
    setEditorState(EditorState.createEmpty());
  };

  // Handles creating new announcement
  async function handleAddAnnouncement(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setLoading(true);
      const rawState = convertToRaw(editorState.getCurrentContent());
      await addAnnouncement(
        titleRef.current.value,
        course,
        JSON.stringify(rawState)
      );
      setMessage("Announcement successfully created!");
    } catch (error) {
      setError(error);
    }
    // Undisable submission button
    setLoading(false);
    // Reset form
    handleResetEditor();
    titleRef.current.value = "";
  }
  function renderAnnouncements() {
    let jsx = [];
    if (course.announcements) {
      Object.keys(course.announcements)
        .sort(
          (a, b) =>
            course.announcements[b].creationDate -
            course.announcements[a].creationDate
        )
        .forEach((key) => {
          jsx.push(
            <Row key={key} className="announcement-post">
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <div className="announcement-post-author">
                  {findInitials(course.announcements[key].author)}
                </div>
              </Col>
              <Col xs={7} className="pt-3 pb-3">
                <Link
                  to={`${url}/${course.announcements[key].id}`}
                  className="text-dark"
                >
                  <h5>{course.announcements[key].title}</h5>
                </Link>
                <p
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {convertFromRaw(
                    JSON.parse(course.announcements[key].content)
                  ).getPlainText()}
                </p>
              </Col>
              <Col
                xs={3}
                className="d-flex flex-column align-items-end justify-content-end"
              >
                <strong>Posted on:</strong>
                <p>
                  {new Date(
                    course.announcements[key].creationDate
                  ).toLocaleString()}
                </p>
              </Col>
            </Row>
          );
        });
    } else {
      jsx.push(
        <Row key={"#noannouncement"} className="announcement-post">
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100px" }}
          >
            <h5> No Announcements!</h5>
          </Col>
        </Row>
      );
    }
    return <Container fluid>{jsx}</Container>;
  }

  return (
    <div >
      <div className="announcement-header">
        <h3>Announcements</h3>
        {userObject.isInstructor && (
          <Button
            disabled={loading}
            className={isPreview ? "d-inline-block" : "d-none"}
            variant="outline-dark"
            onClick={() => {
              setisPreview(false);
            }}
          >
            New Post
          </Button>
        )}
        <Button
          disabled={loading}
          className={!isPreview ? "d-inline-block" : "d-none"}
          variant="link"
          onClick={() => {
            setMessage("");
            setisPreview(true);
          }}
        >
          Back
        </Button>
      </div>
      <hr className={isPreview ? "mb-0" : ""}></hr>
      <div className={!isPreview ? "d-inline-block w-100" : "d-none"}>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleAddAnnouncement}>
          <Card className="card-outline-dark">
            <Card.Header>New Announcement Post</Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                ref={titleRef}
                required
                placeholder="Announcement Title"
              ></Form.Control>
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
            </Card.Body>
            <Card.Footer>
              <Button
                className="mt-1 ml-1 float-right"
                variant="warning "
                type="reset"
                size="sm"
                onClick={handleResetEditor}
              >
                Reset
              </Button>
              <Button
                className="mt-2"
                variant="primary"
                size="sm"
                type="submit"
              >
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Form>
      </div>
      {isPreview && renderAnnouncements()}
    </div>
  );
}
