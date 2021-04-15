import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  Card,
  Dropdown,
  DropdownButton,
  Container,
  Button,
  Row,
  Col,
  Form,
} from "react-bootstrap";

// Import DraftJS editor
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

export default function Announcement() {
  const { courseId, announcementId } = useParams();
  const { courseObjects, userObject, findInitials} = useAuth();
  const {
    createMarkup,
    deleteAnnouncement,
    updateAnnouncement,
  } = useCourse();
  const titleRef = useRef(null);
  const course = courseObjects.find(({ id }) => id === courseId);
  const announcement =
    course.announcements && course.announcements[announcementId]
      ? course.announcements[announcementId]
      : null;
  const [convertedContent, setConvertedContent] = useState(() => {
    return announcement && announcement.content
      ? draftToHtml(JSON.parse(course.announcements[announcementId].content))
      : null;
  });
  const [isEdit, setisEdit] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  // Handles on change of editor
  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  async function handleDeleteAnnouncement() {
    try {
      await deleteAnnouncement(course, announcementId);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleUpdateAnnouncement(e) {
    e.preventDefault();
    try {
      const rawState = convertToRaw(editorState.getCurrentContent());
      await updateAnnouncement(
        titleRef.current.value,
        announcementId,
        course,
        JSON.stringify(rawState)
      );
      setConvertedContent(draftToHtml(rawState));
      setisEdit(false);
    } catch (error) {
      console.log(error);
    }
  }
  return !announcement ? (
    <div>
      <h1>Oops! Look like this post doesn't exist.</h1>
    </div>
  ) : (
    <div>
        <Card>
          <Card.Header className="p-2">
            {userObject.isInstructor &&
            <DropdownButton
              className="float-right"
              title="Options"
              variant="secondary"
              size="sm"
            >
              <Dropdown.Item
                onClick={() => {
                  if (announcement.content) {
                    setEditorState(
                      EditorState.createWithContent(
                        convertFromRaw(JSON.parse(announcement.content))
                      )
                    );
                  }
                  setisEdit(true);
                }}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteAnnouncement}>
                Delete
              </Dropdown.Item>
            </DropdownButton>
}           
          </Card.Header>
          <Card.Body>
            {isEdit ? (
              <div>
                <Form onSubmit={handleUpdateAnnouncement}>
                  <Form.Control
                    type="text"
                    required
                    ref={titleRef}
                    placeholder="Announcement Title"
                    defaultValue={`${announcement.title}`}
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
                  <Button
                    className="mt-2"
                    variant="primary"
                    size="sm"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                  <Button
                    className="mt-2 float-right"
                    variant="link"
                    onClick={() => setisEdit(false)}
                  >
                    Cancel
                  </Button>
                </Form>
              </div>
            ) : (
              <>
                <Container fluid>
                  <Row>
                    <Col
                      xs={1}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className="announcement-post-author">
                        {findInitials(announcement.author)}
                      </div>
                    </Col>
                    <Col>
                      <h4>{announcement.title}</h4>
                      <p>{announcement.author}</p>
                    </Col>
                  </Row>
                </Container>
                <br></br>
                <div
                  className="pl-4 pr-4"
                  dangerouslySetInnerHTML={createMarkup(convertedContent)}
                ></div>
              </>
            )}
          </Card.Body>
          <Card.Footer className="text-right p-2">
            <strong>Posted on:</strong>
            <p className="m-0">{new Date(announcement.creationDate).toLocaleString()}</p>
          </Card.Footer>
        </Card>
    </div>
  );
}
