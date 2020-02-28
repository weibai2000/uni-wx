<template>
	<view class="personInfoContain">
		<view class="personInfo">
			<view class="line"></view>
			<view class="step">
				<img src="../../static/img/1.png" mode=""></img>
				<view>确认基本信息</view>
			</view>
			<view class="step">
				<img src="../../static/img/2.png" mode=""></img>
				<view>上报核查情况</view>
			</view>
		</view>
		<view class="personChange" @tap="editInfo(patientId)">信息有误，我要修改</view>
		<view class="personInfoList">
			<view><text>姓名</text><text>{{patientInfo.patientName}}</text></view>
			<view><text>类型</text><text>{{patientInfo.checkStatusStr}}</text></view>
			<view><text>性别</text><text>{{patientInfo.patientSex=='1'?'男':'女'}}</text></view>
			<view><text>手机号码</text><text>{{patientInfo.phone}}</text></view>
			<view><text>证件号码</text><text>{{patientInfo.idNum}}</text></view>
		</view>
		<view class="personInfoList">
			<view><text>现可能地址</text><text>{{patientInfo.nowAddress}}</text></view>
			<view><text>确诊上报单位</text><text>{{patientInfo.nowAddressType}}</text></view>
			<view><text>现可能地址坐标</text><text>{{patientInfo.nowPosition}}</text></view>
		</view>
		<view class="personInfoBtn">
			<button class="primaryBtn" @tap="goUpload(patientId)">确认信息无误</button>
			<button class="defaultBtn">人员失联</button>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.patientId = options.patientId;
		},
		mounted() {
			this.getPatientInfo(this.patientId);
		},
		data() {
			return {
				patientId:"",
				patientInfo:{},
			}
		},
		methods: {
			getPatientInfo(patientId){
				let that = this;
				that.sendRequest({
				    url : "task/getPatientInfo",
				    data : {patientId: patientId},
				    hideLoading : true,
				    success:function (res) {
						that.patientInfo = res.data;
						console.log(that.patientInfo);
						console.log(that.patientInfo.patientName);
				    }
				})
			},
			editInfo(patientId){
				uni.navigateTo({
					url: './editPerson?patientId='+patientId
				})
			},
			goUpload(patientId) {
				uni.navigateTo({
					url: './uploadInfo?patientId='+patientId
				})
			}
		}
	}
</script>

<style>
	.personInfoContain {
		width: 100%;
		background-color: #f5f5f5;
	}
	.personInfo {
		box-sizing: border-box;
		width:100%;
		padding: 0 40rpx;
		height: 152rpx;
		background-color: #3753BB;
		position: relative;
		display: flex;
	}
	.personInfo .step {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 36rpx 0;
	}
	.personInfo .step view {
		color:#fff;
	}
	.personInfo .step image {
		width:36rpx;
		height:36rpx;
	}
	.personInfo .line {
		position: absolute;
		left: 50%;
		top: 56rpx;
		width:260rpx;
		margin-left: -130rpx;
		border-bottom: 1rpx solid #fff;
	}
	.personChange {
		height: 70rpx;
		line-height: 70rpx;
		text-align: right;
		font-size: 28rpx;
		color:#1c70c9;
		padding:0 40rpx;
		background-color: #f5f5f5;
	}
	.personInfoList {
		box-sizing: border-box;
		width:100%;
		padding-left: 40rpx;
		background-color: #fff;
		padding-bottom: 24rpx;
		margin-bottom: 20rpx;
	}
	.personInfoList>view {
		line-height: 96rpx;
		border-bottom: 1rpx solid #e5e5e5;
	}
	.personInfoList>view text:first-child {
		font-size: 24rpx;
		color:#555;
	}
	.personInfoList>view text:last-child {
		font-size: 28rpx;
		color:#555;
		float: right;
		margin-right: 40rpx;
	}
	.personInfoBtn {
		display: flex;
	}
	.personInfoBtn .primaryBtn {
		box-sizing: border-box;
		width:320rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		color:#fff;
		background-color: #3753BB;
	}
	.personInfoBtn .defaultBtn {
		box-sizing: border-box;
		width: 320rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color:#555;
		border: 1rpx solid #e5e5e5;
	}
</style>
