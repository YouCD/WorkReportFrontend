<template>
    <div>
        <div class="Echarts">
            <div id="Type1Count" :style="type1Style"></div>
            <div>
                <a-select size="small" style="width: 100px" placeholder="请选择工作子类" v-model="type1ID"
                          @change="WorkLogType1Change">
                    <a-select-option v-for="(item,index) in type1_List" :value="item.id" :key="index">
                        {{ item.description }}
                    </a-select-option>
                </a-select>
                <div id="Type2Count" :style="type2Style"></div>
                <!--                <type2></type2>-->
            </div>
        </div>
    </div>

</template>
<script>
    import {getType1Count, getType2Count} from "@/components/api/count";
    import {getWorkType1} from "@/components/api/worklog";
    // import Type2 from "./type2"

    let Echarts = require('echarts/lib/echarts'); //基础实例 注意不要使用import
    require('echarts/lib/chart/bar'); //按需引入 bar = 柱状图
    export default {
        components: {
            // "type2": Type2,
        },
        data() {
            return {
                type1List: [],

                countList: [],
                type1_List: [],

                type2List: [],
                type2CountList: [],


                type1ID: undefined,


                type1Style: "",
                type2Style: "",

                option2: undefined,
                Type2Chart: "",
            }
        },
        created() {
            this.getWorkType1Handler()
            this.styleHandler()

            this.getOption2Handler(this.type2List, this.type2CountList)
        },
        methods: {
            Type1CountEcharts() {
                getType1Count().then(res => {
                    if (res.data.flag) {
                        this.type1List = res.data.data.type1_list
                        this.countList = res.data.data.count_list
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = this.$echarts.init(document.getElementById('Type1Count'));
                        // 指定图表的配置项和数据
                        var option = {
                            toolbox: {
                                show: true,
                                feature: {
                                    restore: {},
                                    saveAsImage: {},
                                }
                            },
                            title: {
                                text: '工作大类统计'
                            },
                            tooltip: {},
                            legend: {
                                data: ['工作大类']
                            },
                            xAxis: {
                                data: this.type1List
                            },
                            yAxis: {},
                            series: [{
                                name: '工作大类',
                                type: 'bar',
                                data: this.countList,
                                label: {
                                    show: true,
                                    position: "top"
                                },
                                itemStyle: {
                                    normal: {
                                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                        color: function (params) {
                                            var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(124,175,116)', 'rgb(144,105,149)', 'rgb(161,155,202)', 'rgb(232,214,215)', 'rgb(63,171,194)', 'rgb(209,203,178)', 'rgb(191,233,165)', 'rgb(221,214,245)', 'rgb(155,237,226)', 'rgb(252,235,208)', 'rgb(207,229,208)', 'rgb(217,64,174)', 'rgb(193,208,143)', 'rgb(147,236,197)', 'rgb(147,236,197)', 'rgb(161,166,203)', 'rgb(120,246,125)', 'rgb(120,246,125)', 'rgb(168,77,242)'];
                                            return colorList[params.dataIndex];
                                        }
                                    },
                                }
                            }]
                        };
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }
                })
            },
            Type2CountEcharts() {
                // 基于准备好的dom，初始化echarts实例
                this.Type2Chart = this.$echarts.init(document.getElementById('Type2Count'));


                // 使用刚指定的配置项和数据显示图表。
                this.Type2Chart.setOption(this.option2);
            },


            getOption2Handler(type2List, type2CountList) {
                // 指定图表的配置项和数据
                this.option2 = {
                    toolbox: {
                        show: true,
                        feature: {
                            restore: {},
                            saveAsImage: {},
                        }
                    },
                    title: {
                        text: '工作子类统计'
                    },
                    tooltip: {},
                    legend: {
                        data: ['工作子类']
                    },
                    xAxis: {
                        data: type2List,
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        }
                    },
                    yAxis: {},
                    series: [{
                        name: '工作子类',
                        type: 'bar',
                        data: type2CountList,
                        label: {
                            show: true,
                            position: "top"
                        },
                        itemStyle: {
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color: function (params) {
                                    var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(124,175,116)', 'rgb(144,105,149)', 'rgb(161,155,202)', 'rgb(232,214,215)', 'rgb(63,171,194)', 'rgb(209,203,178)', 'rgb(191,233,165)', 'rgb(221,214,245)', 'rgb(155,237,226)', 'rgb(252,235,208)', 'rgb(207,229,208)', 'rgb(217,64,174)', 'rgb(193,208,143)', 'rgb(147,236,197)', 'rgb(147,236,197)', 'rgb(161,166,203)', 'rgb(120,246,125)', 'rgb(120,246,125)', 'rgb(168,77,242)'];
                                    return colorList[params.dataIndex];
                                }
                            },
                        }
                    }]
                };
            },


            getWorkType1Handler() {
                getWorkType1().then(res => {
                    if (res.data.flag) {
                        this.type1_List = res.data.data.type_list
                    }
                })
            },
            WorkLogType1Change() {
                getType2Count(this.type1ID).then(res => {
                    if (res.data.flag) {
                        this.getOption2Handler(res.data.data.type2_list, res.data.data.count_list)
                    }
                })
            },
            isMobile() {
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                return flag;
            },

            styleHandler() {
                if (this.isMobile()) {
                    this.type1Style = "width: 100%;height:400px;"
                    this.type2Style = "width: 100%;height:400px;"
                } else if (!this.isMobile()) {
                    this.type1Style = "width: 600px;height:400px;float: left"
                    this.type2Style = "width: 900px;height:400px;float: left"
                }
            }
        },
        mounted() {
            this.Type1CountEcharts();
            this.Type2CountEcharts();
        },
        watch: {
            //观察option的变化
            option2: {
                handler(newVal, oldVal) {
                    if (this.Type2Chart) {
                        if (newVal) {
                            this.Type2Chart.setOption(newVal);
                        } else {
                            this.Type2Chart.setOption(oldVal);
                        }
                    } else {
                        this.Type2CountEcharts();
                    }
                },
                deep: true //对象内部属性的监听，关键。
            }
        },
    };
</script>