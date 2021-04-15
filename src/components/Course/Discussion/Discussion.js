import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import PrivateRoute from "../../Auth/PrivateRoute";
import {
  useParams,
  Link,
  NavLink,
  useRouteMatch,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import "../../../stylesheets/Discussion.css";

//DraftJS Editor
import { convertFromRaw } from "draft-js";
import DiscussionPost from "./DiscussionPost";
import DiscussionNewPost from "./DiscussionNewPost";
import DiscussionFolderManager from "./DiscussionFolderManager";
import DiscussionHome from "./DiscussionHome";
import homeIcon from "../../../media/icons/homeIcon.png";
import folderIcon from "../../../media/icons/folderIcon.png";
import searchIcon from "../../../media/icons/searchIcon.svg";

export default function Discussion() {
  // Theme Context
  const { setisOverflowAuto } = useTheme();
  // DraftJS
  const { courseId } = useParams();
  const { currentUser, courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const { url, path } = useRouteMatch();
  const [folderFilter, setFolderFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);

  function renderDiscussions() {
    return (
      <Container fluid>
        {course?.discussions?.posts &&
          Object.keys(course.discussions.posts)
            // Sort discussion posts by creation date
            .sort(
              (a, b) =>
                course.discussions.posts[b].creationDate -
                course.discussions.posts[a].creationDate
            )
            // Discussion posts by Instructor are pinned to the top
            .sort((a, b) => {
              if (
                course.discussions.posts[a].authorId !== course.instructorId
              ) {
                return 1;
              } else if (
                course.discussions.posts[b].authorId !== course.instructorId
              ) {
                return -1;
              } else {
                return 1;
              }
            })
            // Students can only see public posts && their own private posts
            // Instructors see all posts
            .filter(
              currentUser.uid === course.instructorId
                ? (key) => true
                : (key) =>
                    course.discussions.posts[key].isPostPublic ||
                    course.discussions.posts[key].authorId === currentUser.uid
            )
            // If a folder is selected, filter Discussion posts by folder
            .filter(
              !folderFilter
                ? (key) => true
                : (key) => course.discussions.posts[key].folder === folderFilter
            )
            // If search bar not empty, filter Discussion posts by search bar
            .filter(
              !searchFilter
                ? (key) => true
                : (key) =>
                    handleSearchFilter(
                      course.discussions.posts[key].title,
                      convertFromRaw(
                        JSON.parse(course.discussions.posts[key].content)
                      ).getPlainText()
                    )
            )
            .map((key) => {
              const instructorHasCommented = course?.discussions?.posts?.[key]
                ?.comments
                ? Object.keys(course.discussions.posts[key].comments).some(
                    (keyC) =>
                      course.discussions.posts[key].comments[keyC].byInstructor
                  )
                : false;
              const studentHasCommented = course?.discussions?.posts?.[key]
                ?.comments
                ? Object.keys(course.discussions.posts[key].comments).some(
                    (keyC) =>
                      !course.discussions.posts[key].comments[keyC].byInstructor
                  )
                : false;
              return (
                <NavLink to={`${url}/${key}`} className="discussion-post-link" activeClassName="discussion-post-active-link" key={key}>
                  <Row className="discussion-post mb-1">
                    <Col xs={9} className="pr-1">
                      {course.discussions.posts[key].authorId ===
                      course.instructorId ? (
                        <div className="discussion-post-author-instructor"></div>
                      ) : (
                        <div className="discussion-post-author-student"></div>
                      )}
                      <p className="discussion-post-text font-weight-bold">
                        {course.discussions.posts[key].title}
                      </p>
                      <p className="discussion-post-text">
                        {convertFromRaw(
                          JSON.parse(course.discussions.posts[key].content)
                        ).getPlainText()}
                      </p>
                    </Col>
                    <Col>
                      <p className="discussion-post-date text-dark">
                        {new Date(course.discussions.posts[key].creationDate)
                          .toISOString()
                          .slice(0, 10)}
                      </p>
                      <div className="discussion-post-notifications">
                        {studentHasCommented && (
                          <div className="discussion-post-student-commented">
                            <strong className="text-light">s</strong>
                          </div>
                        )}
                        {instructorHasCommented && (
                          <div className="discussion-post-instructor-commented ml-1">
                            <strong className="text-light">i</strong>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </NavLink>
              );
            })}
      </Container>
    );
  }

  const handleSearchFilter = (title, content) => {
    // Parse search filter and title to useable format
    const searchFilterParsed = searchFilter.toLowerCase().substring(0, 3);
    const titleParsed = title.substring(0, 3).toLowerCase();
    // Define search pattern using search filter
    const pattern = searchFilterParsed
      .split("")
      .map((x) => {
        return `(?=.*${x})`;
      })
      .join("");
    // Define regex using search pattern
    const regex = new RegExp(`${pattern}`, "g");
    return (
      // Search title by includes
      title.toLowerCase().includes(searchFilterParsed) ||
      // Search content by includes
      content.toLowerCase().includes(searchFilterParsed) || 
      // Search by regex
      titleParsed.match(regex)
    );
  };

  useEffect(() => {
    setisOverflowAuto(true);
    return () => {
      setisOverflowAuto(false);
    }
  }, [setisOverflowAuto])
  
  return (
    <Router>
      <div className="discussion-wrapper d-flex h-100 flex-column">
        <div className="discussion-header flex-grow-0 p-1">
          <Link to={`${url}`}>
            <Button variant="light" size="sm">
              <img src={homeIcon} alt="Logo" width="20" height="20" />
            </Button>
          </Link>
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
                    <Button
                      key={key}
                      className="ml-2"
                      variant="discussion-folder"
                      size="sm"
                      active={folderFilter === key}
                      onClick={() => setFolderFilter(key)}
                    >
                      <img
                        src={folderIcon}
                        alt="Logo"
                        width="20"
                        height="20"
                        style={{ filter: "invert(1)" }}
                        className="mr-1"
                      />
                      {course.discussions.folders[key].folderName}
                    </Button>
                  );
                })}
            </>
          )}
        </div>
        <div className="d-flex flex-row flex-grow-1 overflow-auto">
          <div className="discussion-left pt-2 pr-2">
            <div className="position-relative mb-2">
              <img
                src={searchIcon}
                alt="Logo"
                width="20"
                height="20"
                className="discussion-searchbar-icon"
              />
              <Form.Control
                className="discussion-searchbar"
                type="text"
                size="sm"
                placeholder="Search for posts"
                onKeyUp={(e) => setSearchFilter(e.target.value)}
              />
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <Link
                to={`${url}/new`}
                className="text-decoration-none flex-grow-1 mr-2"
              >
                <Button className="discussion-new-post w-100 h-100">
                  New Post
                </Button>
              </Link>
              {currentUser.uid === course.instructorId && (
                <Link to={`${url}/folders`}>
                  <Button className="discussion-new-post discussion-add-folder p-2">
                    <img src={folderIcon} alt="Logo" width="20" height="20" />
                  </Button>
                </Link>
              )}
            </div>
            {folderFilter && (
              <Alert
                className="discussion-folder-filter"
                dismissible
                onClose={() => setFolderFilter(null)}
                size="sm"
              >
                Filtering on:{" "}
                <strong>
                  {course.discussions.folders?.[folderFilter]?.folderName}
                </strong>
              </Alert>
            )}
            {renderDiscussions()}
          </div>
          <div className="discussion-right p-4">
            <Switch>
              <PrivateRoute exact path={`${path}`} component={DiscussionHome} />
              <PrivateRoute
                exact
                path={`${path}/new`}
                component={DiscussionNewPost}
              />
              {currentUser.uid === course.instructorId && (
                <PrivateRoute
                  exact
                  path={`${path}/folders`}
                  component={DiscussionFolderManager}
                />
              )}
              <PrivateRoute
                exact
                path={`${path}/:discussionId`}
                component={(props) => (
                  <DiscussionPost
                    key={props.match.params.discussionId}
                    setFolderFilter={setFolderFilter}
                    {...props}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}
