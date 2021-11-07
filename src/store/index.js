import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const API_URL = 'https://50ia6qttsk.execute-api.ap-southeast-1.amazonaws.com/Prod/location';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locations: [],
    weather: {},
    isLoading: false,
    error: '',
  },
  getters: {
    gettersLocations: (state) => state.locations,
    gettersWeather: (state) => state.weather,
    gettersIsLoading: (state) => state.isLoading,
    gettersError: (state) => state.error,
  },
  actions: {
    getLocations({ commit }, coords) {
      commit('mutateIsLoading', true);
      return axios
        .get(`${API_URL}/?lattlong=${coords.latitude},${coords.longitude}`)
        .then((response) => {
          commit('mutateGetLocations', response.data);
          return Promise.resolve();
        })
        .catch(({ message }) => {
          commit('mutateError', message);
        })
        .finally(() => commit('mutateIsLoading', false));
    },
    getLocationsByName({ commit }, name) {
      commit('mutateIsLoading', true);
      return axios
        .get(`${API_URL}/?query=${name}`)
        .then((response) => {
          commit('mutateGetLocations', response.data);
          return Promise.resolve();
        })
        .catch(({ message }) => {
          commit('mutateError', message);
        })
        .finally(() => commit('mutateIsLoading', false));
    },
    getWeather({ commit }, id) {
      commit('mutateIsLoading', true);
      return axios
        .get(`${API_URL}/?id=${id}`)
        .then((response) => {
          commit('mutateGetWeather', response.data);
          return Promise.resolve();
        })
        .catch(({ message }) => {
          commit('mutateError', message);
        })
        .finally(() => commit('mutateIsLoading', false));
    },
  },
  mutations: {
    mutateGetLocations(state, locations) {
      state.locations = locations;
    },
    mutateGetWeather(state, weather) {
      state.weather = weather;
    },
    mutateIsLoading(state, toggle) {
      state.isLoading = toggle;
    },
    mutateError(state, errorMessage) {
      state.error = errorMessage;
    },
  },
});
