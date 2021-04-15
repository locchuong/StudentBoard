import React, {  } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Container, Row, Col } from "react-bootstrap";
import "../../../stylesheets/Students.css";

export default function Students() {
  const { courseId } = useParams();
  const { courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const students = course && course.students ? course.students : null;
  return (
    <div>
      <div className="students-header">
        <h3>Students</h3>
      </div>
      <hr></hr>
      <Container fluid className="pt-3 pl-5 pr-5">
        <Row className="p-3" style={{ borderBottom: "1px solid lightgrey" }}>
          <Col>
            <h5 className="text-muted">Name</h5>
          </Col>
          <Col className="d-flex justify-content-center">
            <h5 className="text-muted">Section</h5>
          </Col>
          <Col className="text-right">
            <h5 className="text-muted">Role</h5>
          </Col>
        </Row>
        <Row className="p-3">
          <Col>
            <strong>{course.instructorName}</strong>
          </Col>
          <Col className="d-flex justify-content-center">
            <strong>All</strong>
          </Col>
          <Col className="text-right">
            <strong>Instructor</strong>
          </Col>
        </Row>
        {students &&
          Object.keys(students).map((key, index) => {
            return (
              <Row className="p-3" key={key}>
                <Col>
                  <strong>{students[key].name}</strong>
                </Col>
                <Col className="d-flex justify-content-center">
                  <strong>{course.section}</strong>
                </Col>
                <Col className="text-right">
                  <strong>Student</strong>
                </Col>
              </Row>
            );
          })}
      </Container>
    </div>
  );
}
