<template>
	<view class="personInfoContain">
		<view class="personInfo">
			<view class="line"></view>
			<view class="step">
				<image src="../../static/img/check.png" mode=""></image>
				<view>确认基本信息</view>
			</view>
			<view class="step">
				<image src="../../static/img/2-active.png" mode=""></image>
				<view>上报核查情况</view>
			</view>
		</view>
		<view class="editForm">
			<view class="formItem">
				<view class="label"><text>*</text>状态</view>
				<view class="radio" v-for="(item, index) in statusOptions">
					<radio :key="item.name" v-model="patientInfo.checkStatus" :checked="item.checked">{{item.value}}</radio>
				</view>
			</view>
		</view>
		<view class="editForm">
			<view class="formItem">
				<view class="label"><text>*</text>现住址</view>
				<input v-model="patientInfo.nowAddress" placeholder="请输入现居住地址"></input>
			</view>
		</view>
		<view class="editForm">
			<view class="formItem">
				<view class="label"><text>*</text>现地址类型</view>
				<view class="radio" v-for="(item, index) in typeOptions">
					<radio :key="item.name" v-model="patientInfo.nowAddressType" :checked="item.checked">{{item.value}}</radio>
				</view>
			</view>
		</view>
		<view class="editForm">
			<view class="formItem">
				<view class="label">
					<text>*</text>
					上报时的定位
					<image src="../../static/img/sync.png"></image>
				</view>
				<input v-model="patientInfo.reportingPosition"></input>
			</view>
		</view>
		<view class="submitBtn">
			<button @tap="submitUpload()">提交</button>
			<view class="submitTips">可提交多次，以最后一次提交的信息为准</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.patientId = options.patientId;
			this.getUserInfo(this.patientId);
		},
		data() {
			return {
				patientId:"",
				patientInfo:"",
				//是否是修改状态 默认为false不修改，点击修改则是true修改
				modifyFlag:false,
				location: '中国-湖北-武汉-江夏',
				statusOptions: [
					{name: '1', value: '确证', checked: true},
					{name: '2', value: '死亡'}
				],
				typeOptions: [
					{name: '1', value: '定点医院', checked: true},
					{name: '2', value: '方舱医院'},
					{name: '3', value: '隔离点'},
					{name: '4', value: '居家'}
				]
			}
		},
		methods: {
			getUserInfo(patientId){
				let that = this;
				that.sendRequest({
				    url : "task/getPatientInfo",
				    data : {patientId: patientId},
				    hideLoading : true,
				    success:function (res) {
						that.patientInfo = res.data;
				    }
				})
			},
			submitUpload(){
				let that = this;
				console.log(that.patientInfo);
				that.sendRequest({
					method : "POST",
				    url : "task/submitPatientReport",
				    data : that.patientInfo,
				    hideLoading : true,
				    success:function (res) {
						if(res.msg==="success"){
							uni.showToast({
								title:"保存成功"
							})
							setTimeout(() => {
								uni.navigateBack();
							}, 600);
						}
				    }
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
	.editForm {
		box-sizing: border-box;
		width:100%;
		padding-left: 40rpx;
		background-color: #fff;
		padding-bottom: 24rpx;
		margin-top: 20rpx;
	}
	.formItem {
		border-bottom: 1rpx solid #e5e5e5;
		padding:10rpx 0;
	}
	.formItem .label {
		font-size: 32rpx;
		color:#333;
		line-height: 60rpx;
	}
	.formItem .label text {
		color:#ff5555;
	}
	.formItem .label image {
		float: right;
		width:28rpx;
		height:28rpx;
		margin-top: 16rpx;
		margin-right: 40rpx;
	}
	.formItem input {
		font-size: 28rpx;
		color:#b4b4b4;
		border: none;
		outline: none;
		line-height: 50rpx;
		margin-top: 10rpx;
	}
	.radio {
		font-size: 28rpx;
		color:#333;
		line-height: 70rpx;
	}
	.radio radio {
		font-size: 28rpx;
	}
	.submitBtn {
		margin:50rpx 40rpx 0 40rpx;
	}
	.submitBtn button {
		font-size: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		color:#fff;
		background-color: #3753BB;
	}
	.submitBtn .submitTips {
		font-size: 24rpx;
		color:#898989;
		line-height: 48rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}
</style>
