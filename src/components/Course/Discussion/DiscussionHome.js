import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import discussionExclaimationIcon from "../../../media/icons/discussionExclaimationIcon.png";

export default function DiscussionHome() {
  const { courseId } = useParams();
  const { courseObjects } = useAuth();
  const course = courseObjects.find(({ id }) => id === courseId);
  const totalPosts = course?.discussions?.posts
    ? Object.keys(course.discussions.posts).length
    : 0;
  const instructorPosts = course?.discussions?.posts
    ? Object.keys(course.discussions.posts).filter(
        (key) => course.discussions.posts[key].authorId === course.instructorId
      ).length
    : 0;
  const studentPosts = totalPosts - instructorPosts;
  const discussionPostData = [
    {
      name: "Total Posts",
      value: totalPosts,
    },
    {
      name: "Instructor Posts",
      value: instructorPosts,
    },
    {
      name: "Student Posts",
      value: studentPosts,
    },
  ];
  const totalComments = course?.discussions?.posts
    ? Object.keys(course.discussions.posts).reduce((total, key) => {
        return (
          total +
          (course?.discussions?.posts?.[key]?.comments
            ? Object.keys(course.discussions.posts[key].comments).length
            : 0)
        );
      }, 0)
    : 0;
  const instructorComments = course?.discussions?.posts
    ? Object.keys(course.discussions.posts).reduce((totalP, keyP) => {
        return (
          totalP +
          (course?.discussions?.posts?.[keyP]?.comments
            ? Object.keys(course.discussions.posts[keyP].comments).reduce(
                (totalC, keyC) => {
                  return (
                    totalC +
                    (course?.discussions?.posts?.[keyP]?.comments?.[keyC]
                      .authorId === course.instructorId
                      ? 1
                      : 0)
                  );
                },
                0
              )
            : 0)
        );
      }, 0)
    : 0;
  const studentComments = totalComments - instructorComments;
  const discussionCommentData = [
    {
      name: "Total Comments",
      value: totalComments,
    },
    {
      name: "Instructor Comments",
      value: instructorComments,
    },
    {
      name: "Student Comments",
      value: studentComments,
    },
  ];
  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="mt-5">
        <h5 className="text-muted">Discussion Overview</h5>
        <Card className="card-outline-dark" style={{ minWidth: "500px" }}>
          <Card.Body>
            <Container fluid>
              <Row>
                <Col className="p-2">
                  {discussionPostData &&
                    Object.keys(discussionPostData).map((key) => {
                      return (
                        <div className="d-flex align-items-center" key={key}>
                          <img
                            src={discussionExclaimationIcon}
                            alt="Logo"
                            width="20"
                            height="20"
                            className="mr-2"
                          />
                          <span>
                            <strong>{discussionPostData[key].name}: </strong>
                            {discussionPostData[key].value}
                          </span>
                        </div>
                      );
                    })}
                </Col>
                <Col className="p-2">
                  {discussionCommentData &&
                    Object.keys(discussionCommentData).map((key) => {
                      return (
                        <div className="d-flex align-items-center" key={key}>
                          <img
                            src={discussionExclaimationIcon}
                            alt="Logo"
                            width="20"
                            height="20"
                            className="mr-2"
                          />
                          <span>
                            <strong>{discussionCommentData[key].name}: </strong>
                            {discussionCommentData[key].value}
                          </span>
                        </div>
                      );
                    })}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
