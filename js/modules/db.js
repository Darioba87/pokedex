import {
  set,
  del,
  values,
  keys,
} from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

export const db = {
  readKeys: function () {
    // gibt alle keys als Array zurück
    return keys();
  },
  readValues: function () {
    // gibt alle Values als Array zurück
    return values();
  },
  writeItem: function (key, data) {
    // schreibt ein key:value Paar in die DB
    return set(key, data);
  },
  deleteItem: function (key) {
    // löscht ein key:value Paar aus der DB
    del(key);
  },
  updateItem: async function (blob) {
    let key = blob.id;
    this.writeItem(key, blob);
  },
};
