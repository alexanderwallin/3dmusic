
/**
 * Storage
 */
class Storage {
  constructor() {

  }

  getOrSet(key, defaultValue) {
    let val = this.get(key);
    
    if (!val) {
      this.set(key, defaultValue);
      return defaultValue;
    }

    return val;
  }

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    }
    catch (ex) {
      console.error(ex);
      return null;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    catch (ex) {
      console.error(ex);
      return false;
    }
  }
}

export const storage = new Storage();