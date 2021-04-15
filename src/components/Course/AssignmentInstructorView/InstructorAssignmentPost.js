import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import {
  useParams,
  Link,
  useRouteMatch,
  Switch,
  useHistory,
  BrowserRouter as Router,
} from "react-router-dom";
import PrivateRoute from "../../Auth/PrivateRoute";
import InstructorViewSubmissions from "./InstructorViewSubmissions";
import InstructorGradeSubmissions from "./InstructorGradeSubmissions";
import InstructorAssignmentEdit from "./InstructorAssignmentEdit";
import "../../../stylesheets/InstructorAssignmentPost.css";

export default function InstructorAssignmentPost() {
  const { url, path } = useRouteMatch();
  const { courseId, assignmentId } = useParams();
  const { courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const assignment =
    course.assignments && course.assignments[assignmentId]
      ? course.assignments[assignmentId]
      : null;
  const [message, setMessage] = useState("");
  const history = useHistory();
  return (
    <Router>
      <div className="I-assignment-post-wrapper">
        <div className="I-assignment-post-left p-4">
          <div className="d-flex justify-content-between w-100">
            <Button
              variant="link"
              className="p-0 text-white"
              onClick={() => history.push(`/courses/${courseId}/assignments`)}
            >
              {"<< Back"}
            </Button>
            <Button
              variant={
                assignment.isPublished ? "outline-success" : "outline-danger"
              }
              active
              className="font-weight-bold"
              size="sm"
            >
              {assignment.isPublished ? "Published" : "Private"}
            </Button>
          </div>
          <br></br>
          <h4 className="text-white">{assignment.title}</h4>
          <br></br>
          <Link to={`${url}`}>
            <Button variant="link" className="p-0 text-white">
              View Submissions
            </Button>
          </Link>
          <Link to={`${url}/gradeSubmissions`}>
            <Button variant="link" className="p-0 text-white">
              Grade Submissions
            </Button>
          </Link>
          <Link to={`${url}/edit`} className="mt-auto ">
            <Button variant="light" className="font-weight-bold">
              Edit
            </Button>
          </Link>
        </div>
        <div className="I-assignment-post-right p-4">
          {message && (
            <Alert variant="success" className="mb-4" dismissible onClose={() => setMessage("")}>
              {message}
            </Alert>
          )}
          <Switch>
            <PrivateRoute
              exact
              path={`${path}`}
              component={() => <InstructorViewSubmissions />}
            />
            <PrivateRoute
              exact
              path={`${path}/gradeSubmissions`}
              component={() => <InstructorGradeSubmissions />}
            />
            <PrivateRoute
              exact
              path={`${path}/edit`}
              component={() => (
                <InstructorAssignmentEdit
                  courseId={courseId}
                  assignment={assignment}
                  setMessage={setMessage}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}
