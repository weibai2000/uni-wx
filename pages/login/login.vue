<template>
	<view class="loginContain">
		<view class="loginTop">
			<img src="../../static/img/header.png" mode=""></img>
			<img src="../../static/img/logo.png" mode=""></img>
		</view>
		<view class="loginTip">
			<view>欢迎使用排查助手小程序</view>
			<view>请先登录</view>
		</view>
		<view class="inputGroup">
			<view class="inputRow">
				<img src="../../static/img/loginUser.png" mode=""></img>
				<m-input class="m-input" type="text" clearable focus v-model="phone" placeholder="请输入手机号"></m-input>
			</view>
			<view class="inputRow">
				<img src="../../static/img/lock.png" mode=""></img>
				<m-input type="text" v-model="checkCode" placeholder="请输入验证码"></m-input>
				<view v-if="isShowGetCode" class="code" @tap="bindGetCode()">获取验证码</view>
				<view v-else class="code">{{countdown}}s后可重试</view>
			</view>
		</view>
		<view class="btnRow">
			<button type="primary" class="primary" @tap="bindLogin">登录</button>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput
		},
		computed: mapState(['forcedLogin','hasLogin']),
		data() {
			return {
				providerList: [],
				hasProvider: false,
				phone: '',
				checkCode: '',
				positionTop: 0,
				isDevtools: false,
				openId:'',
				countdown:60,
				timer:'',
				isShowGetCode:true
			}
		},
		methods: {
			countDown(){
			  const self = this
			  this.timer =  setInterval(() =>{
				 self.countdown--
				 if(self.countdown === 0){
				   clearInterval(self.timer)
				   self.countdown = 60
				   self.isShowGetCode = true
				 }
			   },1000)
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.phone.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				}
				if (this.checkCode.length != 6) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				let data = {
					checkCode: this.checkCode,
					openId: this.openId,
					phone: this.phone
				};
				let that = this;
				this.sendRequest({
					method : "POST",
					url : "login",
					data : data,
					hideLoading : false,
					success:function (res) {
						console.log(res)
						if (res.msg==='成功') {
							that.$store.dispatch('changeFun',data);
							that.toMain(res.data);
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg,
							});
						}
					}
				});
			},
			bindGetCode(){
				if (this.phone.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				};
				this.countDown();
				this.isShowGetCode = false;
				this.sendRequest({
					method : "POST",
					url : "login/sendSms",
					data : {phone:this.phone},
					hideLoading : false,
					success:function (res) {
						uni.showToast({
							icon: 'none',
							title: res.msg,
						});
					}
				});
			},
			toMain(userId) {
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				let data = {
					userId:userId,
				};
				if (this.forcedLogin) {
					this.$store.dispatch('changeFun',data);
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}
			},
			checkOpenId(){
				let postData = {
					checkCode: this.checkCode,
					openId: this.openId,
					phone: this.phone
				};
				let that = this;
				this.sendRequest({
					method : "POST",
					url : "login",
					data : postData,
					hideLoading : false,
					success:function (res) {
						if(res.msg==='请使用验证码登录'){
							return;
						}else{
							that.$store.dispatch('changeFun',res.data);
							that.toMain(res.data);
						}
					}
				});
			},
			getCode(){
				let that = this;
				uni.login({
					success: res => {
						console.log(res.code);
						this.sendRequest({
							method : "POST",
							url : "login/getOpenIdFromWX",
							data : {code:res.code},
							hideLoading : false,
							success:function (res) {
								// console.log(res.data)
								that.openId = res.data;
								that.checkOpenId(res.data);
							}
						});
					}
				});
			},
		},
		onReady() {
			this.initPosition();
		},
		mounted(){
			this.getCode();
		}
	}
</script>

<style>
	.loginContain {
		width:100%;
		background-color: #f5f5f5;
	}
	.loginTop {
		width:100%;
		height: 324rpx;
		position: relative;
	}
	.loginTop image:first-child {
		width:100%;
		height: 324rpx;
	}
	.loginTop image:last-child {
		width:220rpx;
		height: 220rpx;
		position: absolute;
		left: 50%;
		bottom:-80rpx;
		margin-left: -110rpx;
	}
	.loginTip {
		text-align: center;
		margin:100rpx 0 50rpx 0;
	}
	.loginTip view {
		font-size: 28rpx;
		color:#7a7a7a;
		line-height: 40rpx;
	}
	.inputGroup {
		padding:0 85rpx;
	}
	.inputRow {
		display: flex;
		border-bottom: 1rpx solid #e5e5e5;
		line-height: 74rpx;
		height: 74rpx;
		margin-bottom: 40rpx;
	}
	.inputRow image {
		width:38rpx;
		height: 44rpx;
		vertical-align: middle;
		margin:10rpx 10rpx 0 10rpx;
	}
	.inputRow input {
		font-size: 28rpx;
		color:#7a7a7a;
	}
	.inputRow .code {
		font-size: 28rpx;
		color:#2143c6;
		text-align: center;
	}
	.btnRow {
		padding:0 85rpx;
	}
	.btnRow button {
		width:100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		color:#fff;
		background-color: #3753BB;
	}
</style>
