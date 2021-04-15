import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../contexts/CourseContext";
import { useParams, Link } from "react-router-dom";

import {
  Button,
  Container,
  Row,
  Tooltip,
  OverlayTrigger,
  Form,
  Col,
  Alert,
} from "react-bootstrap";
import helpIcon from "../../media/icons/helpIcon.png";

export default function EditCourse() {
  const { courseId } = useParams();
  const { courseObjects } = useAuth();
  const { updateCourse } = useCourse();
  const course = courseObjects.find(({ id }) => id === courseId);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isActive, setisActive] = useState(course.isActive);
  const [isPublished, setisPublished] = useState(course.isPublished);

  const fullTitleRef = useRef();
  const shortTitleRef = useRef();
  const seasonRef = useRef();
  const yearRef = useRef();
  const sectionRef = useRef();

  async function handleUpdateCourse(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");
      await updateCourse(
        course.id,
        fullTitleRef.current.value,
        shortTitleRef.current.value,
        seasonRef.current.value,
        yearRef.current.value,
        sectionRef.current.value,
        isActive,
        isPublished
      );
    } catch (error) {
      setError("An error has occured!");
      console.log(error);
    }
    setLoading(false);
    setMessage("Successfully saved changes!");
  }

  // Renders the tooltip for the Secret Key checkbox
  const renderSecretTooltip = (props) => (
    <Tooltip {...props}>
      The Secret Key is a password shared to Students so that they may join the
      Course. Note that Students need both the Course Id and the Secret Key
      shown here to join the Course.
    </Tooltip>
  );

  // Renders the tooltip for the isActive checkbox
  const renderActiveTooltip = (props) => (
    <Tooltip {...props}>
      Courses which are active are shown on the dashboard and seen as a current
      enrollment. An inactive course is removed from the dashboard and moved to
      past enrollments.
    </Tooltip>
  );

  // Renders the tooltip for the isPublished checkbox
  const renderPublishTooltip = (props) => (
    <Tooltip {...props}>
      Courses which are published can be joined by students via the Courses
      page. An unpublished course blocks prospective students from joining it.
      Published courses may <b className="text-warning">NOT</b> be unpublished.
    </Tooltip>
  );

  return (
    <div className="d-flex flex-grow-1 flex-column">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      <h5>Course Settings</h5>

      <hr className="mx-0"></hr>

      <Form className="flex-grow-1" onSubmit={handleUpdateCourse}>
        <Container fluid>
          <Row>
            <Col>
              {/* Course Name */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Course Name</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    defaultValue={course.fullTitle}
                    ref={fullTitleRef}
                    disabled={loading}
                    required
                  />
                </Col>
              </Form.Row>
              {/* Short Name */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Short Name</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    defaultValue={course.shortTitle}
                    ref={shortTitleRef}
                    disabled={loading}
                    required
                  />
                </Col>
              </Form.Row>
              {/* Season */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Season</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    defaultValue={course.season}
                    ref={seasonRef}
                    disabled={loading}
                    required
                  >
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
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Year</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    defaultValue={course.year}
                    ref={yearRef}
                    disabled={loading}
                    required
                  ></Form.Control>
                </Col>
              </Form.Row>
              {/* Section */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Section</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    defaultValue={course.section}
                    ref={sectionRef}
                    disabled={loading}
                    required
                  ></Form.Control>
                </Col>
              </Form.Row>
              {/* Course ID */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Course ID</Form.Label>
                </Col>
                <Col>
                  <Form.Control type="text" defaultValue={course.id} disabled />
                </Col>
              </Form.Row>
              {/* Secrey Key */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Secret Key</Form.Label>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderSecretTooltip}
                  >
                    <img
                      src={helpIcon}
                      alt="Logo"
                      width="20"
                      height="20"
                      className="ml-2"
                    />
                  </OverlayTrigger>
                </Col>
                <Col>
                  {!showSecret && (
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => setShowSecret(true)}
                    >
                      Reveal
                    </Button>
                  )}
                  <Form.Control
                    type="text"
                    defaultValue={course.secretKey}
                    hidden={!showSecret}
                    disabled
                  />
                </Col>
              </Form.Row>
              {/* isActive */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Active</Form.Label>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderActiveTooltip}
                  >
                    <img
                      src={helpIcon}
                      alt="Logo"
                      width="20"
                      height="20"
                      className="ml-2"
                    />
                  </OverlayTrigger>
                </Col>
                <Col>
                  <Form.Check
                    checked={isActive}
                    disabled={loading}
                    onChange={(e) => {
                      setisActive(e.target.checked);
                    }}
                  ></Form.Check>
                </Col>
              </Form.Row>
              {/* isPublished */}
              <Form.Row className="mb-3 flex-nowrap">
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Form.Label className="m-0">Publish</Form.Label>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderPublishTooltip}
                  >
                    <img
                      src={helpIcon}
                      alt="Logo"
                      width="20"
                      height="20"
                      className="ml-2"
                    />
                  </OverlayTrigger>
                </Col>
                <Col>
                  <Form.Check
                    checked={isPublished}
                    disabled={loading || course.isPublished}
                    onChange={(e) => {
                      setisPublished(e.target.checked);
                    }}
                  ></Form.Check>
                </Col>
              </Form.Row>
              <Row className="d-flex justify-content-end">
                <Button size="sm" variant="link" disabled={loading}>
                  <Link to={`/courses/${course.id}`} className="text-dark">
                    <strong>Cancel</strong>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="ml-2"
                  type="submit"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Row>
            </Col>
            {/* Right Form */}
            <Col></Col>
          </Row>
        </Container>
      </Form>
    </div>
  );
}
