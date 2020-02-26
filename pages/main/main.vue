<template>
	<view class="content">
		<view v-if="hasLogin" class="hello">
			<view class="title">
				<view>您好 {{userName}}</view>
				<view>当前日期：{{systemDate}}</view>
				<view>监控人数：{{monitorNum}}</view>
			</view>
			<list>
			    <cell v-for="monitor in myMonitorList">
			      <view class="left">{{monitor.userName}}</view>
				  <view class="right">{{monitor.status}}</view>
				  <view class="left">{{monitor.address}}</view>
				  <view class="right">{{monitor.type}}</view>
			    </cell>
			</list>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin']),
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			}
		},
		mounted() {
			this.getNowFormatDate()
		},
		data(){
			return{
				userName:'吴彦祖',
				systemDate:'',
				monitorNum:'5',
				myMonitorList:[
					{userName:'张三',status:'1',address:'武汉',type:'1'},
					{userName:'李四',status:'2',address:'南京',type:'2'},
					{userName:'王五',status:'3',address:'西安',type:'3'}
				]
			}
		},
		methods:{
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				this.systemDate = year + seperator1 + month + seperator1 + strDate;
			}
		}
	}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #000000;
		background-color: #63B0F1;
	}
	
	.left {
		color: #000000;
		margin-left: 25px;
	}
	
	.right {
		color: #000000;
		margin-right: 25px;
	}

	.ul {
		font-size: 15px;
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul>view {
		line-height: 25px;
	}
</style>
