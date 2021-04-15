import React, {useState} from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCourse } from "../../../contexts/CourseContext";
import { Row, Col, Card, Button} from "react-bootstrap";
import replyIcon from "../../../media/icons/replyIcon.png";
import draftToHtml from "draftjs-to-html";
import {useParams} from 'react-router-dom';

export default function DiscussionCommentReply(props) {
  const { createMarkup, upvoteCommentReply} = useCourse();
  const {currentUser} = useAuth();
  const {courseId, discussionId} = useParams();
  const [loading, setLoading] = useState(false);
  const hasUpvoted =
  props.reply.upvoteIds &&
  props.reply.upvoteIds.find((id) => id === currentUser.uid) === currentUser.uid
    ? true
    : false;
    async function handleUpvoteCommentReply() {
      try {
        setLoading(true);
        await upvoteCommentReply(
          courseId,
          discussionId,
          props.commentId,
          props.reply.id,
          props.reply.upvoteIds
        );
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  return (
    <Row className="d-flex align-items-center mb-2">
      <Col className="px-0 discussion-comment-reply">
        <img
          className="discussion-comment-reply-icon"
          src={replyIcon}
          alt="Logo"
          width="24"
          height="24"
        />
        <Card className="discussion-comment-reply-card p-2">
          <div className="d-flex align-items-center">
            {props.reply.byInstructor ? (
              <div className="discussion-post-instructor-commented mr-1">
                <strong className="text-light">i</strong>
              </div>
            ) : (
              <div className="discussion-post-student-commented mr-1">
                <strong className="text-light">s</strong>
              </div>
            )}
            <strong>{!props.reply.isUserAnonymous || props.userIsInstructor ? props.reply.author : props.userIsAuthor ? "Anonymous (You)" : "Anonymous"}</strong>
          </div>
          <div
            className="ml-4 discussion-comment-reply-content"
            dangerouslySetInnerHTML={createMarkup(
              draftToHtml(JSON.parse(props.reply.content))
            )}
          ></div>
          <div className="d-flex justify-content-between">
          <div className="ml-4">
            <Button
              disabled={loading}
              variant="link"
              size="sm"
              className="pl-0 mr-2"
              style={{ borderRight: "1px solid grey" }}
              onClick={() => handleUpvoteCommentReply()}
            >
              {hasUpvoted ? "undo" : ""} upvote
            </Button>
            {props?.reply?.upvoteIds ? Object.keys(props.reply.upvoteIds).length : 0}
          </div>
            <p className="m-0 text-muted">
              Posted on:{" "}
              {new Date(props.reply.creationDate).toISOString().slice(0, 10)}
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
