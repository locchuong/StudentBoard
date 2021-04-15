import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Container, Row, Col } from "react-bootstrap";
import {
  useParams,
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  useLocation,
  BrowserRouter as Router,
} from "react-router-dom";

import PrivateRoute from "../Auth/PrivateRoute";
import CourseHome from "./Home/CourseHome";
import Announcements from "./Announcements/Announcements";
import AnnouncementPost from "./Announcements/AnnouncementPost";
import Syllabus from "./Syllabus/Syllabus";
import Students from "./Students/Students";
import Files from "./Files/Files";
import Discussion from "./Discussion/Discussion";
import StudentAssignments from "./AssignmentStudentView/StudentAssignments";
import InstructorAssignments from "./AssignmentInstructorView/InstructorAssignments";
import StudentAssignmentPost from "./AssignmentStudentView/StudentAssignmentPost";
import InstructorAssignmentPost from "./AssignmentInstructorView/InstructorAssignmentPost";
import EditCourse from "./EditCourse";
import Gradebook from "./Gradebook/Gradebook";

import "../../stylesheets/Course.css";

export default function Course() {
  const { setMobileHeader } = useTheme();
  const { courseId } = useParams();
  const { url, path } = useRouteMatch();
  const { pathname } = useLocation();
  const { courseObjects, currentUser } = useAuth();
  const { isOverflowAuto } = useTheme();
  const course =
    courseObjects && courseObjects.find(({ id }) => id === courseId);

  useEffect(() => {
    if (course) {
      setMobileHeader(
        `${course?.shortTitle ?? ""} - ${course?.fullTitle ?? ""} - ${
          course?.season ?? ""
        } ${course?.year ?? ""}`
      );
    }
  }, [setMobileHeader, course]);

  function userIsInstructor() {
    return course.instructorId === currentUser.uid;
  }

  return !course ? (
    <div></div>
  ) : (
    <Router>
      <Container fluid className="h-100 d-flex flex-column">
        <Row>
          <Col xs={12} className="course-header">
            {course.shortTitle} - {course.fullTitle} - {course.season}{" "}
            {course.year}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col
            xs={12}
            className="course-navbar d-flex justify-content-around pb-2 pt-2"
          >
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              exact
              to={`${url}`}
            >
              Home
            </NavLink>
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/announcements`}
            >
              Announcements
            </NavLink>
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/syllabus`}
            >
              Syllabus
            </NavLink>
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/assignments`}
            >
              Assignments
            </NavLink>
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/students`}
            >
              Students
            </NavLink>
            {userIsInstructor() && (
              <NavLink
                className="course-link"
                activeClassName="course-active-link"
                to={`${url}/gradebook`}
              >
                Gradebook
              </NavLink>
            )}
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/files`}
            >
              Files
            </NavLink>
            <NavLink
              className="course-link"
              activeClassName="course-active-link"
              to={`${url}/discussion`}
            >
              Discussion
            </NavLink>
          </Col>
        </Row>
        <Row
          className={`mt-2 pt-2 flex-grow-1 ${
            isOverflowAuto ? "overflow-auto" : ""
          }`}
        >
          <Col xs={12} className="course-content pl-0 pr-0 d-flex flex-column">
            <Switch>
              <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
              <PrivateRoute exact path={`${path}`} component={CourseHome} />
              <PrivateRoute
                exact
                path={`${path}/announcements`}
                component={Announcements}
              />
              <PrivateRoute
                exact
                path={`${path}/syllabus`}
                component={Syllabus}
              />
              <PrivateRoute
                exact
                path={`${path}/assignments`}
                component={
                  userIsInstructor()
                    ? InstructorAssignments
                    : StudentAssignments
                }
              />
              <PrivateRoute
                exact
                path={`${path}/assignments/:assignmentId`}
                component={
                  userIsInstructor()
                    ? InstructorAssignmentPost
                    : StudentAssignmentPost
                }
              />
              <PrivateRoute
                exact
                path={`${path}/assignments/:assignmentId/gradeSubmissions`}
                component={() => (
                  <Redirect to={`/courses/${courseId}/assignments`} />
                )}
              />
              <PrivateRoute
                exact
                path={`${path}/assignments/:assignmentId/edit`}
                component={() => (
                  <Redirect to={`/courses/${courseId}/assignments`} />
                )}
              />
              <PrivateRoute
                exact
                path={`${path}/students`}
                component={Students}
              />
              <PrivateRoute exact path={`${path}/files`} component={Files} />
              <PrivateRoute
                path={`${path}/discussion`}
                component={Discussion}
              />
              <PrivateRoute
                exact
                path={`${path}/announcements/:announcementId`}
                component={AnnouncementPost}
              />
              <PrivateRoute
                exact
                path={`${path}/edit`}
                component={() => {
                  return userIsInstructor() ? (
                    <EditCourse />
                  ) : (
                    <Redirect to={`/courses/${courseId}`} />
                  );
                }}
              />
              <PrivateRoute
                exact
                path={`${path}/gradebook`}
                component={() => {
                  return userIsInstructor() ? (
                    <Gradebook />
                  ) : (
                    <Redirect to={`/courses/${courseId}`} />
                  );
                }}
              />
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
