<template>
	<view>
		<text @tap="editInfo(userId)">信息有误，我要修改</text>
		<view>
			<view><text>姓名</text><text>{{personInfo.userName}}</text></view>
			<view><text>类型</text><text>{{personInfo.type}}</text></view>
			<view><text>性别</text><text>{{personInfo.sex}}</text></view>
			<view><text>手机号码</text><text>{{personInfo.phoneNumber}}</text></view>
			<view><text>证件号码</text><text>{{personInfo.idCard}}</text></view>
			<view><text>现可能地址</text><text>{{personInfo.position}}</text></view>
			<view><text>确诊上报单位</text><text>{{personInfo.department}}</text></view>
			<view><text>现可能地址坐标</text><text>{{personInfo.location}}</text></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			if(this.userId===""){
				this.userId=options.userId;
			}else{
				this.getUserInfo(this.userId);
			}
		},
		data() {
			return {
				userId:"",
				personInfo:"",
				//是否是修改状态 默认为false不修改，点击修改则是true修改
				modifyFlag:false,
			}
		},
		methods: {
			getUserInfo(userId){
				console.log("去后台获取数据"+userId);
			},
			editInfo(userId){
				uni.navigateTo({
					url: './editPerson?userId='+userId
				})
			}
		}
	}
</script>

<style>

</style>
