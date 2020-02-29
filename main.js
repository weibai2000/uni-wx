import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()

//Vue.prototype.siteBaseUrl="http://10.3.69.25:8080/";
Vue.prototype.siteBaseUrl="https://hcbd.chutianyun.gov.cn/";

Vue.prototype.sendRequest = function(param){
    var _self = this,
        url = param.url,
        method = param.method,
        header = {},
        data = param.data || {},
        token = "",
        hideLoading = param.hideLoading || false;

    //拼接完整请求地址
    var requestUrl = this.siteBaseUrl + url;

    //请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
    if(method){
        method = method.toUpperCase();//小写改为大写
        if(method=="POST"){
            header = {'content-type' : "application/x-www-form-urlencoded"};
        }else{
            header = {'content-type' : "application/json"};
        }
    }else{
        method = "GET";
        header = {'content-type' : "application/json"};
    }
    //用户交互:加载圈
    if (!hideLoading) {
        uni.showLoading({title:'加载中...'});
    }

    //console.log("网络请求start");
    //网络请求
    uni.request({
        url: requestUrl,
        method: method,
        header: header,
        data: data,
        success: res => {
            //console.log("网络请求success:" + JSON.stringify(res));
            if (res.statusCode && res.statusCode != 200) {//api错误
                uni.showModal({
                    content:"请求成功---" + res.errMsg
                });
                return;
            }
            typeof param.success == "function" && param.success(res.data);
        },
        fail: (e) => {
            //console.log("网络请求fail:" + JSON.stringify(e));
            uni.showModal({
                content:"请求失败---" + e.errMsg
            });
            typeof param.fail == "function" && param.fail(e.data);
        },
        complete: () => {
            //console.log("网络请求complete");
            if (!hideLoading) {
                uni.hideLoading();
            }
            typeof param.complete == "function" && param.complete();
            return;
        }
    });
}
