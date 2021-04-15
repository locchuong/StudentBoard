import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function Gradebook() {
  const { courseId } = useParams();
  const { courseObjects } = useAuth();

  // Store the course object from real-time db
  const course =
    courseObjects && courseObjects.find(({ id }) => id === courseId);
  // Store student data in course
  const students = course?.students;
  // Store assignments data in course
  const assignments = course?.assignments;

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th colSpan="3">Student</th>
            {assignments &&
              Object.keys(assignments)
                .sort(
                  (a, b) =>
                    assignments[a].creationDate - assignments[b].creationDate
                )
                .map((value) => {
                  return <th colSpan="2" key={`${value}-assignment-title`}>{assignments[value].title}</th>;
                })}
          </tr>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>App Id</th>
            {assignments &&
              Object.keys(assignments).map((value) => {
                return (
                  <React.Fragment key={`${value}-assignment-header`}>
                    <th>Score</th>
                    <th>Total</th>
                  </React.Fragment>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {students &&
            Object.keys(students).map((sKey) => {
              const assignmentStudentData = students[sKey].assignments;
              return (
                <tr key={sKey}>
                  <td>{students[sKey].name.split(" ")[0]}</td>
                  <td>{students[sKey].name.split(" ")[1]}</td>
                  <td>{students[sKey].id}</td>
                  {assignments &&
                    Object.keys(assignments)
                      .sort(
                        (a, b) =>
                          assignments[a].creationDate -
                          assignments[b].creationDate
                      )
                      .map((aKey) => {
                        return (
                          <React.Fragment key={`${aKey}-assignment-student-data`}>
                            <td>
                              {assignmentStudentData[aKey].hasBeenGraded
                                ? assignmentStudentData[aKey].grade
                                : "NA"}
                            </td>
                            <td>{assignments[aKey].totalPoints ?? 0}</td>
                          </React.Fragment>
                        );
                      })}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}
