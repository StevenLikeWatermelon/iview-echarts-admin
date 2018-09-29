<template>
        <FormItem style="margin-bottom:0;float:left;">
            <div class="condition-choice">
                <span v-for="(item, index) in dateRangeTabs" :class="{on: index == currentTab}" @click="tab(index)">{{item}}</span>
            </div>
            <DatePicker :value="dateRangevalue" :clearable="false" format="yyyy-MM-dd" type="daterange" placement="bottom" placeholder="选择日期区间" style="width: 180px;margin-left:20px;" @on-change="changeValue"></DatePicker>
            <Button type="primary" class="condition-searchBtn" @click="searchDateRange">搜索</Button>
        </FormItem>
</template>
<script type="text/ecmascript-6">
    import { apiDateChange } from '@/config/getData';
    import { getSpecialDateRange } from '@/config/mUtils';
    export default {
        name: 'common-search',
        data () {
            return {
                dateRangeTabs: ['本周','本月','26号往后'],
                dateRangevalue: [],
                currentTab: this.$store.state.currentTab,
                errorMsg: ''
            };
        },
        props:['dateRangeType'],
        beforeMount () {
            if (this.$store.state.hasShared) {
                //首次共享开启默认
                if (this.$store.state.sharedDateRange && this.$store.state.sharedDateRange.length <= 0) {
                    this.getDateRange(this.currentTab);
                }
                this.dateRangevalue = JSON.parse(JSON.stringify(this.$store.state.sharedDateRange));
                this.$emit('getDateRangeData', this.dateRangevalue)
            } else {
                //默认选最近30天
                this.getDateRange(this.currentTab);
            }
        },
        methods: {
            tab (index) {
                this.currentTab = index;
                this.$store.commit('changeCurrentTab', index);
                this.getDateRange(index);
            },
            getDateRange (rangeType) {
                let weekOneTimestamp, yyyy, mm, dd, todayNum, currentTimestamp, monthOneTimestamp, recentOneMonthTimestamp;
                switch(rangeType) {
                    //本周时间段
                    case 0:
                        todayNum = new Date().getDay();
                        currentTimestamp = new Date().getTime();
                        if (todayNum) {
                            weekOneTimestamp = currentTimestamp - (todayNum - 1)*24*60*60*1000;
                        } else {
                            weekOneTimestamp = currentTimestamp - 6*24*60*60*1000;
                        }
                        this.dateRangevalue.splice(0, 1, apiDateChange(weekOneTimestamp, true));
                        this.dateRangevalue.splice(1, 1, apiDateChange(currentTimestamp, true));
                        this.$store.commit('commitWeek', this.dateRangevalue);
                        break;
                    // 本月时间段
                    case 1:
                        todayNum =  new Date().getDate();
                        currentTimestamp = new Date().getTime();
                        monthOneTimestamp = currentTimestamp - (todayNum - 1)*24*60*60*1000;
                        this.dateRangevalue.splice(0, 1, apiDateChange(monthOneTimestamp, true));
                        this.dateRangevalue.splice(1, 1, apiDateChange(currentTimestamp, true));
                        this.$store.commit('commitMonth', this.dateRangevalue);
                        break;
                    // 最近30天
                    case 2:
                        currentTimestamp = new Date().getTime();
                        recentOneMonthTimestamp = currentTimestamp - 29*24*60*60*1000;
                        this.dateRangevalue = getSpecialDateRange();
                        this.$store.commit('commitThirty', this.dateRangevalue);
                        break;
                }
                this.$emit('getDateRangeData', this.dateRangevalue)
                this.$store.commit('broadcastSharedDateRange', this.dateRangevalue);
            },
            searchDateRange () {
                this.$emit('getDateRangeData', this.dateRangevalue)
                this.$store.commit('broadcastSharedDateRange', this.dateRangevalue);
            },
            changeValue (value) {
                this.dateRangevalue = value;
            }
        },
        watch: {
            dateRangevalue (value, oldValue) {
                let differDay;
                // 判断是否为周月最近30天
               let judgeEqual = (judgeItem) => {
                    if (value[0] == judgeItem[0] && value[1] == judgeItem[1]) {
                        return true;
                    } else {
                        return false;
                    }
                }
                //判断是否超出时间范围
                let judgeDateRange = (daterange) => {
                    let startTime = new Date(daterange[0]).getTime();
                    let endTime = new Date(daterange[1]).getTime();
                    differDay = (endTime - startTime)/1000/60/60/24;
                    if (this.dateRangeType) {
                        return differDay > 31;
                    } else {
                        return differDay > 90;
                    }
                }

                if (judgeDateRange(value)) {
                    this.errorMsg = '时间范围不能大于' + (this.dateRangeType ? '31' : '90') +'天,当前' + differDay + '天';
                    this.$Message.error(this.errorMsg);
                    setTimeout(()=> {
                        this.dateRangevalue = oldValue;
                    },100);
                    return;
                }

                if (!judgeEqual(this.$store.state.watchWeekArr) && !judgeEqual(this.$store.state.watchMonthArr) && !judgeEqual(this.$store.state.watchThirtyArr)) {
                    this.currentTab = 4;
                    this.$store.commit('changeCurrentTab', 4);
                }
                
            }
        }
    };
</script>