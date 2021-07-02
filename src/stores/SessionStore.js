import { action, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class SessionStore extends BaseStore {
  token: string;
  @observable.deep user;

  constructor(stores) {
    super(stores);
    makeObservable(this);
  }

  @action
  reset() {
    this.user = null;
    this.token = null;
  }

  @action
  setToken(token: string) {
    this.token = token;
  }

  @action
  setUser(user) {
    this.user = user;
  }
}