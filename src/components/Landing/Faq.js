import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Question from "./Question.js";
import QuestionWrapper from "./QuestionWrapper.js";
import "../../stylesheets/Faq.css";

import authenticationIcon from "../../media/icons/authenticationIcon.png";
import coursesIcon from "../../media/icons/coursesIcon.png";
import assignmentsIcon from "../../media/icons/assignmentIcon.png";
import discussionIcon from "../../media/icons/discussionIcon.png";

export default function Faq() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <Container className="faq-wrapper">
        <Row noGutters className="mb-5">
          <Col>
            <h2 className="faq-header">Frequently Asked Questions</h2>
          </Col>
        </Row>
        <Row noGutters className="faq-question-tabgroup my-3">
          <Col>
            <button
              className={`faq-question-tab ${
                tab === 0 ? "faq-question-tab-active" : ""
              }`}
              variant="outline-secondary"
              onClick={() => setTab(0)}
            >
              <img
                src={authenticationIcon}
                alt="authenticationIcon"
                className="faq-question-tab-icon"
              />
              <p className="m-0">Authentication</p>
            </button>
          </Col>
          <Col>
            <button
              className={`faq-question-tab ${
                tab === 1 ? "faq-question-tab-active" : ""
              }`}
              variant="outline-secondary"
              onClick={() => setTab(1)}
            >
              <img
                src={coursesIcon}
                alt="coursesIcon"
                className="faq-question-tab-icon"
              />
              <p className="m-0">Course</p>
            </button>
          </Col>
          <Col>
            <button
              className={`faq-question-tab ${
                tab === 2 ? "faq-question-tab-active" : ""
              }`}
              variant="outline-secondary"
              onClick={() => setTab(2)}
            >
              <img
                src={assignmentsIcon}
                alt="assignmentsIcon"
                className="faq-question-tab-icon"
              />
              <p className="m-0">Assignments</p>
            </button>
          </Col>
          <Col>
            <button
              className={`faq-question-tab ${
                tab === 3 ? "faq-question-tab-active" : ""
              }`}
              variant="outline-secondary"
              onClick={() => setTab(3)}
            >
              <img
                src={discussionIcon}
                alt="discussionIcon"
                className="faq-question-tab-icon"
              />
              <p className="m-0">Discussion</p>
            </button>
          </Col>
        </Row>
        <Row noGutters>
          <Col>
            {tab === 0 ? (
              <QuestionWrapper>
                <Question
                  header="Is StudentBoard free to use?"
                  content={`Yes, StudentBoard is a free platform for online learning.`}
                ></Question>
                <Question
                  header="How do I create an account?"
                  content={`If you have not set up your own StudentBoard
                            account, go to "Login" and click on the 
                            "Sign Up" link. Enter the login information
                            you want to associate to your account and click
                            the "Sign Up" button. You'll be sent an email prompting
                            you to confirm your account. Once you've confirmed your account,
                            return to the login screen to sign in. Additionally, Studentboard
                            allows its users create an account automatically through
                            Google or Facebook credentials.`}
                ></Question>
                <Question
                  header="How do I reset my password?"
                  content={`If you set up your own StudentBoard 
                            account, go to "Login" and click on the
                            "Forgot Password?" link. Enter the login
                             information associated with your Studentboard 
                             account and click the "Reset Password" button. 
                             You'll be sent an email prompting you to reset your 
                             password. Once you've reset your password, 
                             return to the login screen to sign in.`}
                ></Question>
                <Question
                  header="Do I need to be an instructor to use StudentBoard?"
                  content={`No, StudentBoard is free to use for both Instructors and Students.`}
                ></Question>
              </QuestionWrapper>
            ) : tab === 1 ? (
              <QuestionWrapper>
                <h5 className="mt-3">Students</h5>
                <Question
                  header="How do I join a Course?"
                  content={`If you have already logged into StudentBoard, click
                            on the "Courses" tab and "Enroll in a Course" button. Enter
                            the course id and secret key associated with the Course
                            you are trying to join and click "Join Course".`}
                ></Question>
                <Question
                  header="How do I receive my course secret key?"
                  content={`Course secret keys are distributed at the discretion
                            of the Instructor of the Course. To receive your course
                             secret key, contact the Instructor of the Course.`}
                ></Question>
                <Question
                  header="How do I see my past enrollments?"
                  content={`If you have already logged into StudentBoard, click 
                            on the "Courses" tab to see all current and past enrollments.`}
                ></Question>
                <Question
                  header="How do I create a Course?"
                  content={`Student account do not have permission to create Courses. 
                            In order to create a new Course, create a new Instructor account.`}
                ></Question>
                <Question
                  header="How do I leave a Course?"
                  content={`If you have already enrolled in a Course, the Course will be 
                            moved to Past Enrollments under the "Courses" tab when Instructors
                             have finalized the Course. Students may not leave a Course that 
                             they have enrolled in.`}
                ></Question>
                <h5 className="mt-3">Instructors</h5>
                <Question
                  header="How do I join a Course?"
                  content={`Instructors are allowed to create Courses, but are not allowed to
                            join Course in which they are not the Instructor of.`}
                ></Question>
                <Question
                  header="How do I create a Course?"
                  content={`If you have already logged into StudentBoard, click
                            on the "Course" tab and "Create a Course" button. Enter the
                            basic information for the Course and click "Create Course". To access
                            the Course, move over to the Dashboard and click on the Course.`}
                ></Question>
                <Question
                  header="How do I publish my Course?"
                  content={`Unpublished Courses may not be enrolled in by Students. To change this,
                            go to your Course and click on the Options dropdown to view/edit the Course's
                            settings. Toggle the Published radio to be true and save your changes.`}
                ></Question>
                <Question
                  header="How do I allow Students to join my Course?"
                  content={`Access the Course and click on the Options dropdown to view/edit the
                            Course's settings. Change the Course's settings to be active AND published
                            in order to allow Students to enroll. Under Course settings, you will see
                            a course id and secret key. You need to share both values to your students
                            so that they may enroll in the Course.`}
                ></Question>
              </QuestionWrapper>
            ) : tab === 2 ? (
              <QuestionWrapper>
                <h5 className="mt-3">Students</h5>
                <Question
                  header="How do I view an Assignment?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                            all assignments for the course. Click on an assignment to view details about the
                            assignment.`}
                ></Question>
                <Question
                  header="How do I submit an Assignment?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                            all assignments for the course. Click on an assignment to view details about the
                            assignment. To upload your work to the assignment, click the "Upload File" button
                            to upload files and click the "Submit Assignment" button to submit your work.`}
                ></Question>
                <Question
                  header="Can I submit an Assignment after the deadline?"
                  content={`Submissions for assignments are locked after the deadline has been met. However, it
                            is at your Instructor's discretion to reopen the Assignment for submission
                            after the deadline.`}
                ></Question>
                <Question
                  header="How do I view the status of my Assignment submission?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                          all assignments for the course. The current status of your submission will be under the
                          "Status" column of your assignment.`}
                ></Question>
                <h5 className="mt-3">Instructors</h5>
                <Question
                  header="How do I create an Assignment?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                          all assignments for the course. To create a new assignment, click on the "Add Assignment" button
                          , fill out the information for the assignment, and click the "Publish" button. By default,
                          new assignments are private. Private assignments are only viewable by the Instructor and may be
                          changed at a later date.`}
                ></Question>
                <Question
                  header="Why can't my Students see an Assignment?"
                  content={`By default, new assignments are private. Private assignments are only viewable by the Instructor and may be
                          changed at a later date. In order to unprivate the assignment, go the to "Assignments" tab of the Course and
                          click on the assignment you wish to unprivate. Click on the "Edit" button, toggle the "Private" radio, and 
                          click on "Save Changes" to republish the Assignment.`}
                ></Question>
                <Question
                  header="How do I view submissions for an Assignment?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                            all assignments for the Course. Click on the an Assigment and you will be redirected
                            to the Assignment's details.`}
                ></Question>
                <Question
                  header="How do I grade submissions for an Assignment?"
                  content={`If you are already on the Course home page, click on the "Assignments" tab to view
                            all assignments for the Course. Click on an Assigment and you will be redirected
                            to the Assignment's details. Click on the "Grade Submissions" link to grade a
                            random submission for the Assignment.`}
                ></Question>
              </QuestionWrapper>
            ) : tab === 3 ? (
              <QuestionWrapper>
                <Question
                  header="How do I create a new Discussion Post?"
                  content={`If you are already on the Course home page, click on the "Discussion" tab to view
                            all discussion posts for the Course. Click on the "New Post" button, fill out the
                            discussion post information, and hit the "Publish" button to create a new discussion
                            post.`}
                ></Question>
                <Question
                  header="How do I edit a Discussion Post?"
                  content={`If you are already on the Course home page, click on the "Discussion" tab to view
                            all discussion posts for the Course. Click on the discussion post in which you are
                            the author of and select the "Edit" menu option from the options dropdown menu.`}
                ></Question>
                <Question
                  header="How do I delete a Discussion Post?"
                  content={`If you are already on the Course home page, click on the "Discussion" tab to view
                            all discussion posts for the Course. Click on the discussion post in which you are
                            the author of and select the "Delete" menu option from the options dropdown menu.`}
                ></Question>
                <Question
                  header="What do the yellow 'i' and green 's' boxes next to the discussion post mean?"
                  content={`A yellow 'i' signifies that the discussion post has been responded to by the Instructor.
                            A green s signifies that the discussion post has been responded to by a Student.`}
                ></Question>
                <Question
                  header="What do the yellow and green bars to the left of the discussion post mean?"
                  content={`A yellow vertical bar signifies that the author of the post is the Instructor.
                            A green vertical bar signifies that the author of the post is a Student.`}
                ></Question>
                <Question
                  header="What does the 'Post to' option for a discussion post mean?"
                  content={`Discussion posts may be viewable by the entire class or viewable only to the Instructor. 
                            Posting to the entire class will allow all other students to see your post. Posting to
                            Instructors will only allow the Instructors to see your post.`}
                ></Question>
                <Question
                  header="What does the 'Show my name as' option for a discussion post mean?"
                  content={`When creating a Discussion post, you will have the option to show your name on the post
                            or as "anonymous". Note that a student who wants to post as "anonymous" will show up as
                            "anonymous" to students and as their name to Instructors. Additionally, Instructors may not
                            post as "anonymous".`}
                ></Question>
                <Question
                  header="What is a Discussion folder?"
                  content={`Discussion posts may be put into folders (created by Instructors) to help organize the
                            discussion board. A folder's content can be viewed by selecting the folder on the header
                            of the discussion board.`}
                ></Question>
                <Question
                  header="How do I create a Discussion folder?"
                  content={`Discussion folders may be created by Instructors on the discussion board. Click the folder
                            button next to the "New Post" button to access the folder manager.`}
                ></Question>
              </QuestionWrapper>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
