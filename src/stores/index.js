import { createStore } from 'vuex';
import profileStore from './profileStore';
import productStore from './productStore';

export const store = createStore({
  modules: {
    profile: profileStore,
    product: productStore,
  },
});
