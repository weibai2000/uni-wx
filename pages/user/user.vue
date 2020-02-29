<template>
	<view class="hello">
		<view class="mainTop">
			<img src="../../static/img/listTop.png"></img>
			<view class="name">统计分析</view>
			<view class="title">
				<view class="username">您好 {{loginName}}</view>
				<view class="count">累计完成的排查数：<text>{{statisticTotal}}</text>人</view>
			</view>
		</view>
		
		<view class="chartContainer">
			<uni-ec-canvas class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="ec"></uni-ec-canvas>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniEcCanvas from '../../static/common/uni-ec-canvas/uni-ec-canvas.vue'
	export default {
		computed: mapState(['userId']),
		onLoad(){
			this.getStatistic();
		},
		data() {
			return {
				loginName:'',
				statisticTotal:'',
				ec:{
					option: {
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					        }
					    },
					    legend: {
					        data: ['已完成数', '未完成数'],
							bottom: 0,
							itemWidth: 14,
							itemHeight: 14
					    },
						title: {
							top: '20px',
							left: 'center',
							text: '近7天排查情况',
						},
						color: ['#1C70C9', '#05377D'],
					    grid: {
					        left: '3%',
					        right: '4%',
					        bottom: '10%',
					        containLabel: true
					    },
					    yAxis: {
					        type: 'value'
					    },
					    xAxis: {
					        type: 'category',
					        data: this.Xdata
					    },
					    series: [
					        {
					            name: '未完成数',
					            type: 'bar',
					            stack: '总量',
								barWidth: '40%',
					            label: {
					                show: true,
					                position: 'insideRight'
					            },
					            data: [0, 0, 0, 0, 0, 0, 0]
					        },
					        {
					            name: '已完成数',
					            type: 'bar',
					            stack: '总量',
								barWidth: '20%',
					            label: {
					                show: true,
					                position: 'insideRight'
					            },
					            data: [0, 0, 0, 0, 0, 0, 0]
					        }
					    ]
					}
				}
			}
		},
		components: {
			uniEcCanvas
		},
		methods: {
			getStatistic(){
				let that = this;
				that.sendRequest({
				    url : "task/getStatistic",
				    data : {userId: that.userId},
				    hideLoading : true,
				    success:function (res) {
						that.loginName = res.data.loginName;
						that.statisticTotal = res.data.statisticTotal;
						var xArr1 = res.data.weekCount.map(item => { // 已完成数组
							return item[0]
						})
						var xArr2 = res.data.weekCount.map(item => { // 未完成数组
							return item[1]
						})
						var getData = { // 用于覆盖原有的options中的数据
								series: [
								{
									name: '未完成数',
									type: 'bar',
									stack: '总量',
									barWidth: '40%',
									label: {
										show: true,
										position: 'insideRight'
									},
									data: xArr1
								},
								{
									name: '已完成数',
									type: 'bar',
									stack: '总量',
									barWidth: '20%',
									label: {
										show: true,
										position: 'insideRight'
									},
									data: xArr2
								}
							],
							xAxis: {
								type: 'category',
								data: that.getDateList()
							}
						}
						var option = Object.assign({}, that.ec.option, getData);
						that.ec = {option};
					}
				})
			},
			getDateList(){
				var date = this.getFormatDate();
				var base = new Date(date).getTime();
				var oneDay = 24 * 3600 * 1000;
				var date = [];
				var data = [Math.random() * 300];
				var time = new Date(base);
				date.push([time.getMonth() + 1, time.getDate()].join('-'));
				for (var i = 1; i <7; i++) {
					var now = new Date(base -= oneDay);
					date.push([now.getMonth() + 1, now.getDate()].join('-'));
					data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
				}
				var newdate = date.reverse();
				return newdate;
			},
			getFormatDate() {
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
				return year + seperator1 + month + seperator1 + strDate;
			}
		}
	}
</script>

<style>
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
	
	.chartContainer {
		width:100%;
	}
	.uni-ec-canvas{
	    width:100%;
	    height:600rpx;
	    display:block;
	}
</style>
