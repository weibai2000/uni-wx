<template>
	<view class="content">
		<view v-if="hasLogin" class="hello">
			<view class="title">
				<view>您好 {{userName}}</view>
				<view>当前日期：{{systemDate}}</view>
				<view>今日需监控人数：{{monitorNum}}人</view>
			</view>
			<list>
			    <cell v-for="(monitor,index) in myMonitorList" :key="monitor.userId" @tap="getInfo(monitor.userId)">
					<view><text>{{monitor.userName}}</text><text>----{{monitor.phoneNumber}}----</text><text>----{{monitor.status}}</text></view>
					<view><text>{{monitor.address}}</text></view>
					<view><text>{{monitor.type}}</text></view>
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
		
		},
		mounted() {
			this.getNowFormatDate();
			//this.queryMonitorList(userId);
		},
		data(){
			return{
				userName:'吴彦祖',
				systemDate:'',
				monitorNum:'5',
				myMonitorList:[
					{userId:"1",userName:'张三',phoneNumber:'18888888888',status:'未上报',address:'武汉',type:'发热'},
					{userId:"2",userName:'李四',phoneNumber:'13555555555',status:'已上报',address:'南京',type:'疑似'},
					{userId:"3",userName:'王五',phoneNumber:'13666666666',status:'已上报',address:'西安',type:'密切接触者'}
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
			},
			getInfo(userId){
				uni.navigateTo({
					url: './personInfo?userId='+userId
				})
			},
            queryMonitorList(userId){
                uni.request({
                    url: 'http://10./task/getTaskList', 
                    data: {
                        userId: userId
                    },
                    success: (res) => {
                        console.log(res.data);
                        this.text = 'request success';
                    }
                });
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

	.ul {
		font-size: 15px;
		color: #8f8f94;
	}

	.ul>view {
		line-height: 25px;
	}
</style>
