import React, { } from "react";
import "../../../stylesheets/Assignments.css";
import { useParams, Link, useRouteMatch } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";

export default function StudentAssignments() {
  const { courseObjects, currentUser } = useAuth();
  const {  url } = useRouteMatch();
  const { courseId } = useParams();
  const course = courseObjects.find(({ id }) => id === courseId);

  function renderAssignments() {
    let jsx = [];
    if (course.assignments) {
      Object.keys(course.assignments)
        .sort(
          (a, b) =>
            course.assignments[b].creationDate -
            course.assignments[a].creationDate
        ).filter((key) => course.assignments[key].isPublished)
        .forEach((key) => {
          const assignment = course.assignments[key];
          const assignmentStudentData = course.students[currentUser.uid].assignments[key];
          const hasSubmitted = assignmentStudentData.submission ? true : false;
          const hasBeenGraded = assignmentStudentData.hasBeenGraded ? true : false;
          jsx.push(
            <Row
              className="p-3"
              style={{ borderBottom: "1px solid lightgrey" }}
              key={key}
            >
              <Col>
                <Link to={`${url}/${key}`} style={{ color: "black" }}>
                  <strong className="mb-0">{course.assignments[key].title}</strong>
                </Link>
              </Col>
              <Col className="d-flex justify-content-start align-items-center">
                <div
                  className="rounded-circle assignment-submission"
                  style={
                    hasSubmitted
                      ? { backgroundColor: "teal" }
                      : { backgroundColor: "gold" }
                  }
                ></div>
                <strong className="mb-0 ml-2">
                  {hasBeenGraded
                    ? `${assignmentStudentData.grade}/${assignment.totalPoints}`
                    : hasSubmitted
                    ? "Submitted!"
                    : "No Submission"}
                </strong>
              </Col>
              <Col className="text-right">
                <strong className="mb-0">
                  {new Date(
                    course.assignments[key].creationDate
                  ).toDateString()}
                </strong>
              </Col>
              <Col className="text-right">
                <strong className="mb-0">
                  {new Date(course.assignments[key].dueDate).toLocaleString()}
                </strong>
              </Col>
            </Row>
          );
        });
    } else {
      jsx.push(
        <div key="#noassignments">
          <h5>No Assignments</h5>
        </div>
      );
    }
    return (
      <Container fluid className="pt-3 pl-5 pr-5">
        <Row className="p-3" style={{ borderBottom: "1px solid lightgrey" }}>
          <Col>
            <h5 className="text-muted">Name</h5>
          </Col>
          <Col>
            <h5 className="text-muted">Status</h5>
          </Col>
          <Col className="text-right">
            <h5 className="text-muted">Posted</h5>
          </Col>
          <Col className="text-right">
            <h5 className="text-muted">Due</h5>
          </Col>
        </Row>
        {jsx}
      </Container>
    );
  }

  return (
    <div>
      <div className="assignments-header">
        <h3> Assignments</h3>
      </div>
      <hr></hr>
      {renderAssignments()}
    </div>
  );
}
