class Accessor {
    static getObject(ref, id, callback) {
        ref.child(id).once("value", (snapshot) => {
            callback(snapshot.val());
        });
    }
    static getObjectList(ref, ids, callback) {
        ref.once("value", (snapshot) => {
            snapshot = snapshot.toJSON();
            var objects = [];
            if(!ids) {
                callback(objects);
                return
            }
            for(const id of ids) {
                objects.push(snapshot[id]);
            }
            callback(objects);
        });
    }
    static addObject(ref, json, callback) {
        ref.child(json.id).set(json).then(callback);
    }
    static deleteObject(ref, id, callback) {
        ref.child(id).remove().then(callback);
    }
    static updateObject(ref, id, json, callback) {
        ref.child(id).update(json).then(callback);
    }
    static generateId(length) {
        let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for(let i = length; i > 0; i--) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
}
module.exports = { Accessor};