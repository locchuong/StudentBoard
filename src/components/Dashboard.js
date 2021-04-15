import React, {useEffect}  from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

import assignmentIcon from "../media/icons/assignmentIcon.png";
import announcementIcon from "../media/icons/announcementIcon.png";

import "../stylesheets/Dashboard.css";

export default function Dashboard() {
  // Use authentication context
  const { userObject, courseObjects } = useAuth();
  const { url } = useRouteMatch();
  const { setMobileHeader} = useTheme();

  useEffect(() => {
    setMobileHeader("Dashboard")
  }, [setMobileHeader])

  function renderCourses() {
    return (
      <Row>
        {/* Render Course Cards */}
        {courseObjects &&
          courseObjects
            .filter((value) => value.isActive)
            .map((value) => {
              return (
                <Col sm={12} md={6} xl={3} key={value.id}>
                  <Link
                    to={`${url}courses/${value.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card className="dashboard-course-card my-3">
                      <h5>
                        {value.shortTitle} - {value.section}
                      </h5>
                      <p>
                        {value.shortTitle} - {value.fullTitle} -{" "}
                        {value.instructorName} [
                        {value.season.slice(0, 2).toUpperCase()}
                        {value.year.slice(-2)}]
                      </p>
                      {userObject.isInstructor && (
                        <Button
                          className="dashboard-course-active"
                          size="sm"
                          active
                          variant={
                            value.isPublished
                              ? "outline-success"
                              : "outline-danger"
                          }
                        >
                          {value.isPublished ? "Published" : "Unpublished"}
                        </Button>
                      )}
                    </Card>
                  </Link>
                </Col>
              );
            })}
      </Row>
    );
  }

  return (
    <div className="d-flex flex-grow-1 flex-column">
      <div className="home-header">
        <h2> Dashboard</h2>
        <hr className="mx-0"></hr>
      </div>
      <Container fluid className="flex-grow-1 px-0">
        <Row>
          <Col sm={12} md={12} lg={8}>
            <p>
              {" "}
              Additional courses, including those from previous quarters, may be
              found in the <Link to={`/courses`}>All Courses</Link> page.
            </p>
            {renderCourses()}
          </Col>
          <Col>
            <strong>Upcoming Assignments</strong>
            <hr className="my-1"></hr>
            {courseObjects &&
              courseObjects
                .filter((course) => course.isActive)
                .map((course) => {
                  return (
                    course?.assignments &&
                    Object.keys(course.assignments)
                      // Filter for dueDate is less than current time
                      .filter(
                        (filterKey) =>
                          course.assignments[filterKey].dueDate >
                          new Date().valueOf()
                      )
                      // Sort by dueDate (ascending)
                      .sort(
                        (a, b) =>
                          course.assignments[b].dueDate -
                          course.assignments[a].dueDate
                      )
                      .map((key) => {
                        const hours = new Date(
                          course.assignments[key].dueDate
                        ).getHours();
                        const hoursString = `${
                          hours === 0 ? "12" : hours % 12
                        } ${hours >= 12 ? "PM" : "AM"}`;
                        return (
                          <div className="d-flex flex-row" key={key}>
                            <div>
                              <img
                                src={assignmentIcon}
                                alt="assignmentIcon"
                                width="20"
                                height="20"
                                className="mr-2"
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <Link
                                to={`/courses/${course.id}/assignments/${key}`}
                                key={key}
                              >
                                {course.assignments[key].title}
                              </Link>

                              <strong className="m-0 text-black-50">
                                {course.shortTitle} - {course.section} -{" "}
                                {course.fullTitle}
                              </strong>
                              <p className="m-0 ">
                                Due{" "}
                                {new Date(course.assignments[key].dueDate)
                                  .toString()
                                  .slice(3, 10)}{" "}
                                at {hoursString}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  );
                })}

            <br></br>

            <strong>Recent Announcements</strong>
            <hr className="my-1"></hr>
            {courseObjects &&
              courseObjects
                .filter((course) => course.isActive)
                .map((course) => {
                  return (
                    course?.announcements &&
                    Object.keys(course.announcements)
                      // Only show announcements in the last 3 days
                      .filter(
                        (fKey) =>
                          course.announcements[fKey].creationDate >
                          new Date().valueOf() - 1000 * 60 * 60 * 24 * 3
                      )
                      .map((key) => {
                        return (
                          <div className="d-flex flex-row" key={key}>
                            <div>
                              <img
                                src={announcementIcon}
                                alt="announcementIcon"
                                width="20"
                                height="20"
                                className="mr-2"
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <Link
                                to={`/courses/${course.id}/announcements/${key}`}
                                key={key}
                              >
                                {course.announcements[key].title}
                              </Link>

                              <strong className="m-0 text-black-50">
                                {course.shortTitle} - {course.section} -{" "}
                                {course.fullTitle}
                              </strong>
                              <p className="m-0 ">
                                {new Date(
                                  course.announcements[key].creationDate
                                )
                                  .toString()
                                  .slice(3, 10)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  );
                })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
