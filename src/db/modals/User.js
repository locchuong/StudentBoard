import { userRef } from "../../firebase";
import Accessor from "../accessor";

export class User {
  static getUser(id, callback) {
    Accessor.getObject(userRef, id, callback);
  }
  static getUserList(ids, callback) {
    Accessor.getObjectList(userRef, ids, callback);
  }
  static addUser(json, callback) {
    Accessor.addObject(userRef, json, callback);
  }
  static deleteUser(id, callback) {
    Accessor.deleteObject(userRef, id, callback);
  }
  static updateUser(id, json, callback) {
    Accessor.updateObject(userRef, id, json, callback);
  }
  static generateUserJSON(name, id, isInstructor, courseIds) {
    return {
      name,
      id,
      isInstructor,
      courseIds,
    };
  }
};