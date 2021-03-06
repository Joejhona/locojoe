import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import { ME_CLINICS_REQUEST } from '../actions/work'
//import apiCall from 'utils/api'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/auth'
import { getMe } from '@/services/GraphqlService'

const state = { status: '', profile: {}, jobs: {} }

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name,
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}) => {
    commit(USER_REQUEST)
    getMe()
    //console.log(name)
    //apiCall({url: 'user/me'})
      .then(resp => {
        let user = resp.data.data
        console.log(user)
        commit(USER_SUCCESS, user)
        dispatch(ME_CLINICS_REQUEST)
      })
      .catch(resp => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status  = 'success'
    Vue.set(state, 'profile', resp.me)
    state.jobs    = resp.mejob
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: (state) => {
    state.profile = {}
    state.jobs    = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}