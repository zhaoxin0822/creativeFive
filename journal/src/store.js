import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

 const getAuthHeader = () => {
   return { headers: {'Authorization': localStorage.getItem('token')}};
 }

export default new Vuex.Store({
  state: {
  user: {},
  loginError: '',
  registerError: '',
  token: '',
  feed: [],
},
  getters: {
    user: state => state.user,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '')
       return false;
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    feed: state => state.feed,
  },

  mutations: {
  setUser (state, user) {
    state.user = user;
  },
  setToken (state, token) {
    state.token = token;
  if (token === '')
	localStorage.removeItem('token');
  else
	localStorage.setItem('token', token)
  },
  setLoginError (state, message) {
    state.loginError = message;
  },
  setRegisterError (state, message) {
    state.registerError = message;
  },
  setFeed (state, feed) {
    state.feed = feed;
  },
 },

 actions: {
    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('setToken',token);
         context.commit('setUser',response.data.user);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('setUser',{});
         context.commit('setToken','');
       });
      }
    },

   // Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setToken',response.data.token);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
      }).catch(error => {
        context.commit('setLoginError',"");
        context.commit('setUser',{});
        context.commit('setToken','');
        if (error.response) {
          if (error.response.status === 403)
            context.commit('setRegisterError',"That email address already has an account.");
          else if (error.response.status === 409)
            context.commit('setRegisterError',"That user name is already taken.");
          return;
        }
         context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },

    login(context,user) {
      axios.post("/api/login",user).then(response => {
      context.commit('setUser', response.data.user);
      context.commit('setToken',response.data.token);
      context.commit('setRegisterError',"");
      context.commit('setLoginError',"");
          }).catch(error => {
      context.commit('setUser',{});
      context.commit('setToken','');
      context.commit('setRegisterError',"");
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 400)
        context.commit('setLoginError',"Invalid login.");
        context.commit('setRegisterError',"");
        return;
      }
      context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },

    logout(context,user) {
       context.commit('setUser', {});
       context.commit('setToken','');
     },

     getFeed(context) {
       return axios.get("/api/users/" + context.state.user.id + "/journals").then(response => {
        console.log("I am here to get the data");
       	return context.commit('setFeed',response.data.journals);
             }).catch(err => {
       	console.log("getFeed failed:",err);
       });
     },

     addJournal(context,journal) {
       console.log("this is for users", context.state.user.id)
       return axios.post("/api/users/" + context.state.user.id + "/journals",journal, getAuthHeader()).then(response => {
         console.log("I am here to call getFeed");
         return context.dispatch('getFeed');
            }).catch(err => {
        console.log("addJournal failed:",err);
      });
      console.log("after the journal be add",context.state.feed);
    },

    updateJournal(context, journal){
      console.log("I am here to update Journal in store");
      return axios.put("/api/users/" + context.state.user.id + "/journals",journal).then(response =>{
        return context.dispatch('getFeed')
      }).catch(err => {
        console.log("updateJournal failed:",err);
      });
    },

    deleteJournal(context, journal){
      console.log("I am here to delete Journal in store");
      return axios.put("/api/users/todelete/" + context.state.user.id + "/journals",journal).then(response =>{
        return context.dispatch('getFeed')
      }).catch(err => {
        console.log("updateJournal failed:",err);
      });
    },
  }

});
