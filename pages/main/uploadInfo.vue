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
				<view>上报排查情况</view>
			</view>
		</view>
		<view class="editForm">
			<view class="formItem">
				<view class="label"><text>*</text>状态</view>
				<view class="radio" v-for="(item, index) in statusOptions">
					<radio :key="item.name" v-model="item.name" :checked="item.checked" @tap="changeStatus(item.name)">{{item.value}}</radio>
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
					<radio :key="item.name" v-model="item.name" :checked="item.checked" @tap="changeType(item.name)">{{item.value}}</radio>
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
		// 	this.patientId = options.patientId;
			this.getUserInfo(this.patientId);
		},
		data() {
			return {
				patientId:"1",
				patientInfo:"",
				//是否是修改状态 默认为false不修改，点击修改则是true修改
				modifyFlag:false,
				statusOptions: [
					{name: '0', value: '正常'},
					{name: '1', value: '确诊'},
					{name: '4', value: '隔离'},
					{name: '2', value: '失联'},
					{name: '3', value: '死亡'}
				],
				typeOptions: [
					{name: '1', value: '定点医院'},
					{name: '2', value: '方舱医院'},
					{name: '3', value: '隔离点'},
					{name: '4', value: '居家'}
				],
				typeVal: '', //该条数据用来传值
				statusVal: ''
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
						//加载页面 同时填充选择框的值
						that.setRadio(res.data);
				    }
				})
			},
			submitUpload(){
				if(this.statusVal==""){
					uni.showToast({
						title:"请选择人员状态"
					})
					return;
				}
				if(this.patientInfo.nowAddress==""){
					uni.showToast({
						title:"请填写现住址"
					})
					return;
				}
				if(this.typeVal==""){
					uni.showToast({
						title:"请选择现地址类型"
					})
					return;
				}
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
								title:"上报成功"
							})
							setTimeout(() => {
								let pages = getCurrentPages(); // 当前页面
								let beforePage = pages[pages.length - 2];
								uni.navigateBack({
									success: function() {
										 beforePage.onShow() // 执行前一个页面的方法
									 }
								});
							}, 600);
						}
				    }
				})
			},
			changeType(name){
				let that = this;
				let nso = that.typeOptions.map(item => {
					if (item.name == name) {
						that.typeVal = name
						item.checked = true
					} else {
						item.checked = false
					}
					return item
				})
				that.typeOptions = nso;
				that.patientInfo.nowAddressType = that.typeVal;
			},
			changeStatus(name){
				let that = this;
				let nso = that.statusOptions.map(item => {
					if (item.name == name) {
						that.statusVal = name
						item.checked = true
					} else {
						item.checked = false
					}
					return item
				})
				that.statusOptions = nso;
				that.patientInfo.patientStatus = that.statusVal;
			},
			setRadio(data){
				let that = this;
				let optionOne = that.statusOptions.map(item => {
					if (item.name == data.patientStatus) {
						that.statusVal = data.patientStatus
						item.checked = true
					} else {
						item.checked = false
					}
					return item
				})
				that.statusOptions = optionOne;
				that.statusVal = data.patientStatus;
				let optionTwo = that.typeOptions.map(item => {
					if (item.name == data.nowAddressType) {
						that.typeVal = data.nowAddressType
						item.checked = true
					} else {
						item.checked = false
					}
					return item
				})
				that.typeOptions = optionTwo;
				that.typeVal = data.nowAddressType;
			},
			getAuthorizeInfo(){
				const that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() { // 允许授权
						that.getLocationInfo();
					},
					fail(){    // 拒绝授权
						that.openConfirm();
						console.log("你拒绝了授权，无法获得周边信息")
					}
				})
			},
			// 获取地理位置
			getLocationInfo(){  
				uni.getLocation({
					type: 'wgs84',
					success (res) {
						console.log(res);
					}
				});
			},
			// 再次获取授权
			// 当用户第一次拒绝后再次请求授权
			openConfirm(){
				uni.showModal({
					title: '请求授权当前位置',
					content: '需要获取您的地理位置，请确认授权',
					success: (res)=> {
						if (res.confirm) {
							uni.openSetting();// 打开地图权限设置
						} else if (res.cancel) {
							uni.showToast({
								title: '你拒绝了授权，无法获得周边信息',
								icon: 'none',
								duration: 1000
							})
						}
					}
				});
			},
			onShow() {
				// 动态设置标题
				// uni.setNavigationBarTitle({
				//     title: this.$t('买金'),
				// })
			   this.getAuthorizeInfo();
			}
		}
	}
</script>

<style>
	.personInfoContain {
		width: 100%;
		background-color: #f5f5f5;
		padding-top: 152rpx;
	}
	.personInfo {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		width:100%;
		box-sizing: border-box;
		width:100%;
		padding: 0 40rpx;
		height: 152rpx;
		background-color: #3753BB;
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
