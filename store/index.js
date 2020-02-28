import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userId: "",
	},
	mutations: {
		login(state, userId) {
			state.userId = userId || '';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		}
	},
	actions:{
		changeFun:function(context,obj){
			context.commit('login',obj.userId)
		}
	}
})

export default store
