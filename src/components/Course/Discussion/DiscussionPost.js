import React, { useState, useRef } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useCourse } from "../../../contexts/CourseContext";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

import DiscussionComment from "./DiscussionComment";
import DiscussionNewComment from "./DiscussionNewComment";
import folderIcon from "../../../media/icons/folderIcon.png";

import "../../../stylesheets/DiscussionPost.css";

export default function DiscussionPost(props) {
  const { courseId, discussionId } = useParams();
  const { currentUser, courseObjects, userObject } = useAuth();
  const {
    createMarkup,
    updateDiscussionPost,
    deleteDiscussionPost,
    upvoteDiscussionPost,
  } = useCourse();
  const course = courseObjects.find(({ id }) => id === courseId);
  const titleRef = useRef();
  const isPostPublicRef = useRef();
  const isUserAnonymousDiscussionRef = useRef();
  const [isEditPost, setisEditPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const discussionPost = course?.discussions?.posts?.[discussionId];
  const [selectedFolder, setSelectedFolder] = useState(discussionPost?.folder);
  const hasUpvoted =
    discussionPost?.upvoteIds &&
    discussionPost.upvoteIds.find((id) => id === currentUser.uid) ===
      currentUser.uid
      ? true
      : false;
  // Edit discussion post editor
  const [discussionEditorState, setDiscussionEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const handleDiscussionEditorChange = (state) => {
    setDiscussionEditorState(state);
  };
  // Handle converting discussion post's content object to HTML
  const convertedContent = discussionPost?.content
    ? draftToHtml(JSON.parse(discussionPost.content))
    : null;
  async function handleUpvoteDiscussion() {
    try {
      setLoading(true);
      await upvoteDiscussionPost(
        courseId,
        discussionId,
        discussionPost.upvoteIds
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  async function handleUpdateDiscussion(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const rawState = convertToRaw(discussionEditorState.getCurrentContent());
      await updateDiscussionPost(
        titleRef.current.value,
        courseId,
        discussionId,
        JSON.stringify(rawState),
        isUserAnonymousDiscussionRef.current.value === "true" ? true : false,
        selectedFolder,
        isPostPublicRef.current.checked
      );
      // No need to setLoading(false) due to remount
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  // Handles deleting the discussion post
  async function handleDeleteDiscussion() {
    try {
      // Disabled onclick events
      setLoading(true);
      // Delete discussion post
      await deleteDiscussionPost(courseId, discussionId);
      // No need to setLoading(false) due to remount
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return !discussionPost ? (
    <Redirect to={`/courses/${courseId}/discussion`} />
  ) : (
    <div>
      <Card className="card-outline-dark">
        <Card.Header className="p-1">
          <DropdownButton
            disabled={
              loading ||
              (currentUser.uid !== discussionPost.authorId &&
                currentUser.uid !== course.instructorId)
            }
            className="float-right"
            title=""
            variant="secondary"
            size="sm"
          >
            <Dropdown.Item
              disabled={loading}
              onClick={() => {
                if (discussionPost.content) {
                  setDiscussionEditorState(
                    EditorState.createWithContent(
                      convertFromRaw(JSON.parse(discussionPost.content))
                    )
                  );
                }
                setSelectedFolder(discussionPost?.folder);
                setisEditPost(true);
              }}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              disabled={loading}
              onClick={() => handleDeleteDiscussion()}
            >
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </Card.Header>

        <Card.Body className="p-2">
          <Container fluid>
            {!isEditPost ? (
              <>
                <Row>
                  <Col xs={12}>
                    <h3>{discussionPost.title}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div
                      dangerouslySetInnerHTML={createMarkup(convertedContent)}
                    ></div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    {discussionPost?.folder &&
                      course?.discussions?.folders?.[discussionPost.folder]
                        ?.folderName && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            props.setFolderFilter(discussionPost.folder)
                          }
                        >
                          <img
                            src={folderIcon}
                            alt="Logo"
                            width="20"
                            height="20"
                            style={{ filter: "invert(1)" }}
                            className="mr-1"
                          />
                          {
                            course?.discussions?.folders?.[
                              discussionPost.folder
                            ]?.folderName
                          }
                        </Button>
                      )}
                  </Col>
                </Row>
              </>
            ) : (
              <Form onSubmit={handleUpdateDiscussion}>
                <Form.Row className="my-3 flex-nowrap">
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
                      defaultChecked={discussionPost.isPostPublic}
                      required
                    />
                    <Form.Check
                      className="ml-2"
                      type="radio"
                      label="Instructors"
                      name="isPublicRadios"
                      defaultChecked={!discussionPost.isPostPublic}
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
                    {course?.discussions?.folders &&
                      Object.keys(course.discussions.folders).map(
                        (key, index) => {
                          return (
                            <Button
                              variant="outline-dark"
                              className={`${
                                index !== 0 ? "ml-2" : ""
                              } my-1 p-1`}
                              key={key}
                              active={selectedFolder === key}
                              size="sm"
                              onClick={() => setSelectedFolder(key)}
                            >
                              {course.discussions.folders[key].folderName}
                            </Button>
                          );
                        }
                      )}
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
                      defaultValue={discussionPost.title}
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
                      editorState={discussionEditorState}
                      onEditorStateChange={handleDiscussionEditorChange}
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
                      disabled={
                        loading || currentUser.uid === course.instructorId
                      }
                      ref={isUserAnonymousDiscussionRef}
                      size="sm"
                      style={{ maxWidth: "300px" }}
                      defaultValue={discussionPost.isUserAnonymous}
                    >
                      <option value={false}>{userObject?.name}</option>
                      <option value={true}>Anonymous to Classmates</option>
                    </Form.Control>
                  </Col>
                </Form.Row>
                <Form.Row className="mb-1 flex-nowrap">
                  <Col></Col>
                  <Col xs={10}>
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
                      onClick={() => setisEditPost(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            )}
          </Container>
        </Card.Body>
        <Card.Footer className="text-right">
          <div className="float-left">
            <Button
              disabled={loading || isEditPost}
              variant="link"
              size="sm"
              className="mr-2 testersm"
              style={{ borderRight: "1px solid grey" }}
              onClick={() => handleUpvoteDiscussion()}
            >
              {hasUpvoted ? "undo" : ""} upvote
            </Button>
            {discussionPost.upvoteIds
              ? Object.keys(discussionPost.upvoteIds).length
              : 0}
          </div>
          <span className="text-muted">
            Posted on:{" "}
            {new Date(discussionPost.creationDate).toISOString().slice(0, 10)}{" "}
            by{" "}
            {currentUser.uid === course.instructorId || // Author shown if viewer is Instructor
            !discussionPost.isUserAnonymous // Author shown if public post
              ? discussionPost.author
              : discussionPost.authorId === currentUser.uid
              ? "Anonymous (You)"
              : "Anonymous"}
          </span>
        </Card.Footer>
      </Card>

      {discussionPost.comments ? (
        <Container fluid className="p-0">
          {Object.keys(discussionPost.comments)
            .sort(
              (a, b) =>
                discussionPost.comments[a].creationDate -
                discussionPost.comments[b].creationDate
            )
            .map((key) => {
              return (
                <DiscussionComment
                  key={key}
                  courseId={courseId}
                  discussionId={discussionId}
                  id={key}
                  authorId={discussionPost?.comments?.[key]?.authorId}
                  author={discussionPost?.comments?.[key]?.author}
                  content={discussionPost?.comments?.[key]?.content}
                  creationDate={discussionPost?.comments?.[key]?.creationDate}
                  replies={discussionPost?.comments?.[key]?.replies}
                  upvoteIds={discussionPost?.comments?.[key]?.upvoteIds}
                  byInstructor={discussionPost?.comments?.[key]?.byInstructor}
                  isUserAnonymous={
                    discussionPost?.comments?.[key]?.isUserAnonymous
                  }
                  userIsInstructor={currentUser.uid === course?.instructorId}
                  userIsAuthor={
                    currentUser.uid ===
                    discussionPost?.comments?.[key]?.authorId
                  }
                />
              );
            })}
        </Container>
      ) : (
        <></>
      )}
      <DiscussionNewComment
        courseId={courseId}
        discussionId={discussionId}
        userIsInstructor={currentUser.uid === course.instructorId}
      />
    </div>
  );
}
