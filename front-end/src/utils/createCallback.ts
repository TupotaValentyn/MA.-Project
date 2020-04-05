import { RootStore } from '@reducers/index';

const createCallback = <D>(
  callback: (arg0: D) => void,
  selector: (state: RootStore) => D
) => {
  return (() => {
    let oldValue: D;

    return (state: RootStore) => {
      const value = selector(state);

      if (value !== oldValue) {
        oldValue = value;
        callback(value);
      }
    };
  })();
};

export default createCallback;
