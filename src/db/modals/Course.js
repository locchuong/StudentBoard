import { courseRef } from "../../firebase";
import Accessor from "../accessor";

export class Course {
  // Handle Course Object
  static getCourse(id, callback) {
    Accessor.getObject(courseRef, id, callback);
  }
  static getCourseList(ids, callback) {
    Accessor.getObjectList(courseRef, ids, callback);
  }
  static addCourse(json, callback) {
    Accessor.addObject(courseRef, json, callback);
  }
  static deleteCourse(id, callback) {
    Accessor.deleteObject(courseRef, id, callback);
  }
  static updateCourse(id, json, callback) {
    Accessor.updateObject(courseRef, id, json, callback);
  }
  static generateCourseJSON(
    id,
    shortTitle,
    fullTitle,
    instructorId,
    instructorName,
    isActive,
    isPublished,
    season,
    year,
    section,
    homepageContent,
    announcements,
    syllabusContent,
    assignments,
    quizzes,
    students,
    media,
    discussion
  ) {
    return {
      id: id ? id : Accessor.generateId(28),
      secretKey: Accessor.generateId(8),
      shortTitle,
      fullTitle,
      instructorId,
      instructorName,
      isActive,
      isPublished,
      season,
      year,
      section,
      announcements,
      syllabusContent,
      assignments,
      quizzes,
      students,
      media,
      discussion,
    };
  }
  static addStudent(courseId, json, callback) {
    Accessor.addObject(courseRef.child(courseId + "/students"), json, callback);
  }
  static generateStudentJSON(id, name, assignments) {
    return {
      id,
      name,
      assignments,
    };
  }
  // Handle Course/Announcements objects
  static addAnnouncement(courseId, json, callback) {
    Accessor.addObject(
      courseRef.child(courseId + "/announcements"),
      json,
      callback
    );
  }
  static deleteAnnouncement(courseId, announcementId, callback) {
    Accessor.deleteObject(
      courseRef.child(courseId + "/announcements"),
      announcementId,
      callback
    );
  }
  static updateAnnouncement(courseId, announcementId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/announcements"),
      announcementId,
      json,
      callback
    );
  }
  static generateAnnouncementJSON(title, id, author, content, creationDate) {
    return {
      title,
      id: id ? id : Accessor.generateId(28),
      author,
      content,
      creationDate,
    };
  }
  // Handle Course/Discussion objects
  static addDiscussionPost(courseId, json, callback) {
    Accessor.addObject(
      courseRef.child(courseId + "/discussions/posts"),
      json,
      callback
    );
  }
  static deleteDiscussionPost(courseId, discussionId, callback) {
    Accessor.deleteObject(
      courseRef.child(courseId + "/discussions/posts"),
      discussionId,
      callback
    );
  }
  static updateDiscussionPost(courseId, discussionId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/discussions/posts"),
      discussionId,
      json,
      callback
    );
  }
  static generateDiscussionPostJSON(
    title,
    id,
    authorId,
    author,
    content,
    isUserAnonymous,
    folder,
    isPostPublic,
    creationDate,
    upvoteIds,
    comments
  ) {
    return {
      title,
      id: id ? id : Accessor.generateId(28),
      authorId,
      author,
      content,
      isUserAnonymous,
      folder,
      isPostPublic,
      creationDate,
      upvoteIds,
      comments,
    };
  }
  static addDiscussionFolder(courseId, json, callback) {
    Accessor.addObject(
      courseRef.child(courseId + "/discussions/folders"),
      json,
      callback
    );
  }
  static updateDiscussionFolder(courseId, folderId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/discussions/folders"),
      folderId,
      json,
      callback
    );
  }
  static deleteDiscussionFolder(courseId, folderId, callback) {
    Accessor.deleteObject(
      courseRef.child(courseId + "/discussions/folders"),
      folderId,
      callback
    );
  }
  static generateDiscussionFolderJSON(id, folderName, creationDate) {
    return {
      id: id ? id : Accessor.generateId(28),
      folderName,
      creationDate,
    };
  }
  // Handle Course/Discussion/Comment objects
  static addDiscussionComment(courseId, discussionId, json, callback) {
    Accessor.addObject(
      courseRef.child(
        courseId + "/discussions/posts/" + discussionId + "/comments"
      ),
      json,
      callback
    );
  }
  static deleteDiscussionComment(courseId, discussionId, commentId, callback) {
    Accessor.deleteObject(
      courseRef.child(
        courseId + "/discussions/posts/" + discussionId + "/comments"
      ),
      commentId,
      callback
    );
  }
  static updateDiscussionComment(
    courseId,
    discussionId,
    commentId,
    json,
    callback
  ) {
    Accessor.updateObject(
      courseRef.child(
        courseId + "/discussions/posts/" + discussionId + "/comments"
      ),
      commentId,
      json,
      callback
    );
  }
  static generateDiscussionCommentJSON(
    id,
    authorId,
    author,
    content,
    creationDate,
    upvoteIds,
    byInstructor,
    isUserAnonymous
  ) {
    return {
      id: id ? id : Accessor.generateId(28),
      authorId,
      author,
      content,
      creationDate,
      upvoteIds,
      byInstructor,
      isUserAnonymous,
    };
  }
  // Handle Course/Discussion/Comment/Reply objects
  static addDiscussionCommentReply(
    courseId,
    discussionId,
    commentId,
    json,
    callback
  ) {
    Accessor.addObject(
      courseRef.child(
        courseId +
          "/discussions/posts/" +
          discussionId +
          "/comments/" +
          commentId +
          "/replies"
      ),
      json,
      callback
    );
  }
  static updateDiscussionCommentReply(courseId, discussionId, commentId, commentReplyId, json, callback) {
    Accessor.updateObject(
      courseRef.child(
        courseId + "/discussions/posts/" + discussionId + "/comments/" + commentId + "/replies"
      ),
      commentReplyId,
      json,
      callback
    );
  }
  static generateDiscussionCommentReplyJSON(
    id,
    authorId,
    author,
    content,
    creationDate,
    upvoteIds,
    byInstructor,
    isUserAnonymous
  ) {
    return {
      id: id ? id : Accessor.generateId(28),
      authorId,
      author,
      content,
      creationDate,
      upvoteIds,
      byInstructor,
      isUserAnonymous,
    };
  }
  // Handle Course/Assignment objects
  static addAssignment(courseId, json, callback) {
    Accessor.addObject(
      courseRef.child(courseId + "/assignments"),
      json,
      callback
    );
  }
  static updateAssignment(courseId, assignmentId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/assignments/"),
      assignmentId,
      json,
      callback
    );
  }
  // Generates Course/Assignment object JSON
  static generateAssignmentJSON(
    id,
    title,
    content,
    attachments,
    totalPoints,
    pointStep,
    isPublished,
    releaseDate,
    dueDate,
    creationDate
  ) {
    return {
      id: id ? id : Accessor.generateId(28),
      title,
      content,
      attachments,
      totalPoints,
      pointStep,
      isPublished,
      releaseDate,
      dueDate,
      creationDate,
    };
  }
  // Handles Course/Assignment/Submission objects
  static addSubmission(uid, courseId, assignmentId, json, callback) {
    Accessor.updateObject(
      courseRef.child(
        courseId + "/students/" + uid + "/assignments/" + assignmentId
      ),
      "submission",
      json,
      callback
    );
  }
  static generateSubmissionJSON(submissionDate, isLate, attachments, comments) {
    return {
      submissionDate,
      isLate,
      attachments,
      comments,
    };
  }
  // Handles Course/Students/Assignments objects
  static addAssignmentStudentData(uid, courseId, json, callback) {
    Accessor.addObject(
      courseRef.child(courseId + "/students/" + uid + "/assignments/"),
      json,
      callback
    );
  }
  static updateAssignmentStudentData(
    uid,
    courseId,
    assignmentId,
    json,
    callback
  ) {
    Accessor.updateObject(
      courseRef.child(courseId + "/students/" + uid + "/assignments/"),
      assignmentId,
      json,
      callback
    );
  }
  // Generates Course/Students/Assignment JSON
  static generateAssignmentStudentData(assignmentId, grade, hasBeenGraded) {
    return {
      id: assignmentId,
      grade,
      hasBeenGraded,
    };
  }
  // Handles Course/Files objects
  static addFolder(courseId, json, callback) {
    Accessor.addObject(courseRef.child(courseId + "/files"), json, callback);
  }
  static updateFolder(courseId, folderId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/files"),
      folderId,
      json,
      callback
    );
  }
  static deleteFolder(courseId, folderId, callback) {
    Accessor.deleteObject(
      courseRef.child(courseId + "/files"),
      folderId,
      callback
    );
  }
  static addFile(courseId, folderId, json, callback) {
    Accessor.updateObject(
      courseRef.child(courseId + "/files/"),
      folderId,
      json,
      callback
    );
  }
  static generateFolderJSON(id, name, files, creationDate) {
    return {
      id: id ? id : Accessor.generateId(28),
      name,
      files,
      creationDate,
    };
  }
}
