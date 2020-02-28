<template>
	<view class="loginContain">
		<view class="loginTop">
			<image src="../../static/img/header.png" mode=""></image>
			<image src="../../static/img/logo.png" mode=""></image>
		</view>
		<view class="loginTip">
			<view>欢迎使用核查宝典小程序</view>
			<view>请先登录</view>
		</view>
		<view class="inputGroup">
			<view class="inputRow">
				<image src="../../static/img/loginUser.png" mode=""></image>
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入手机号"></m-input>
			</view>
			<view class="inputRow">
				<image src="../../static/img/lock.png" mode=""></image>
				<m-input type="text" v-model="password" placeholder="请输入验证码" @tap="bindGetCode"></m-input>
				<view class="code">获取验证码</view>
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
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '18829011778',
				password: '778899',
				positionTop: 0,
				isDevtools: false,
			}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['login']),
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
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
				if (this.account.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				}
				if (this.password.length != 6) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				/**
				 * 下面简单模拟下服务端的处理
				 * 检测用户账号密码是否在已注册的用户列表中
				 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
				 */
				const data = {
					account: this.account,
					password: this.password
				};
				if (true) {
					this.toMain(this.account);
				} else {
					uni.showToast({
						icon: 'none',
						title: '用户账号或密码不正确',
					});
				}
			},
			bindGetCode(){
				if (this.account.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				}
			},
			oauth(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo.nickName);
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '登陆失败'
								});
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			},
			getUserInfo({
				detail
			}) {
				if (detail.userInfo) {
					this.toMain(detail.userInfo.nickName);
				} else {
					uni.showToast({
						icon: 'none',
						title: '登陆失败'
					});
				}
			},
			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}

			}
		},
		onReady() {
			this.initPosition();
			this.initProvider();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
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
