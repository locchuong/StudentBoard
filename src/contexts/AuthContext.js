import React, { useContext, useState, useEffect, useReducer } from "react";
import {
  localPersistence,
  sessionPersistence,
  auth,
  googleProvider,
  facebookProvider,
} from "../firebase";
import app from "../firebase";
import { User } from "../db/modals/User";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const ACTIONS = {
  DELETE_COURSE: "delete-course",
  SET_COURSE: "set-course",
  CLEAR_STATE: "clear-state",
};

function reducer(state, action) {
  switch (action.type) {
    // Update course if inside state, Otherwise append course
    case ACTIONS.SET_COURSE:
      // Handle empty array: set object array to payload
      if (!state) return [{ ...action.payload.course }];
      // Handle append course object to object array
      else {
        // Handle edit course object in object array
        let editCourse = false;
        let newState = state.map((course) => {
          if (course.id === action.payload.course.id) {
            editCourse = true;
            return { ...action.payload.course };
          } else {
            return course;
          }
        });
        // Payload course not inside state => Append payload course
        if (!editCourse) return [...state, { ...action.payload.course }];
        // Payload course is inside state => Replace course inside state
        else return newState;
      }
    // Remove course from inside state
    case ACTIONS.DELETE_COURSE:
      return state.filter((course) => course.id !== action.payload.id);
    case ACTIONS.CLEAR_STATE:
      return null;
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userUID, setUserUID] = useState();
  const [loading, setLoading] = useState(true);
  const [isNewUser, setisNewUser] = useState(false);
  const [userObject, setUserObject] = useState();
  const [courseObjects, dispatch] = useReducer(reducer, []);
  const [courseIds, setCourseIds] = useState();

  // MISC: Given a string (name), return a (at most) 2 letter initial
  function findInitials(author) {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
    let initials = [...author.matchAll(rgx)] || [];
    initials = (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();
    return initials;
  }

  // Handles create account through Firebase
  function signup(email, password) {
    // Error checking
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userData) => {
        // Account creation logged user in
        auth.signOut();
        // Send email verification link to user
        userData.user.sendEmailVerification();
        // Create User Object
        const data = User.generateUserJSON(
          "anonymous",
          userData.user.uid,
          false,
          []
        );
        User.addUser(data);
      })
      .catch((err) => {
        return err;
      });
  }
  // Handles login through through web's default system
  function login(email, password, persistence) {
    return auth
      .setPersistence(persistence ? localPersistence : sessionPersistence)
      .then(() => {
        return auth
          .signInWithEmailAndPassword(email, password)
          .then((userData) => {
            setisNewUser(
              userData.user.metadata.creationTime ===
                userData.user.metadata.lastSignInTime
            );
            return userData;
          });
      });
  }
  // Handles login through google provider
  function loginWithGoogle() {
    return auth.signInWithPopup(googleProvider).then((userData) => {
      if (userData.additionalUserInfo.isNewUser) {
        const data = User.generateUserJSON(
          "anonymous",
          userData.user.uid,
          false,
          []
        );
        User.addUser(data);
      }
      User.getUser(userData.user.uid, (user) => {
        setisNewUser(
          userData.additionalUserInfo.isNewUser || user?.name === "anonymous"
        );
      });
    });
  }
  // Handles login through facebook provider
  function loginWithFacebook() {
    return auth.signInWithPopup(facebookProvider).then((userData) => {
      if (userData.additionalUserInfo.isNewUser) {
        const data = User.generateUserJSON(
          "anonymous",
          userData.user.uid,
          false,
          []
        );
        User.addUser(data);
      }
      User.getUser(userData.user.uid, (user) => {
        setisNewUser(
          userData.additionalUserInfo.isNewUser || user?.name === "anonymous"
        );
      });
    });
  }
  // Handles logout functionality
  function logout() {
    return auth.signOut();
  }
  // Handles sending reset password confirmation
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  // Handles sending update email confirmation
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }
  // Handles sending update password confirmation
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }
  // Handles sending update profile confirmation
  function updateProfile(firstName, lastName, isInstructor) {
    let handleUpdateProfile = (user) => {
      const data = User.generateUserJSON(
        `${firstName} ${lastName}`,
        user.id,
        isInstructor,
        user.classIds ? user.classIds : []
      );
      return User.updateUser(currentUser.uid, data);
    };
    User.getUser(currentUser.uid, handleUpdateProfile);
  }
  // Handles deleting account
  function deleteAccount(uid) {
    return currentUser.delete();
  }
  // On Mount and unmount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setUserUID(user.uid);
        app
          .database()
          .ref("users/" + user.uid)
          .once("value", (snapshot) => {
            setUserObject(snapshot.val());
          });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  // Add listeners after login
  useEffect(() => {
    if (currentUser) {
      app
        .database()
        .ref("users/" + userUID)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          setUserObject(data);
        });
      // Set up a listener for the user's list of course ids
      app
        .database()
        .ref("users/" + userUID + "/courseIds")
        .on("value", (snapshot) => {
          setCourseIds(snapshot.val());
          // For each course id on the user's list of course ids
          snapshot.forEach((childSnapshot) => {
            // Set up a listener for the course object
            app
              .database()
              .ref("courses/" + childSnapshot.val())
              .on("value", (snapshot) => {
                dispatch({
                  type: ACTIONS.SET_COURSE,
                  payload: { course: snapshot.val() },
                });
              });
          });
        });
      // Removed course object listener if the course id of the course object is deleted
      app
        .database()
        .ref("users/" + userUID + "/courseIds")
        .on("child_removed", (snapshot) => {
          app
            .database()
            .ref("courses/" + snapshot.val())
            .off();
          dispatch({
            type: ACTIONS.DELETE_COURSE,
            payload: { id: snapshot.val() },
          });
        });
    }
  }, [currentUser, userUID]);
  // Clean up listeners and state after logout
  useEffect(() => {
    // On logout...
    if (!currentUser) {
      // Clear all listeners
      app
        .database()
        .ref("users/" + userUID)
        .off();
      app
        .database()
        .ref("users/" + userUID + "/courseIds")
        .off();
      if (courseIds) {
        for (let courseid of courseIds) {
          app
            .database()
            .ref("courses/" + courseid)
            .off();
        }
      }
      // Clear all private data
      setUserUID(null);
      setUserObject(null);
      setCourseIds(null);
      dispatch({
        type: ACTIONS.CLEAR_STATE,
      });
    }
  }, [currentUser, userUID, courseIds]);
  const value = {
    findInitials,
    currentUser,
    userUID,
    isNewUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    loginWithGoogle,
    loginWithFacebook,
    deleteAccount,
    updateProfile,
    userObject,
    courseObjects,
    courseIds,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
