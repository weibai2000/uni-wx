<template>
	<view class="editContain">
		<form bindsubmit="formSubmit" bindreset="formReset">
			<view class="editForm">
				<view class="formItem">
					<view class="label">姓名</view>
					<input v-model="patientInfo.patientName"></input>
				</view>
				<view class="formItem">
					<view class="label">状态</view>
					<view class="radio" v-for="(item, index) in statusOptions">
						<radio :key="item.name" v-model="item.name" :checked="item.checked">{{item.value}}</radio>
					</view>
				</view>
				<view class="formItem">
					<view class="label">性别</view>
					<view class="radio" v-for="(item, index) in sexOptions">
						<radio :key="item.name" v-model="item.name" :checked="item.checked">{{item.value}}</radio>
					</view>
				</view>
				<view class="formItem">
					<view class="label">手机号码</view>
					<input v-model="patientInfo.phone"></input>
				</view>
				<view class="formItem">
					<view class="label">证件号码</view>
					<input v-model="patientInfo.idNum"></input>
				</view>
				<view class="formItem">
					<view class="label">现可能地址</view>
					<input v-model="patientInfo.nowAddress"></input>
				</view>
				<view class="formItem">
					<view class="label">确诊上报单位</view>
					<input v-model="patientInfo.nowAddressType"></input>
				</view>
				<view class="formItem">
					<view class="label">现可能地址坐标</view>
					<input v-model="patientInfo.nowPosition"></input>
				</view>
			</view>
			<view>
				<button class="submitBtn" @tap="submitInfo()">确认修改</button>
			</view>
		</form>
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
				patientId:'',
				patientInfo:{},
				statusOptions: [
				  { name: '0', value: '正常' },
				  { name: '1', value: '确诊' },
				  { name: '2', value: '疑似' },
				  { name: '3', value: '发热' },
				  { name: '4', value: '密切接触' }
				],
				sexOptions: [
				  { name: '1', value: '男' },
				  { name: '2', value: '女' }
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
			submitInfo(){
				let that = this;
				that.sendRequest({
					method : "POST",
				    url : "task/updatePatientInfo",
				    data : that.patientInfo,
				    hideLoading : true,
				    success:function (res) {
						if(res.msg==="成功"){
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
	.editContain {
		width:100%;
		background-color: #f5f5f5;
	}
	.editForm {
		box-sizing: border-box;
		width:100%;
		padding-left: 40rpx;
		background-color: #fff;
		padding-bottom: 24rpx;
		margin-bottom: 20rpx;
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
		width: 670rpx;
		margin:0 40rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		text-align: center;
		color:#fff;
		background-color: #3753BB;
		margin-bottom: 20rpx;
	}
</style>
