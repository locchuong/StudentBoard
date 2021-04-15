import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import {
  DropdownButton,
  Dropdown,
  Card,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import { useRouteMatch, Link, useParams } from "react-router-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

import announcementIcon from "../../../media/icons/announcementIcon.png";
import assignmentIcon from "../../../media/icons/assignmentIcon.png";
import discussionIcon from "../../../media/icons/discussionIcon.png";

import "../../../stylesheets/CourseHome.css";

export default function CourseHome() {
  const { url } = useRouteMatch();
  const { courseId } = useParams();
  const { updateHomepage, createMarkup } = useCourse();
  const { userObject, courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const announcements = course?.announcements;
  const assignments = course?.assignments;
  const discussions = course?.discussions?.posts;
  const [isPreview, setisPreview] = useState(true);
  const [isSaved, setisSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  // Handles rich text editor
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  // Handles preview mode
  const [convertedContent, setConvertedContent] = useState(() => {
    return course.homepageContent
      ? draftToHtml(JSON.parse(course.homepageContent))
      : null;
  });
  // Handles on change of editor and changing preview to match
  const handleEditorChange = (state) => {
    setEditorState(state);
    setConvertedContent(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    setisSaved(false);
  };

  async function handleUpdateHomepage() {
    try {
      setLoading(true);
      const rawState = convertToRaw(editorState.getCurrentContent());
      await updateHomepage(courseId, JSON.stringify(rawState));
      setisSaved(true);
      setisPreview(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  return (
    <div className="d-flex flex-grow-1 flex-column">
      <div className="CourseHome-header">
        <h3 className="CourseHome-title ">Home</h3>
        {userObject.isInstructor && isPreview && (
          <div className="d-flex flex-row">
            {!isSaved && (
              <Button variant="outline-warning" active>
                UNSAVED
              </Button>
            )}
            <DropdownButton
              id="dropdown-basic-button"
              className="ml-3"
              variant="secondary"
              title=""
              disabled={loading}
            >
              <Dropdown.Item
                className="Coursehome-dropdown-item"
                onClick={() => {
                  if (isSaved && course.homepageContent)
                    setEditorState(
                      EditorState.createWithContent(
                        convertFromRaw(JSON.parse(course.homepageContent))
                      )
                    );
                  setisPreview(false);
                }}
              >
                Edit Homepage
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to={`${url}/edit`}
                className="Coursehome-dropdown-item"
              >
                Edit Course
              </Dropdown.Item>
            </DropdownButton>
          </div>
        )}
      </div>
      <hr className="mx-0"></hr>
      {isPreview ? (
        <>
          <Container fluid className="p-0">
            <Row>
              <Col xs={8}>
                <div
                  dangerouslySetInnerHTML={createMarkup(convertedContent)}
                ></div>
              </Col>
              <Col xs={4}>
                <h5 className="CourseHome-notification-header">
                  Announcements
                </h5>
                <hr></hr>
                {announcements && (
                  <>
                    {Object.keys(announcements)
                      .sort(
                        (a, b) =>
                          announcements[b].creationDate -
                          announcements[a].creationDate
                      )
                      .slice(0, 3)
                      .map((key) => {
                        return (
                          <Link
                            to={`${url}/announcements/${announcements[key].id}`}
                            className="text-dark"
                            key={key}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={announcementIcon}
                                alt="Logo"
                                width="20"
                                height="20"
                                className="mr-2"
                              />

                              <p className="m-0 CourseHome-notification-text">
                                {announcements[key].title}
                              </p>
                              <p className="m-0 ml-auto CourseHome-notification-text">
                                {new Date(announcements[key].creationDate)
                                  .toISOString()
                                  .slice(0, 10)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    <Link to={`${url}/announcements`} className="text-dark">
                      <div className="d-flex align-items-center mb-2">
                        <p className="m-0">See more...</p>
                      </div>
                    </Link>
                  </>
                )}
                <br></br>
                <h5 className="CourseHome-notification-header"> Assignments</h5>
                <hr></hr>
                {assignments && (
                  <>
                    {Object.keys(assignments)
                      .filter((key) => assignments[key].isPublished)
                      .sort(
                        (a, b) =>
                          assignments[b].creationDate -
                          assignments[a].creationDate
                      )
                      .slice(0, 3)
                      .map((key) => {
                        return (
                          <Link
                            to={`${url}/assignments/${assignments[key].id}`}
                            className="text-dark"
                            key={key}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={assignmentIcon}
                                alt="Logo"
                                width="20"
                                height="20"
                                className="mr-2"
                              />

                              <p className="m-0 CourseHome-notification-text">
                                {assignments[key].title}
                              </p>
                              <p className="m-0 ml-auto CourseHome-notification-text">
                                {new Date(assignments[key].creationDate)
                                  .toISOString()
                                  .slice(0, 10)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    <Link to={`${url}/assignments`} className="text-dark">
                      <div className="d-flex align-items-center mb-2">
                        <p className="m-0">See more...</p>
                      </div>
                    </Link>
                  </>
                )}
                <br></br>
                <h5 className="CourseHome-notification-header">
                  {" "}
                  Discussion Posts
                </h5>
                <hr></hr>
                {discussions && (
                  <>
                    {Object.keys(discussions)
                      .sort(
                        (a, b) =>
                          discussions[b].creationDate -
                          discussions[a].creationDate
                      )
                      .slice(0, 3)
                      .map((key) => {
                        return (
                          <Link
                            to={`${url}/discussion/${discussions[key].id}`}
                            className="text-dark"
                            key={key}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={discussionIcon}
                                alt="Logo"
                                width="20"
                                height="20"
                                className="mr-2"
                              />
                              <p className="m-0 CourseHome-notification-text">
                                {discussions[key].title}
                              </p>
                              <p className="m-0 ml-auto CourseHome-notification-text">
                                {new Date(discussions[key].creationDate)
                                  .toISOString()
                                  .slice(0, 10)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    <Link to={`${url}/discussion`} className="text-dark">
                      <div className="d-flex align-items-center mb-2">
                        <p className="m-0 CourseHome-notification-text">
                          See more...
                        </p>
                      </div>
                    </Link>
                  </>
                )}
                <br></br>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Card className="card-outline-dark mb-5 flex-grow-1">
          <Card.Body className="d-flex">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="wrapper-class d-flex flex-column w-100"
              editorClassName="editor-class flex-grow-1"
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
              variant="success"
              size="sm"
              disabled={loading}
              onClick={handleUpdateHomepage}
            >
              Save Changes
            </Button>
            <Button
              variant="link"
              className="float-right"
              disabled={loading}
              onClick={() => setisPreview(true)}
            >
              Back
            </Button>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}
