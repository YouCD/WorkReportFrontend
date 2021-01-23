<template>
    <div id="Type2Count" :style="type2Style"></div>
</template>

<script>
    import {getType1Count, getType2Count} from "@/components/api/count";

    export default {
        name: "type2",
        data() {
            return {
                type1List: [],

                countList: [],
                type1_List: [],
                type2List: [],
                form: {type1: 8},


                type1Style: "",
                type2Style: "",
            }
        },
        methods:{
            Type2CountEcharts() {
                let params = {
                    id: this.form.type1
                }
                getType2Count(params).then(res => {
                    if (res.data.flag) {
                        this.type2List = res.data.data.type2_list
                        this.countList = res.data.data.count_list
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = this.$echarts.init(document.getElementById('Type2Count'));
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
                                text: '工作子类统计'
                            },
                            tooltip: {},
                            legend: {
                                data: ['工作子类']
                            },
                            xAxis: {
                                data: this.type2List,
                                axisLabel: {
                                    interval: 0,
                                    rotate: 40
                                }
                            },
                            yAxis: {},
                            series: [{
                                name: '工作子类',
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
        }
    }
</script>

<style scoped>

</style>