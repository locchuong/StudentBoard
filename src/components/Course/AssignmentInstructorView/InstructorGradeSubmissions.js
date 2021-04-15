import React, { useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
  useParams,
} from "react-router-dom";

export default function InstructorViewSubmissions() {
  const { courseId, assignmentId } = useParams();
  const { courseObjects } = useAuth();
  const { updateAssignmentStudentData } = useCourse();
  const assessmentCommentsRef = useRef();
  const assessmentGradeRef = useRef();
  const [filePreview, setFilePreview] = useState(-1); // Handles file preview (Only PDF)
  const [revealIdentity, setRevealIdentity] = useState(false);
  // Initalize courseId's course object
  const course = courseObjects.find(({ id }) => id === courseId);
  // Initalize assignmentId's assignment object
  const assignment =
    course.assignments && course.assignments[assignmentId]
      ? course.assignments[assignmentId]
      : null;
  // Filter ungraded student submissions
  const ungradedSubmissions = Object.keys(course.students).filter((id) => {
    return (
      !course.students[id].assignments[assignmentId].hasBeenGraded &&
      course.students[id].assignments[assignmentId].submission
    );
  });
  // Randomly choose (From the pool of ungraded assignments) a student
  const ranStudentId =
    ungradedSubmissions[Math.floor(Math.random() * ungradedSubmissions.length)];
  // Initialize the random student's submission
  const ranSubmission = ranStudentId
    ? course.students[ranStudentId].assignments[assignmentId]
    : null;
  // Student submission's file attachments to grade
  const files = ranSubmission ? ranSubmission.submission.attachments : null;

  // Handles submiting Instructor's assessment of assignment
  async function handleUpdateAssignmentStudentData(e) {
    e.preventDefault();
    try {
      await updateAssignmentStudentData(
        ranStudentId,
        courseId,
        assignmentId,
        assessmentGradeRef.current.value,
        assessmentCommentsRef.current.value
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container fluid className="h-100">
      {ranSubmission ? (
        <Row className="h-100">
          <Col
            xs={7}
            className="h-100 p-0 d-flex justify-content-center align-items-center"
          >
            {filePreview === -1 ? (
              <Card className="p-2">
                <h5> Select a PDF File to Preview </h5>
              </Card>
            ) : (
              <iframe
                src={files[filePreview].downloadURL}
                title="filePreview"
                width="100%"
                height="100%"
              ></iframe>
            )}
          </Col>
          <Col xs={5} className="h-100 px-2">
            <Card className="h-100 p-3 card-outline-dark">
              <div className="w-100 d-flex justify-content-between">
                <span>
                  <strong>Student: </strong>
                  {revealIdentity
                    ? course.students[ranStudentId].name
                    : "anonymous"}
                </span>
                {!revealIdentity && (
                  <Button
                    size="sm"
                    variant="outline-dark"
                    onClick={() => setRevealIdentity(true)}
                  >
                    Reveal Identity
                  </Button>
                )}
              </div>
              <br></br>
              <span>{ranSubmission.isLate ? "LATE" : ""}</span>
              <div className="d-flex flex-row">
                <strong>Submitted on: </strong>
                <p className="m-0 ml-1">
                  {new Date(
                    ranSubmission.submission.submissionDate
                  ).toLocaleString()}
                </p>
                {ranSubmission.submission.isLate && (
                  <p className="m-0 ml-1" style={{ color: "red" }}>
                    (LATE)
                  </p>
                )}
              </div>
              <br></br>
              <strong>Submitted Files:</strong>
              {files && (
                <>
                  {files.map((value, index) => {
                    return (
                      <div key={value.fileName}>
                        <Button
                          variant="link"
                          disabled={value.fileName.split(".")[1] !== "pdf"}
                          className="text-dark"
                          onClick={() => setFilePreview(index)}
                        >
                          {value.fileName}
                        </Button>
                        <Button variant="link" href={value.downloadURL}>
                          🔽
                        </Button>
                      </div>
                    );
                  })}
                </>
              )}
              <br></br>
              <Form onSubmit={handleUpdateAssignmentStudentData}>
                <Form.Label>
                  <strong>Assessment</strong>
                </Form.Label>
                <Form.Group className="w-50">
                  <Form.Label>
                    Points Alloted out of {assignment.totalPoints}
                  </Form.Label>
                  <Form.Control
                    className="w-50"
                    ref={assessmentGradeRef}
                    type="number"
                    step={0.5}
                    min={0}
                    max={assignment.totalPoints}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    <strong>Instructor's Comments</strong>
                  </Form.Label>
                  <Form.Control
                    ref={assessmentCommentsRef}
                    as="textarea"
                    rows={3}
                  ></Form.Control>
                </Form.Group>
                <Button
                  className="float-right"
                  variant="primary"
                  size="sm"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="h-100">
          <Col className="h-100 d-flex justify-content-center align-items-center">
            {assignment.isPublished ? (
              <h5> All submissions have been graded!</h5>
            ) : (
              <h5> The Assignment has not been published!</h5>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
