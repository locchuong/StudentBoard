import React, { useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import { useParams } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import "../../../stylesheets/StudentAssignmentPost.css";

export default function StudentAssignmentPost() {
  const fileInputRef = useRef();
  const { courseId, assignmentId } = useParams();
  const { addSubmission, createMarkup, removePreviousSubmission } = useCourse();
  const { currentUser, courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const userAssignmentData =
    course.students[currentUser.uid].assignments[assignmentId];
  const assignment =
    course.assignments && course.assignments[assignmentId]
      ? course.assignments[assignmentId]
      : null;
  const [selectedFiles, setSelectedFiles] = useState();
  const [message, setMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const convertedContent =
    assignment && assignment.content
      ? draftToHtml(JSON.parse(assignment.content))
      : null;
  async function handleAddSubmission(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const submissionDate = new Date().valueOf();
      const isLate = submissionDate > assignment.dueDate ? true : false;
      await removePreviousSubmission(courseId, assignmentId);
      await addSubmission(
        courseId,
        assignmentId,
        selectedFiles,
        submissionDate,
        isLate,
        null
      );
      setMessage("Successfully submitted assignment!");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  return (
    <div>
      <Container fluid className="p-md-0">
        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}
        <Row noGutters className="border-bottom">
          <Col>
            <h3>{assignment.title}</h3>
          </Col>
        </Row>
        <Row noGutters>
          <Col xs={8} className="pt-4">
            <div
              className="pl-4 pr-4"
              style={{ minHeight: "200px" }}
              dangerouslySetInnerHTML={createMarkup(convertedContent)}
            ></div>
            {assignment.attachments && (
              <div className="pl-4 pr-4">
                <h5>Attachments</h5>
                <div className="d-flex flex-column align-items-start border-bottom">
                  {Array.from(assignment.attachments).map((fileObj) => {
                    return (
                      <Button
                        key={`${fileObj.fileName}`}
                        disabled={loading}
                        variant="link"
                        href={fileObj.downloadURL}
                      >
                        {fileObj.fileName}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="pl-4 pr-4 pt-2 d-flex justify-content-between">
              <span>
                <strong>Due: </strong>
                {new Date(assignment.dueDate).toLocaleString()}
              </span>
              <span>
                <strong>Posted on: </strong>
                {new Date(assignment.creationDate).toISOString().slice(0, 10)}
              </span>
            </div>
          </Col>
          <Col xs={4} className="pt-4">
            <h5>Submission</h5>
            <hr></hr>
            <strong>Status: </strong>
            {!userAssignmentData.submission ? (
              "No submission"
            ) : (
              <>
                <span>
                  Submitted on{" "}
                  {new Date(
                    userAssignmentData.submission.submissionDate
                  ).toLocaleString()}
                </span>
                <br></br>
                {userAssignmentData.submission.attachments && (
                  <>
                    <strong>Files: </strong>
                    <div className="d-flex flex-column align-items-start">
                      {Array.from(
                        userAssignmentData.submission.attachments
                      ).map((fileObj) => {
                        return (
                          <Button
                            key={`${fileObj.fileName}`}
                            disabled={loading}
                            variant="link"
                            href={fileObj.downloadURL}
                          >
                            {fileObj.fileName}
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
            <br></br>
            <strong>Grade: </strong>
            {userAssignmentData.hasBeenGraded
              ? `${userAssignmentData.grade}/${assignment.totalPoints}`
              : "Not graded"}
            <br></br>
            {userAssignmentData.assessmentComments && (
              <>
                <br></br>
                <strong>Instructor's Comments:</strong>
                <Card className="mt-3 p-3">
                  <p className="m-0">{userAssignmentData.assessmentComments}</p>
                </Card>
              </>
            )}
            {/* File upload appears if not graded and not past due/}
            {/* !userAssignmentData.hasBeenGraded && (now time < due time) */}
            {!userAssignmentData.hasBeenGraded && (
              <>
                <br></br>
                <br></br>
                <Card>
                  <Card.Header>
                    <h5>File Upload</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>Supported file types: PDF/DOCX/DOC</p>
                    <Form onSubmit={handleAddSubmission}>
                      {fileError && (
                        <Alert
                          variant="warning"
                          onClose={() => setFileError("")}
                          dismissible
                        >
                          {fileError}
                        </Alert>
                      )}
                      <Form.File
                        ref={fileInputRef}
                        className="d-none"
                        multiple
                        onChange={(e) => {
                          let isValid = true;
                          Array.from(e.target.files).forEach((file) => {
                            if (
                              file.type !==
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                              file.type !== "application/pdf" &&
                              file.type !== "application/msword"
                            ) {
                              setFileError("Invalid file type(s)");
                              setSelectedFiles(null);
                              isValid = false;
                            }
                          });
                          if (isValid) {
                            setFileError("");
                            setSelectedFiles(e.target.files);
                          }
                        }}
                      ></Form.File>
                      {selectedFiles && (
                        <>
                          <Card className="mt-2 border-0">
                            <Card.Header className="p-1">
                              <p className="m-0">Selected Files</p>
                            </Card.Header>
                            <Card.Body className="pl-2">
                              {Array.from(selectedFiles).map((file) => {
                                return <p className="m-0">{file.name} ✔️</p>;
                              })}
                            </Card.Body>
                          </Card>
                        </>
                      )}
                      <br></br>
                      <Button
                        disabled={loading}
                        className="float-right"
                        variant="primary"
                        size="sm"
                        type="submit"
                      >
                        Submit Assignment
                      </Button>
                      <Button
                        disabled={loading}
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Upload File
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
