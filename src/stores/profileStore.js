export default {
  state() {
    return {
      profile: {
        name: '',
        email: '',
        alamat: '',
        noTelp: '',
      },
    };
  },
  mutations: {
    SET_USER_PROFILE(state, payload) {
      state.profile = payload;
    },
    UPDATE_USER_PROFILE(state, payload) {
      Object.assign(state.profile, payload);
    },
  },
  actions: {
    saveUserProfile({ commit }, userProfile) {
      commit('SET_USER_PROFILE', userProfile);
    },
    updateUserProfile({ commit }, updatedProfile) {
      commit('UPDATE_USER_PROFILE', updatedProfile);
    },
  },
  getters: {
    getUserProfile(state) {
      return state.profile;
    },
  },
};
