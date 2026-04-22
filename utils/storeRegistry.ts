type ResettableStore = {
  reset: () => void;
};

const stores: ResettableStore[] = [];

export const registerStore = (store: ResettableStore) => {
  if (!stores.includes(store)) {
    stores.push(store);
  }
};

export const resetAllStores = () => {
  stores.forEach(store => store.reset());
};
