<template>
	<view class="datetime-range-picker">
		<!-- 开始日期时间选择 -->
		<view class="datetime-picker-item" @click="showStartPicker">
			<text v-if="!startTime" class="placeholder">{{ startPlaceholder }}</text>
			<text v-else class="datetime-text">{{ formatDateTime(startTime) }}</text>
		</view>

		<text class="separator">至</text>

		<!-- 结束日期时间选择 -->
		<view class="datetime-picker-item" @click="showEndPicker">
			<text v-if="!endTime" class="placeholder">{{ endPlaceholder }}</text>
			<text v-else class="datetime-text">{{ formatDateTime(endTime) }}</text>
		</view>

		<!-- 开始时间选择器 -->
		<uni-datetime-picker ref="startTimeRef" v-if="showStart" type="datetime" :value="startTime" :start="minDate"
			:end="maxDate" @change="handleStartChange" @maskClick="showStart = false" />

		<!-- 结束时间选择器 -->
		<uni-datetime-picker v-if="showEnd" type="datetime" :value="endTime" :start="adjustedEndStart" :end="maxDate"
			@change="handleEndChange" @maskClick="showEnd = false" />
	</view>
</template>

<script>
	export default {
		name: 'DatetimeRangePicker',
		props: {
			// 初始开始时间
			startValue: {
				type: [String, Number],
				default: ''
			},
			// 初始结束时间
			endValue: {
				type: [String, Number],
				default: ''
			},
			// 开始时间占位符
			startPlaceholder: {
				type: String,
				default: '选择开始时间'
			},
			// 结束时间占位符
			endPlaceholder: {
				type: String,
				default: '选择结束时间'
			},
			// 最小可选日期
			minDate: {
				type: [String, Number],
				default: '1970-01-01'
			},
			// 最大可选日期
			maxDate: {
				type: [String, Number],
				default: '2100-12-31'
			},
			// 日期时间格式
			format: {
				type: String,
				default: 'YYYY-MM-DD HH:mm'
			}
		},
		data() {
			return {
				startTime: this.startValue,
				endTime: this.endValue,
				showStart: false,
				showEnd: false
			}
		},
		computed: {
			// 根据开始时间调整结束时间的最小可选值
			adjustedEndStart() {
				if (!this.startTime) return this.minDate
				return this.startTime
			}
		},
		watch: {
			startValue(newVal) {
				this.startTime = newVal
			},
			endValue(newVal) {
				this.endTime = newVal
			}
		},
		methods: {
			// 显示开始时间选择器
			showStartPicker() {

				this.showStart = true
				this.showEnd = false
				this.$nextTick(() => {
					this.$refs.startTimeRef.show()
					console.log(this.$refs.startTimeRef, 'startTimeRef')
					const input = this.$refs.startTimeRef.$el.querySelector('input')
					if (input) {
						input.click()
					}
				})
			},
			// 显示结束时间选择器
			showEndPicker() {
				if (!this.startTime) {
					uni.showToast({
						title: '请先选择开始时间',
						icon: 'none'
					})
					return
				}
				this.showEnd = true
				this.showStart = false
			},
			// 处理开始时间变化
			handleStartChange(e) {
				this.showStart = false
				this.startTime = e

				// 如果开始时间大于结束时间，清空结束时间
				if (this.endTime && new Date(this.startTime) > new Date(this.endTime)) {
					this.endTime = ''
					this.$emit('end-change', '')
				}

				this.$emit('start-change', this.startTime)
				this.$emit('change', {
					startTime: this.startTime,
					endTime: this.endTime
				})
			},
			// 处理结束时间变化
			handleEndChange(e) {
				this.showEnd = false
				this.endTime = e

				this.$emit('end-change', this.endTime)
				this.$emit('change', {
					startTime: this.startTime,
					endTime: this.endTime
				})
			},
			// 格式化日期时间显示
			formatDateTime(timestamp) {
				if (!timestamp) return ''
				const date = new Date(timestamp)
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')
				const hours = date.getHours().toString().padStart(2, '0')
				const minutes = date.getMinutes().toString().padStart(2, '0')

				return `${year}-${month}-${day} ${hours}:${minutes}`
			},
			// 获取当前选择的时间范围
			getTimeRange() {
				return {
					startTime: this.startTime,
					endTime: this.endTime
				}
			},
			// 重置选择
			reset() {
				this.startTime = ''
				this.endTime = ''
				this.$emit('start-change', '')
				this.$emit('end-change', '')
				this.$emit('change', {
					startTime: '',
					endTime: ''
				})
			}
		}
	}
</script>

<style scoped>
	.datetime-range-picker {
		display: flex;
		align-items: center;
		padding: 10px 0;
	}

	.datetime-picker-item {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		color: #333;
		font-size: 14px;
		min-width: 120px;
		text-align: center;
	}

	.placeholder {
		color: #999;
	}

	.datetime-text {
		color: #333;
	}

	.separator {
		margin: 0 10px;
		font-size: 14px;
		color: #666;
	}
</style>