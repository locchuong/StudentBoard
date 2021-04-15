import React, { useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  Card,
  DropdownButton,
  Dropdown,
  Button,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import DiscussionCommentReply from "./DiscussionCommentReply";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

export default function DiscussionComment(props) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const { currentUser, userObject } = useAuth();
  const {
    createMarkup,
    updateDiscussionComment,
    deleteDiscussionComment,
    upvoteComment,
    addDiscussionCommentReply,
  } = useCourse();
  const isUserAnonymousCommentReplyRef = useRef();
  const hasUpvoted =
    props.upvoteIds &&
    props.upvoteIds.find((id) => id === currentUser.uid) === currentUser.uid
      ? true
      : false;
  const [isNewCommentReplyFocus, setisNewCommentReplyFocus] = useState(false);
  // Add new comment editor
  const [commentReplyEditorState, setCommentReplyEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  const handleCommentReplyEditorChange = (state) => {
    setCommentReplyEditorState(state);
  };
  // Edit discussion post editor
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  async function handleUpdateDiscussionComment() {
    try {
      setLoading(true);
      const rawState = convertToRaw(editorState.getCurrentContent());
      await updateDiscussionComment(
        props.courseId,
        props.discussionId,
        props.id,
        JSON.stringify(rawState)
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  async function handleDeleteDiscussionComment() {
    try {
      setLoading(true);
      await deleteDiscussionComment(
        props.courseId,
        props.discussionId,
        props.id
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  async function handleUpvoteComment() {
    try {
      setLoading(true);
      await upvoteComment(
        props.courseId,
        props.discussionId,
        props.id,
        props.upvoteIds
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  async function handleAddDiscussionCommentReply(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const rawState = convertToRaw(
        commentReplyEditorState.getCurrentContent()
      );
      await addDiscussionCommentReply(
        props.courseId,
        props.discussionId,
        props.id,
        JSON.stringify(rawState),
        isUserAnonymousCommentReplyRef.current.value === "true" ? true : false,
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <div>
      <Card className="mt-3 card-outline-dark">
        <Card.Header className="p-1 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {props.byInstructor ? (
              <div className="discussion-post-instructor-commented mr-1">
                <strong className="text-light">i</strong>
              </div>
            ) : (
              <div className="discussion-post-student-commented mr-1">
                <strong className="text-light">s</strong>
              </div>
            )}
            <strong>{props.byInstructor ? "Instructor" : "Student"}</strong>
          </div>
          <DropdownButton
            disabled={loading || (!props.userIsAuthor && !props.userIsInstructor)}
            title=""
            variant="secondary"
            size="sm"
          >
            <Dropdown.Item
              disabled={loading}
              onClick={() => {
                if (props.content) {
                  setEditorState(
                    EditorState.createWithContent(
                      convertFromRaw(JSON.parse(props.content))
                    )
                  );
                }
                setisEdit(true);
              }}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              disabled={loading}
              onClick={() => handleDeleteDiscussionComment()}
            >
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </Card.Header>
        <Card.Body>
          {!isEdit ? (
            <>
              <Container fluid>
                <Row>
                  <Col>
                    <div
                      dangerouslySetInnerHTML={createMarkup(
                        draftToHtml(JSON.parse(props.content))
                      )}
                    ></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Container fluid>
                      {props?.replies &&
                        Object.keys(props.replies)
                          .sort(
                            (a, b) =>
                              props.replies[a].creationDate -
                              props.replies[b].creationDate
                          )
                          .map((key) => {
                            return (
                              <DiscussionCommentReply
                                key={key}
                                reply={props.replies[key]}
                                commentId={props.id}
                                userIsInstructor={props.userIsInstructor}
                                userIsAuthor={currentUser.uid === props.replies[key].authorId}
                              ></DiscussionCommentReply>
                            );
                          })}
                    </Container>
                    {!isNewCommentReplyFocus ? (
                      <div className={ props?.replies ? "ml-4" : "ml-0"}>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Reply to this comment"
                          onClick={() => {
                            setisNewCommentReplyFocus(true);
                            setCommentReplyEditorState(
                              EditorState.moveFocusToEnd(
                                commentReplyEditorState
                              )
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <Form
                        onSubmit={handleAddDiscussionCommentReply}
                        className={ props?.replies ? "ml-4" : "ml-0"}
                      >
                        <Editor
                          editorState={commentReplyEditorState}
                          onEditorStateChange={handleCommentReplyEditorChange}
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
                        <Form.Row className="my-3 flex-nowrap">
                          <Col xs={12} className="d-flex align-items-center">
                            <Form.Label className="font-weight-bold text-muted m-0 mr-3">
                              Show my name as
                            </Form.Label>
                            <Form.Control
                              as="select"
                              ref={isUserAnonymousCommentReplyRef}
                              disabled={props.userIsInstructor}
                              size="sm"
                              style={{ maxWidth: "300px" }}
                            >
                              <option value={false}>{userObject.name}</option>
                              <option value={true}>
                                Anonymous to Classmates
                              </option>
                            </Form.Control>
                          </Col>
                        </Form.Row>
                        <Form.Row>
                          <Col
                            xs={12}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <Button disabled={loading} size="sm" type="submit">
                              Submit
                            </Button>
                            <Button
                              disabled={loading}
                              className="float-right"
                              variant="link"
                              onClick={() => setisNewCommentReplyFocus(false)}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Form.Row>
                      </Form>
                    )}
                  </Col>
                </Row>
              </Container>
            </>
          ) : (
            <>
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
                variant="primary"
                size="sm"
                className="mt-2"
                onClick={() => handleUpdateDiscussionComment()}
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
            </>
          )}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center pt-1 pb-1">
          <div className="float-left">
            <Button
              disabled={isEdit || loading}
              variant="link"
              size="sm"
              className="mr-2"
              style={{ borderRight: "1px solid grey" }}
              onClick={() => handleUpvoteComment()}
            >
              {hasUpvoted ? "undo" : ""} upvote
            </Button>
            {props.upvoteIds ? Object.keys(props.upvoteIds).length : 0}
          </div>
          <span className="text-muted">
            Posted on: {new Date(props.creationDate).toISOString().slice(0, 10)}{" "}
            by:{" "}
            {!props.isUserAnonymous || props.userIsInstructor
              ? props.author
              : props.userIsAuthor
              ? "Anonymous (You)"
              : "Anonymous"}
          </span>
        </Card.Footer>
      </Card>
    </div>
  );
}
