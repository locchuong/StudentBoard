import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function InstructorViewSubmissions() {
  const { courseId, assignmentId } = useParams();
  const { courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const assignment =
    course.assignments && course.assignments[assignmentId]
      ? course.assignments[assignmentId]
      : null;
  const [isAnonymous, setisAnonymous] = useState(true);
  return (
    <Container fluid>
      <Row>
        <Col className="d-flex justify-content-between">
          <h5>
            {" "}
            {course?.students
              ? `${Object.keys(course.students).length} ${
                  Object.keys(course.students).length === 1
                    ? "Student"
                    : "Students"
                }`
              : "0 Students"}
          </h5>
          <Button
            variant="outline-dark"
            size="sm"
            className="ml-auto"
            onClick={() => setisAnonymous((prevState) => !prevState)}
          >
            Reveal Identity
          </Button>
        </Col>
      </Row>
      <Row className="border-bottom mt-3">
        <Col>
          <strong>Name</strong>
        </Col>
        <Col>
          <strong>Id</strong>
        </Col>
        <Col className="d-flex justify-content-center">
          <strong>Score</strong>
        </Col>
        <Col className="d-flex justify-content-center">
          <strong>Graded?</strong>
        </Col>
        <Col className="d-flex justify-content-center">
          <strong>Late?</strong>
        </Col>
        <Col>
          <strong>Submission</strong>
        </Col>
      </Row>
      {course.students &&
        Object.keys(course.students).map((id) => {
          const assignmentStudentData =
            course.students[id].assignments[assignmentId];
          return (
            <Row key={id} className="mt-2">
              <Col>{isAnonymous ? "Anonymous" : course.students[id].name}</Col>
              <Col className="text-truncate">{id}</Col>
              <Col className="d-flex justify-content-center">
                {assignmentStudentData.hasBeenGraded
                  ? `${assignmentStudentData.grade}/${assignment.totalPoints}`
                  : "❌"}
              </Col>
              <Col className="d-flex justify-content-center">
                {assignmentStudentData.hasBeenGraded ? "✔️" : "❌"}
              </Col>
              <Col className="d-flex justify-content-center">
                {assignmentStudentData.submission
                  ? assignmentStudentData.submission.isLate
                    ? "✔️"
                    : "❌"
                  : "NA"}
              </Col>
              <Col>
                {assignmentStudentData.submission
                  ? new Date(
                      assignmentStudentData.submission.submissionDate
                    ).toLocaleString()
                  : "No submission"}
              </Col>
            </Row>
          );
        })}
    </Container>
  );
}
