import React, { useState, useRef, useEffect } from "react";
import { useCourse } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useRouteMatch } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";

import "../stylesheets/Courses.css";

export default function Courses() {
  const { setMobileHeader } = useTheme();
  const { url } = useRouteMatch();
  // Use authentication context
  const { userObject, courseObjects, currentUser } = useAuth();
  // Use course context
  const { createCourse, joinCourse } = useCourse();
  // Create course form Refs
  const fullTitleRef = useRef();
  const shortTitleRef = useRef();
  const seasonRef = useRef();
  const yearRef = useRef();
  const sectionRef = useRef();
  // Join course id ref
  const courseIdRef = useRef();
  const courseSecretRef = useRef();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMobileHeader("Courses");
  }, [setMobileHeader]);

  // Handles creating a course (Instructors only)
  async function handleCreateCourse(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await createCourse(
        shortTitleRef.current.value,
        fullTitleRef.current.value,
        seasonRef.current.value,
        yearRef.current.value,
        sectionRef.current.value
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowCreate(false);
  }
  // Handles joining a course (Non-Instructors only)
  async function handleJoinCourse(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await joinCourse(courseIdRef.current.value, courseSecretRef.current.value, setError, setMessage);
    } catch (error) {
      console.log(error);
    }
  }

  // Render Courses in which the "inActive" flag is true
  function renderCurrentEnrollment() {
    return (
      courseObjects &&
      courseObjects
        .filter((value) => value.isActive)
        .map((value) => {
          return (
            <Row className="my-3" key={value.id}>
              <Col xs={6}>
                {value.isPublished || value.instructorId === currentUser.uid ? (
                  <Link
                    to={`${url}/${value.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p>
                      {value.shortTitle} - {value.fullTitle}
                    </p>
                  </Link>
                ) : (
                  <p>{value.fullTitle}</p>
                )}
              </Col>
              <Col className="text-right">
                <p>
                  {value.season} {value.year}
                </p>
              </Col>
              <Col className="text-right">
                <p>
                  {value.instructorId === currentUser.uid
                    ? "Instructor"
                    : "Student"}
                </p>
              </Col>
              <Col className="text-right">
                <p>{value.isPublished ? "Yes" : "No"}</p>
              </Col>
            </Row>
          );
        })
    );
  }

  // Render Courses in which the "inActive" flag is false
  function renderPastEnrollment() {
    return (
      courseObjects &&
      courseObjects
        .filter((value) => !value.isActive)
        .map((value) => {
          return (
            <Row className="my-3" key={value.id}>
              <Col xs={6}>
                {value.instructorId === currentUser.uid ? (
                  <Link
                    to={`${url}/${value.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p>
                      {value.shortTitle} - {value.fullTitle}
                    </p>
                  </Link>
                ) : (
                  <p>{value.fullTitle}</p>
                )}
              </Col>
              <Col className="text-right">
                <p>
                  {value.season} {value.year}
                </p>
              </Col>
              <Col className="text-right">
                <p>
                  {value.instructorId === currentUser.uid
                    ? "Instructor"
                    : "Student"}
                </p>
              </Col>
              <Col className="text-right">
                <p>{value.isPublished ? "Yes" : "No"}</p>
              </Col>
            </Row>
          );
        })
    );
  }

  return (
    userObject && (
      <div className="h-100 overflow-auto">
        <div className="home-header">
          <h2>All Courses</h2>
          <hr></hr>
        </div>

        {/* Create/Enroll Button */}
        {userObject.isInstructor ? (
          <Button
            variant="outline-dark"
            className="my-3 ml-2"
            onClick={() => setShowCreate(true)}
          >
            Create a Course
          </Button>
        ) : (
          <Button
            variant="outline-dark"
            className="my-3 ml-2"
            onClick={() => setShowJoin(true)}
          >
            Enroll in a Course
          </Button>
        )}

        {/* Current Enrollments */}
        <Container className="mx-0 my-3">
          <Row className="border-bottom">
            <Col xs={6}>
              <strong>Course</strong>
            </Col>
            <Col className="text-right">
              <strong>Term</strong>
            </Col>
            <Col className="text-right">
              <strong>Enrolled as</strong>
            </Col>
            <Col className="text-right">
              <strong>Published</strong>
            </Col>
          </Row>
          {renderCurrentEnrollment()}
        </Container>

        <br></br>

        <h2>Past Enrollments</h2>
        {/* Past Enrollments */}
        <Container className="m-0">
          <Row className="border-bottom">
            <Col xs={6}>
              <strong>Course</strong>
            </Col>
            <Col className="text-right">
              <strong>Term</strong>
            </Col>
            <Col className="text-right">
              <strong>Enrolled as</strong>
            </Col>
            <Col className="text-right">
              <strong>Published</strong>
            </Col>
          </Row>
          {renderPastEnrollment()}
        </Container>

        {/* Create Course Modal */}
        {userObject.isInstructor ? (
          <Modal
            show={showCreate}
            backdrop="static"
            animation={false}
            size="md"
          >
            <Modal.Header className="pb-0">
              <h5 className="font-weight-light">Create a Course</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateCourse}>
                {/* Course Name */}
                <Form.Row className="mb-3 flex-nowrap">
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Form.Label className="m-0">Course Name</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      className="test"
                      ref={fullTitleRef}
                      type="text"
                      required
                    />
                  </Col>
                </Form.Row>
                {/* Short Name */}
                <Form.Row className="mb-3 flex-nowrap">
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Form.Label className="m-0">Short Name</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control ref={shortTitleRef} type="text" required />
                  </Col>
                </Form.Row>
                {/* Season */}
                <Form.Row className="mb-3 flex-nowrap">
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Form.Label className="m-0">Season</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control ref={seasonRef} as="select" required>
                      <option>Winter</option>
                      <option>Fall</option>
                      <option>Summer</option>
                      <option>Spring</option>
                    </Form.Control>
                  </Col>
                </Form.Row>
                {/* Year */}
                <Form.Row className="mb-3 flex-nowrap">
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Form.Label className="m-0">Year</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      ref={yearRef}
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      defaultValue={new Date().getFullYear()}
                      required
                    ></Form.Control>
                  </Col>
                </Form.Row>
                {/* Section */}
                <Form.Row className="mb-3 flex-nowrap">
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Form.Label className="m-0">Section</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      ref={sectionRef}
                      type="text"
                      required
                    ></Form.Control>
                  </Col>
                </Form.Row>
                <Form.Row className="pt-3 border-top">
                  <Col className="d-flex justify-content-end">
                    <Button
                      disabled={loading}
                      variant="link"
                      className="text-dark"
                      size="sm"
                      onClick={() => setShowCreate(false)}
                    >
                      <strong>Cancel</strong>
                    </Button>
                    <Button
                      disabled={loading}
                      variant="primary"
                      className="ml-2"
                      size="sm"
                      type="submit"
                    >
                      {" "}
                      Create
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </Modal.Body>
          </Modal>
        ) : (
          // Join Course Modal
          <Modal show={showJoin} backdrop="static" animation={false} size="lg">
            <Modal.Header>
              <h4 className="font-weight-light">Join a Course</h4>
            </Modal.Header>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setMessage("")}
              >
                {message}
              </Alert>
            )}
            <Modal.Body>
              <Form onSubmit={handleJoinCourse}>
                <Form.Group>
                  <Form.Control
                    ref={courseIdRef}
                    type="text"
                    placeholder="Course ID"
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    ref={courseSecretRef}
                    type="text"
                    placeholder="Secret Key"
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Row className="mt-3">
                  <Col>
                    <Button variant="primary" size="sm" type="submit">
                      Join Course
                    </Button>
                    <Button
                      disabled={loading}
                      className="float-right"
                      variant="link"
                      onClick={() => setShowJoin(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </Modal.Body>
          </Modal>
        )}
      </div>
    )
  );
}
