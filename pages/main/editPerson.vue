<template>
	<view>
		<view>
			<view><text>姓名</text><input>{{personInfo.userName}}</input></view>
			<view><text>状态</text><input>{{personInfo.type}}</input></view>
			<view><text>性别</text><input>{{personInfo.sex}}</input></view>
			<view><text>手机号码</text><input>{{personInfo.phoneNumber}}</input></view>
			<view><text>证件号码</text><input>{{personInfo.idCard}}</input></view>
			<view><text>现可能地址</text><input>{{personInfo.position}}</input></view>
			<view><text>确诊上报单位</text><input>{{personInfo.department}}</input></view>
			<view><text>现可能地址坐标</text><input>{{personInfo.location}}</input></view>
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
				
			}
		},
		methods: {
			getUserInfo(userId){
				console.log("去后台获取数据"+userId);
			},
		}
	}
</script>

<style>

</style>
