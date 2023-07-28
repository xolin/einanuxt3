import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      order: {
        grip: false,
        size: 0,
        contact: '',
        name: '',
        address: '',
        addressextend: '',
        postalcode: '',
        city: ''
      }
    };
  },
  mutations: {
    setGrip(state, bool) {
      state.order.grip = bool
    },
    setSize(state, num) {
      state.order.size = num
    },
    setContact(state, val) {
      state.order.contact = val
    },
    setName(state, val) {
      state.order.name = val
    },
    setAddress(state, val) {
      state.order.address = val
    },
    setAddressextend(state, val) {
      state.order.addressextend = val
    },
    setPostalcode(state, val) {
      state.order.postalcode = val
    },
    setCity(state, val) {
      state.order.city = val
    },


  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
  // Install the store instance as a plugin

});