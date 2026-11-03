export { initializeApp, getApps, getApp } from "firebase/app";
export { getAuth, signInAnonymously } from "firebase/auth";
export {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  onDisconnect,
  runTransaction,
  serverTimestamp,
  remove,
} from "firebase/database";
