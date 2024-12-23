function promisifyRequest(e) {
  return new Promise((t, r) => {
    (e.oncomplete = e.onsuccess = () => t(e.result)),
      (e.onabort = e.onerror = () => r(e.error));
  });
}
function createStore(e, t) {
  const r = indexedDB.open(e);
  r.onupgradeneeded = () => r.result.createObjectStore(t);
  const n = promisifyRequest(r);
  return (e, r) => n.then((n) => r(n.transaction(t, e).objectStore(t)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  return (
    defaultGetStoreFunc ||
      (defaultGetStoreFunc = createStore("keyval-store", "keyval")),
    defaultGetStoreFunc
  );
}
function get(e, t = defaultGetStore()) {
  return t("readonly", (t) => promisifyRequest(t.get(e)));
}
function set(e, t, r = defaultGetStore()) {
  return r("readwrite", (r) => (r.put(t, e), promisifyRequest(r.transaction)));
}
function setMany(e, t = defaultGetStore()) {
  return t(
    "readwrite",
    (t) => (
      e.forEach((e) => t.put(e[1], e[0])), promisifyRequest(t.transaction)
    )
  );
}
function getMany(e, t = defaultGetStore()) {
  return t("readonly", (t) =>
    Promise.all(e.map((e) => promisifyRequest(t.get(e))))
  );
}
function update(e, t, r = defaultGetStore()) {
  return r(
    "readwrite",
    (r) =>
      new Promise((n, u) => {
        r.get(e).onsuccess = function () {
          try {
            r.put(t(this.result), e), n(promisifyRequest(r.transaction));
          } catch (e) {
            u(e);
          }
        };
      })
  );
}
function del(e, t = defaultGetStore()) {
  return t("readwrite", (t) => (t.delete(e), promisifyRequest(t.transaction)));
}
function delMany(e, t = defaultGetStore()) {
  return t(
    "readwrite",
    (t) => (e.forEach((e) => t.delete(e)), promisifyRequest(t.transaction))
  );
}
function clear(e = defaultGetStore()) {
  return e("readwrite", (e) => (e.clear(), promisifyRequest(e.transaction)));
}
function eachCursor(e, t) {
  return (
    (e.openCursor().onsuccess = function () {
      this.result && (t(this.result), this.result.continue());
    }),
    promisifyRequest(e.transaction)
  );
}
function keys(e = defaultGetStore()) {
  return e("readonly", (e) => {
    if (e.getAllKeys) return promisifyRequest(e.getAllKeys());
    const t = [];
    return eachCursor(e, (e) => t.push(e.key)).then(() => t);
  });
}
function values(e = defaultGetStore()) {
  return e("readonly", (e) => {
    if (e.getAll) return promisifyRequest(e.getAll());
    const t = [];
    return eachCursor(e, (e) => t.push(e.value)).then(() => t);
  });
}
function entries(e = defaultGetStore()) {
  return e("readonly", (t) => {
    if (t.getAll && t.getAllKeys)
      return Promise.all([
        promisifyRequest(t.getAllKeys()),
        promisifyRequest(t.getAll()),
      ]).then(([e, t]) => e.map((e, r) => [e, t[r]]));
    const r = [];
    return e("readonly", (e) =>
      eachCursor(e, (e) => r.push([e.key, e.value])).then(() => r)
    );
  });
}
export {
  clear,
  createStore,
  del,
  delMany,
  entries,
  get,
  getMany,
  keys,
  promisifyRequest,
  set,
  setMany,
  update,
  values,
};
