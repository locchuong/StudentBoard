import React, { useContext } from "react";
import { useAuth } from "./AuthContext";
import { storageRef } from "../firebase";
import { Course } from "../db/modals/Course";
import { User } from "../db/modals/User";
import Accessor from "../db/accessor";
import DOMPurify from "dompurify";

const CourseContext = React.createContext();

export function useCourse() {
  return useContext(CourseContext);
}

export function CourseProvider({ children }) {
  const { currentUser, userObject } = useAuth();

  // Draftjs: Handles purtifying HTML before rendering
  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }
  // Course: Handle creating a Course (real-time db)
  function createCourse(shortTitle, fullTitle, season, year, section) {
    // Add Course id to User's courseIds array
    let handleCreateCourse = (user) => {
      // Generate Course data and create Course Object
      const courseData = Course.generateCourseJSON(
        null,
        shortTitle,
        fullTitle,
        currentUser.uid,
        userObject.name,
        true,
        false,
        season,
        year,
        section,
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      );
      Course.addCourse(courseData);
      // Generate User's courseIds field and update User
      const courseIds = user.courseIds
        ? user.courseIds.concat([courseData.id])
        : [courseData.id];
      User.updateUser(user.id, { courseIds });
    };
    User.getUser(currentUser.uid, handleCreateCourse);
  }
  // Course: Handles updating a Course (real-time db)
  function updateCourse(
    courseId,
    fullTitle,
    shortTitle,
    season,
    year,
    section,
    isActive,
    isPublished
  ) {
    Course.updateCourse(courseId, {
      fullTitle,
      shortTitle,
      season,
      year,
      section,
      isActive,
      isPublished,
    });
  }
  // Course: Handles joining a Course (real-time db)
  function joinCourse(courseId, secretKey, setError, setMessage) {
    let handleGetCourse = (course) => {
      // Checks for invalid courseId
      if (!course) {
        setError("The course id you have entered does not exist!");
        return;
      }
      // Checks for secret key
      if (course.secretKey !== secretKey) {
        setError("The secret key you have entered is incorrect!");
        return;
      }
      // Checks for course already added
      if (
        userObject.courseIds &&
        userObject.courseIds.find((id) => id === courseId)
      ) {
        setError("You are currently enrolled in this course!");
        return;
      }
      // Checks for Instructor joining a Course
      if (userObject.isInstructor) {
        setError("An Instructor may not join courses!");
        return;
      }
      // Checks for unpublished courses
      if (!course.isPublished) {
        setError("The Instructor has not published this course!");
        return;
      }
      // Checks for inactive courses
      if (!course.isActive) {
        setError("The Instructor has not activated this course!");
        return;
      }
      // For each assignment in course, we need to create a new assignment for the student
      let assignments = {};
      if (course.assignments) {
        Object.keys(course.assignments).forEach((key) => {
          const assignmentStudentData = Course.generateAssignmentStudentData(
            key,
            0,
            false
          );
          assignments[key] = assignmentStudentData;
        });
      }
      const studentData = Course.generateStudentJSON(
        currentUser.uid,
        userObject.name,
        assignments
      );
      // Add student to Course object
      Course.addStudent(courseId, studentData);
      const courseIds = userObject.courseIds
        ? userObject.courseIds.concat([courseId])
        : [courseId];
      // Update User object data
      User.updateUser(currentUser.uid, { courseIds });
      // Set success message
      setMessage("Successfully joined the course!");
    };
    // (1) Retrieve the assignments to create StudentData
    Course.getCourse(courseId, handleGetCourse);
  }
  // Course's Home: Handles updating Course's homepage (real-time db)
  function updateHomepage(courseId, contentObject) {
    Course.updateCourse(courseId, { homepageContent: contentObject });
  }
  // Course's Syllabus: Handle updating Coruse's syllabus (real-time db)
  function updateSyllabus(course, contentObject) {
    Course.updateCourse(course.id, { syllabusContent: contentObject });
  }
  // Course's Announcement: Handle adding Course announcements (real-time db)
  function addAnnouncement(title, course, contentObject) {
    const data = Course.generateAnnouncementJSON(
      title,
      null,
      userObject.name,
      contentObject,
      new Date().valueOf()
    );
    Course.addAnnouncement(course.id, data);
  }
  // Course's Announcement: Handles deleting Course announcements (real-time db)
  function deleteAnnouncement(course, announcementId) {
    Course.deleteAnnouncement(course.id, announcementId);
  }
  // Course's Announcement: Handles updating Course announcements (real-time db)
  function updateAnnouncement(title, announcementId, course, contentObject) {
    Course.updateAnnouncement(course.id, announcementId, {
      title,
      content: contentObject,
    });
  }
  // Course's Discussion: Handle adding Course Discussion posts (real-time db)
  function addDiscussionPost(
    title,
    course,
    contentObject,
    isUserAnonymous,
    folder,
    isPostPublic
  ) {
    const data = Course.generateDiscussionPostJSON(
      title,
      null,
      currentUser.uid,
      userObject.name,
      contentObject,
      isUserAnonymous,
      folder,
      isPostPublic,
      new Date().valueOf(),
      [],
      []
    );
    Course.addDiscussionPost(course.id, data);
  }
  // Course's Discussion: Handles updating Course Discussion posts (real-time db)
  function updateDiscussionPost(
    title,
    courseId,
    discussionId,
    contentObject,
    isUserAnonymous,
    folder,
    isPostPublic
  ) {
    Course.updateDiscussionPost(courseId, discussionId, {
      title,
      content: contentObject,
      isUserAnonymous,
      folder: folder ? folder : null,
      isPostPublic,
    });
  }
  // Course's Discussion: Handles deleting Course Discussion posts (real-time db)
  function deleteDiscussionPost(courseId, discussionId) {
    Course.deleteDiscussionPost(courseId, discussionId);
  }
  // Course's Discussion: Handles update Course Discussion post's upvote counter
  function upvoteDiscussionPost(courseId, discussionId, upvoteIds) {
    // Check if upvoteIds exists i.e. an arbitrary user has upvoted
    if (upvoteIds) {
      // Check if the array of users who have upvoted this discussion is the current user
      const foundUser = upvoteIds.find((id) => id === currentUser.uid);
      // Add the current user to upvote list
      if (!foundUser) {
        const newupvoteIds = upvoteIds.concat([currentUser.uid]);
        Course.updateDiscussionPost(courseId, discussionId, {
          upvoteIds: newupvoteIds,
        });
      }
      // Remove the current user from upvote list
      else {
        upvoteIds.splice(upvoteIds.indexOf(currentUser.uid), 1);
        Course.updateDiscussionPost(courseId, discussionId, { upvoteIds });
      }
    } else {
      // There are no upvotes on this discussion, set the current user to upvoteIds
      Course.updateDiscussionPost(courseId, discussionId, {
        upvoteIds: [currentUser.uid],
      });
    }
  }
  // Course's Discussion: Handles adding Course Discussion folders (real-time db)
  function addDiscussionFolder(courseId, folderName) {
    const data = Course.generateDiscussionFolderJSON(
      null,
      folderName,
      new Date().valueOf()
    );
    Course.addDiscussionFolder(courseId, data);
  }
  // Course's Discussion: Handles updating Course Discussion folders (real-time db)
  function updateDiscussionFolder(courseId, folderId, folderName) {
    Course.updateDiscussionFolder(courseId, folderId, { folderName });
  }
  // Course's Discussion: Handles deleting Course Discussion folders (real-time db)
  function deleteDiscussionFolder(course, folderId) {
    if (course?.discussions?.posts) {
      // For each Discussion Post in the course
      Object.keys(course.discussions.posts).forEach((key) => {
        // If the Discussion Post is inside the folder
        if (course?.discussions?.posts?.[key]?.folder === folderId) {
          // Remove the Discussion Post from the Folder
          Course.updateDiscussionPost(course.id, key, { folder: null });
        }
      });
    }
    // Delete the Folder Object
    Course.deleteDiscussionFolder(course.id, folderId);
  }
  // Course's Discussion: Handle adding Course Discussion comments (real-time db)
  function addDiscussionComment(
    courseId,
    discussionId,
    contentObject,
    isUserAnonymous
  ) {
    const data = Course.generateDiscussionCommentJSON(
      null,
      currentUser.uid,
      userObject.name,
      contentObject,
      new Date().valueOf(),
      [],
      userObject.isInstructor,
      isUserAnonymous
    );
    Course.addDiscussionComment(courseId, discussionId, data);
  }
  // Course's Discussion: Handles updating Course Discussion comments (real-time db)
  function updateDiscussionComment(
    courseId,
    discussionId,
    commentId,
    contentObject
  ) {
    Course.updateDiscussionComment(courseId, discussionId, commentId, {
      content: contentObject,
    });
  }
  // Course's Discussion: Handles deleting Course Discussion comments (real-time db)
  function deleteDiscussionComment(courseId, discussionId, commentId) {
    Course.deleteDiscussionComment(courseId, discussionId, commentId);
  }
  // Course's Discussion: Handles update Course Discussion comment's upvote counter
  function upvoteComment(courseId, discussionId, commentId, upvoteIds) {
    if (upvoteIds) {
      const foundUser = upvoteIds.find((id) => id === currentUser.uid);
      if (!foundUser) {
        const newupvoteIds = upvoteIds.concat([currentUser.uid]);
        Course.updateDiscussionComment(courseId, discussionId, commentId, {
          upvoteIds: newupvoteIds,
        });
      } else {
        upvoteIds.splice(upvoteIds.indexOf(currentUser.uid));
        Course.updateDiscussionComment(courseId, discussionId, commentId, {
          upvoteIds,
        });
      }
    } else {
      Course.updateDiscussionComment(courseId, discussionId, commentId, {
        upvoteIds: [currentUser.uid],
      });
    }
  }
  // Course's Discussion: Handles adding Course Discussion comment's replies
  function addDiscussionCommentReply(
    courseId,
    discussionId,
    commentId,
    contentObject,
    isUserAnonymous
  ) {
    const data = Course.generateDiscussionCommentReplyJSON(
      null,
      currentUser.uid,
      userObject.name,
      contentObject,
      new Date().valueOf(),
      [],
      userObject.isInstructor,
      isUserAnonymous
    );
    Course.addDiscussionCommentReply(courseId, discussionId, commentId, data);
  }
  // Course's Discussion: Handles update Course Discussion comment's reply's upvote counter
  function upvoteCommentReply(
    courseId,
    discussionId,
    commentId,
    commentReplyId,
    upvoteIds
  ) {
    if (upvoteIds) {
      const foundUser = upvoteIds.find((id) => id === currentUser.uid);
      if (!foundUser) {
        const newupvoteIds = upvoteIds.concat([currentUser.uid]);
        Course.updateDiscussionCommentReply(
          courseId,
          discussionId,
          commentId,
          commentReplyId,
          {
            upvoteIds: newupvoteIds,
          }
        );
      } else {
        upvoteIds.splice(upvoteIds.indexOf(currentUser.uid));
        Course.updateDiscussionCommentReply(
          courseId,
          discussionId,
          commentId,
          commentReplyId,
          {
            upvoteIds,
          }
        );
      }
    } else {
      Course.updateDiscussionCommentReply(
        courseId,
        discussionId,
        commentId,
        commentReplyId,
        {
          upvoteIds: [currentUser.uid],
        }
      );
    }
  }
  // Course's Assignment: Handle adding Course Assignments (real-time db)
  function addAssignment(
    course,
    title,
    contentObject,
    attachments,
    totalPoints,
    pointStep,
    isPublished,
    releaseDate,
    dueDate
  ) {
    let assignmentId = Accessor.generateId();
    let data = Course.generateAssignmentJSON(
      assignmentId,
      title,
      contentObject,
      null,
      totalPoints,
      pointStep,
      isPublished,
      releaseDate,
      dueDate,
      new Date().valueOf()
    );
    if (attachments) {
      Promise.all(
        Array.from(attachments).map((file) =>
          uploadAttachmentAsPromise(file, course.id, assignmentId)
        )
      ).then((attachmentLinks) => {
        data.attachments = attachmentLinks;
        // Add Assignment's common fields to Course
        Course.addAssignment(course.id, data);
        // Add Assignment's unique fields to each student
        const assignmentStudentData = Course.generateAssignmentStudentData(
          assignmentId,
          0,
          false
        );
        if (course?.students) {
          Object.keys(course.students).forEach((uid) => {
            Course.addAssignmentStudentData(
              uid,
              course.id,
              assignmentStudentData
            );
          });
        }
      });
    } else {
      // Add Assignment's common fields to Course
      Course.addAssignment(course.id, data);
      // Add Assignment's unique fields to each student
      const assignmentStudentData = Course.generateAssignmentStudentData(
        assignmentId,
        0,
        false
      );
      if (course?.students) {
        Object.keys(course.students).forEach((uid) => {
          Course.addAssignmentStudentData(
            uid,
            course.id,
            assignmentStudentData
          );
        });
      }
    }
  }
  // Course's Assignment: Handles updating Course Assignments (real-time db)
  function updateAssignment(
    courseId,
    assignmentId,
    title,
    contentObject,
    filesHaveChanged,
    attachments,
    totalPoints,
    pointStep,
    isPublished,
    releaseDate,
    dueDate
  ) {
    // File Attachments have been changed
    if (filesHaveChanged) {
      // Update assignment with changed file attachments
      if (attachments) {
        Promise.all(
          Array.from(attachments).map((file) =>
            uploadAttachmentAsPromise(file, courseId, assignmentId)
          )
        ).then((attachmentLinks) => {
          Course.updateAssignment(courseId, assignmentId, {
            title,
            content: contentObject,
            attachments: attachmentLinks,
            totalPoints,
            pointStep,
            isPublished,
            releaseDate,
            dueDate,
          });
        });
      }
      // Update assignment with no file attachments
      else {
        Course.updateAssignment(courseId, assignmentId, {
          title,
          content: contentObject,
          attachments: null,
          totalPoints,
          pointStep,
          isPublished,
          releaseDate,
          dueDate,
        });
      }
    }
    // File Attachments have not changed
    else {
      // Update Assignment with no changes to file attachments
      Course.updateAssignment(courseId, assignmentId, {
        title,
        content: contentObject,
        totalPoints,
        pointStep,
        isPublished,
        releaseDate,
        dueDate,
      });
    }
  }
  // Course's Assignment: Handles storing Course Assignment's instructor's attachments (storage)
  function uploadAttachmentAsPromise(file, courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      const storageFileRef = storageRef.child(
        "courses/" +
          courseId +
          "/assignments/" +
          assignmentId +
          "/attachments/" +
          file.name
      );
      const task = storageFileRef.put(file);
      task.on(
        "state_changed",
        function progress(snapshot) {
          // var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // uploaderRef.current.value = percentage;
        },
        function error(err) {},
        function complete() {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            // console.log("File available at", downloadURL);
            resolve({
              fileName: file.name,
              downloadURL,
            });
          });
        }
      );
    });
  }
  // Course's Assignment: Handles removing Course Assignment's previous attachments (storage)
  function removePreviousAttachments(courseId, assignmentId) {
    deleteFolderContent(
      "courses/" + courseId + "/assignments/" + assignmentId + "/attachments"
    );
  }
  // Course's Assignment: Handles adding Course Assignment's Student Submissions (real-time db)
  function addSubmission(
    courseId,
    assignmentId,
    selectedFiles,
    submissionDate,
    isLate,
    comments
  ) {
    const studentSubmissionData = Course.generateSubmissionJSON(
      submissionDate,
      isLate,
      null,
      comments
    );
    if (selectedFiles) {
      Promise.all(
        Array.from(selectedFiles).map((file) =>
          uploadStudentSubmissionAsPromise(file, courseId, assignmentId)
        )
      ).then((attachmentLinks) => {
        studentSubmissionData.attachments = attachmentLinks;
        Course.addSubmission(
          currentUser.uid,
          courseId,
          assignmentId,
          studentSubmissionData
        );
      });
    } else {
      Course.addSubmission(
        currentUser.uid,
        courseId,
        assignmentId,
        studentSubmissionData
      );
    }
  }
  // Course's Assignment: Handles updating Course Assignemnt's Student Submissions (real-time db)
  function updateAssignmentStudentData(
    studentId,
    courseId,
    assignmentId,
    grade,
    assessmentComments
  ) {
    Course.updateAssignmentStudentData(studentId, courseId, assignmentId, {
      grade,
      hasBeenGraded: true,
      assessmentComments,
    });
  }
  // Course's Assignment: Handles storing Course Assignment's Student Submissions (storage)
  function uploadStudentSubmissionAsPromise(file, courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      const storageFileRef = storageRef.child(
        "courses/" +
          courseId +
          "/assignments/" +
          assignmentId +
          "/studentSubmissions/" +
          currentUser.uid +
          "/" +
          file.name
      );
      const task = storageFileRef.put(file);
      task.on(
        "stage changed",
        function progress(snapshot) {},
        function error(err) {},
        function complete() {
          task.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve({
              fileName: file.name,
              downloadURL,
            });
          });
        }
      );
    });
  }
  // Course's Assignment: Handles removing Course Assignment's previous Student Submissions (storage)
  function removePreviousSubmission(courseId, assignmentId) {
    deleteFolderContent(
      "courses/" +
        courseId +
        "/assignments/" +
        assignmentId +
        "/studentSubmissions/" +
        currentUser.uid
    );
  }
  // Course's File: Handles adding a folder (real-time db)
  function addFolder(courseId, name) {
    const folderData = Course.generateFolderJSON(
      null,
      name,
      [],
      new Date().valueOf()
    );
    Course.addFolder(courseId, folderData);
  }
  // Course's File: Handles updating a folder (real-time db)
  function updateFolder(courseId, folderId, name) {
    Course.updateFolder(courseId, folderId, { name });
  }
  // Course's File: Handles delete a folder (real-time db)
  function deleteFolder(courseId, folderId) {
    deleteFolderContent("courses/" + courseId + "/files/" + folderId);
    Course.deleteFolder(courseId, folderId);
  }
  // Course's File: Handles adding a file to storage (storage)
  function addFile(courseId, folder, file, setUploaderProgress) {
    uploadFileAsPromise(courseId, folder.id, file, setUploaderProgress).then(
      (fileObject) => {
        let newFiles = folder.files;
        if (folder.files) {
          let index = folder.files.findIndex(
            (element) => element.fileName === file.name
          );
          // Duplicate not found
          if (index === -1) {
            newFiles.push(fileObject);
          }
          // Duplicate found
          else {
            newFiles[index] = fileObject;
          }
        } else {
          newFiles = [fileObject];
        }
        Course.addFile(courseId, folder.id, { files: newFiles });
      }
    );
  }
  // Course's File: Handles deleting a file to storage (storage)
  function deleteFile(courseId, folder, fileIndex) {
    // Remove File from Storage
    deleteFileFromStorage(
      "courses/" + courseId + "/files/" + folder.id,
      folder.files[fileIndex].fileName
    );
    // Initialize folder's files without file at fileIndex
    let newFiles = folder.files;
    newFiles.splice(fileIndex, 1);
    // Update Folder object without file at fileIndex
    Course.updateFolder(courseId, folder.id, { files: newFiles });
  }
  // Course's Files: Handles uploading a file to storage (storage)
  function uploadFileAsPromise(courseId, folderId, file, setUploaderProgress) {
    return new Promise((resolve, reject) => {
      const storageFileRef = storageRef.child(
        "courses/" + courseId + "/files/" + folderId + "/" + file.name
      );
      const task = storageFileRef.put(file);
      task.on(
        "state_changed",
        function progress(snapshot) {
          var percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploaderProgress(percentage);
        },
        function error(err) {},
        function complete() {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            // console.log("File available at", downloadURL);
            resolve({
              fileName: file.name,
              downloadURL,
            });
          });
        }
      );
    });
  }
  // Handles deleting a specific folder in storage
  function deleteFolderContent(path) {
    const ref = storageRef.child(path);
    ref
      .listAll()
      .then((dir) => {
        dir.items.forEach((fileRef) => {
          deleteFileFromStorage(ref.fullPath, fileRef.name);
        });
        dir.prefixes.forEach((folderRef) => {
          this.deleteFolderContent(folderRef.fullPath);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Handles deleting a specific file in storage
  function deleteFileFromStorage(pathToFile, fileName) {
    const ref = storageRef.child(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete();
  }
  const value = {
    // Miscellaneous
    createMarkup,
    // Course
    createCourse,
    updateCourse,
    joinCourse,
    // Home
    updateHomepage,
    // Syllabus
    updateSyllabus,
    // Announcement
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    // Discussion Posts
    addDiscussionPost,
    updateDiscussionPost,
    upvoteDiscussionPost,
    deleteDiscussionPost,
    // Discussion Folders
    addDiscussionFolder,
    updateDiscussionFolder,
    deleteDiscussionFolder,
    // Discussion Comments
    addDiscussionComment,
    updateDiscussionComment,
    deleteDiscussionComment,
    upvoteComment,
    // Discussion Comment Replies
    addDiscussionCommentReply,
    upvoteCommentReply,
    // Assignments
    addAssignment,
    updateAssignment,
    removePreviousAttachments,
    addSubmission,
    updateAssignmentStudentData,
    removePreviousSubmission,
    // Files
    addFolder,
    updateFolder,
    deleteFolder,
    addFile,
    deleteFile,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}
