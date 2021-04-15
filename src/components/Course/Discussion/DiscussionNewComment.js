import React, { useState, useRef } from "react";
import { useCourse } from "../../../contexts/CourseContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Card, Button, Col, Form } from "react-bootstrap";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

export default function DiscussionNewComment(props) {
  const { addDiscussionComment } = useCourse();
  const { userObject } = useAuth();
  const [isNewCommentFocus, setisNewCommentFocus] = useState(false);
  const isUserAnonymousCommentRef = useRef();
  const handleCommentEditorChange = (state) => {
    setCommentEditorState(state);
  };
  // Add new comment editor
  const [commentEditorState, setCommentEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  const [loading, setLoading] = useState(false);

  // Handles adding a comment to a discussion post
  async function handleAddDiscussionComment(e) {
    // Don't allow refresh
    e.preventDefault();
    try {
      // Disabled onclick events
      setLoading(true);
      // Convert editor's content to raw object
      const rawState = convertToRaw(commentEditorState.getCurrentContent());
      // Add comment to discussion psot
      await addDiscussionComment(
        props.courseId,
        props.discussionId,
        JSON.stringify(rawState),
        isUserAnonymousCommentRef.current.value === "true" ? true : false,
      );
      // No need to setLoading(false) due to remount
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <Form onSubmit={handleAddDiscussionComment}>
      <Card className="mt-3 card-outline-dark">
        <Card.Header className="p-2">
          <strong className="m-0">New Comment</strong>
        </Card.Header>
        <Card.Body>
          {!isNewCommentFocus && (
            <Form.Control
              type="text"
              placeholder="Compose a new comment"
              onClick={() => {
                setisNewCommentFocus(true);
                setCommentEditorState(
                  EditorState.moveFocusToEnd(commentEditorState)
                );
              }}
            />
          )}
          {isNewCommentFocus && (
            <>
              <Form.Row className="mb-3 flex-nowrap">
                <Col xs={12}>
                  <Editor
                    editorState={commentEditorState}
                    onEditorStateChange={handleCommentEditorChange}
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
                <Col xs={12} className="d-flex align-items-center">
                  <Form.Label className="font-weight-bold text-muted m-0 mr-3">
                    Show my name as
                  </Form.Label>
                  <Form.Control
                    as="select"
                    ref={isUserAnonymousCommentRef}
                    disabled={props.userIsInstructor}
                    size="sm"
                    style={{ maxWidth: "300px" }}
                  >
                    <option value={false}>{userObject.name}</option>
                    <option value={true}>Anonymous to Classmates</option>
                  </Form.Control>
                </Col>
              </Form.Row>
            </>
          )}
        </Card.Body>
        {isNewCommentFocus && (
          <Card.Footer>
            <Button disabled={loading} size="sm" type="submit">
              Submit
            </Button>
            <Button
              disabled={loading}
              className="float-right"
              variant="link"
              onClick={() => setisNewCommentFocus(false)}
            >
              Cancel
            </Button>
          </Card.Footer>
        )}
      </Card>
    </Form>
  );
}
