<template>
	<view class="hello">
		<view class="mainTop">
			<img src="../../static/img/listTop.png"></img>
			<view class="name">排查助手</view>
			<view class="title">
				<view class="username"><img src="../../static/img/face.png"></img> 您好 {{userName}}，同心战疫，湖北加油！</view>
				<view class="date">当前日期：{{systemDate}}</view>
				<view class="count">今日需排查人数：<text style="font-size: 25px;">{{monitorNum}}</text>人</view>
			</view>
		</view>
	
		<view class="mainList">
			<view v-if="monitorNum==0">
				<text style="text-align: center;">暂无需要排查的人员</text>
			</view>
		    <view v-else v-for="(monitor,index) in myMonitorList" :key="monitor.taskId" class="mainCard">
				<view @tap="getPatient(index)">
				<view class="line">
					<img src="../../static/img/username.png"></img>
					<!-- <text class="username">患者ID{{monitor.id}}</text> -->
					<text class="username">{{monitor.patientName}}</text>
					<text class="mobile">{{monitor.phone}}</text>
					<!-- todo:背景颜色需要判断 -->
					<text v-if="monitor.isReported=='0'" class="state">{{monitor.isReportedStr}}</text>
					<text v-else class="state blue">{{monitor.isReportedStr}}</text>
				</view>
				<view class="text"><text>{{monitor.nowAddress}}</text></view>
				<view class="text"><text>{{monitor.checkStatusStr}}</text></view>
				</view>
		    </view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['hasLogin','userId']),
		onLoad() {
		
		},
		mounted() {
			this.getNowFormatDate();
			this.queryMonitorList(this.userId);
		},
		data(){
			return{
				userName:'',
				systemDate:'',
				monitorNum:'',
				myMonitorList:[],
				monitorNum:''
			}
		},
		methods:{
			getNowFormatDate() {
				let date = new Date();
				let seperator1 = "-";
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				this.systemDate = year + seperator1 + month + seperator1 + strDate;
			},
			getPatient(monitorIndex){
				let patientId = this.myMonitorList[monitorIndex].id;
				uni.navigateTo({
					url: './personInfo?patientId='+patientId
				})
			},
			queryMonitorList(userId){
				let that = this;
                that.sendRequest({
                    url : "task/getTaskList",
                    data : {userId: userId},
                    hideLoading : false,
                    success:function (res) {
                        that.myMonitorList = res.data.patientVOList;
                        that.monitorNum = res.data.monitorNum;
                        that.userName = res.data.loginName;
                        that.monitorNum = res.data.monitorNum;
                    }
                })
			}
		}
	}
</script>

<style>
	image{
		vertical-align: middle;
	}
	.hello {
		box-sizing: border-box;
		width: 100%;
		background-color: #f5f5f5;
	}
	.mainTop {
		width:100%;
		height: 400rpx;
		position: relative;
	}
	.mainTop>image {
		position: absolute;
		left: 0;
		top: 0;
		width:100%;
		height: 330rpx;
	}
	.mainTop .title {
		position: absolute;
		left: 40rpx;
		bottom: 0;
		width: 630rpx;
		height: 138rpx;
		background-color: #fff;
		border-radius: 6rpx;
		padding:20rpx;
		box-shadow: rgba(0,0,0,.15) 0 0 20rpx;
	}
	.mainTop .name {
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top:90rpx;
		color:#fff;
		padding:0 40rpx;
		width:100%;
		font-size: 44rpx;
	}
	.mainTop .title image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		margin-top: -4rpx;
	}
	.mainTop .title .username {
		font-size: 32rpx;
		color:#333;
		line-height: 64rpx;
		margin-bottom: 16rpx;
	}
	.mainTop .title .date {
		font-size: 28rpx;
		float: right;
		line-height: 52rpx;
		color:#555;
	}
	.mainTop .title .count {
		line-height: 52rpx;
		font-size: 28rpx;
		color:#555;
	}
	.mainTop .title .count text {
		color:#1c70c9;
	}
	.mainList {
		box-sizing: border-box;
		padding:40rpx 40rpx 0 40rpx;
		width:100%;
	}
	.mainCard {
		background-color: #fff;
		border-radius: 6rpx;
		padding: 20rpx;
		line-height: 54rpx;
		margin-bottom: 24rpx;
		box-shadow: rgba(0,0,0,.15) 0 0 20rpx;
	}
	.mainCard .line image {
		width:46rpx;
		height: 46rpx;
		margin-right: 10rpx;
	}
	.mainCard .line .username {
		font-size: 32rpx;
		color:#555;
		display: inline-block;
		min-width:140rpx;
		vertical-align: top;
	}
	.mainCard .line .mobile {
		font-size: 28rpx;
		color:#7a7a7a;
	}
	.mainCard .line .state {
		float: right;
		font-size: 26rpx;
		line-height: 32rpx;
		border-radius: 16rpx;
		color:#fff;
		padding:0 16rpx;
		background-color: #ff5555;
		margin-top: 11rpx;
	}
	.mainCard .line .state.blue {
		background-color: #1C70C9;
	}
	.mainCard .text {
		font-size: 28rpx;
		color: #7a7a7a;
		padding-left: 56rpx;
	}
</style>
