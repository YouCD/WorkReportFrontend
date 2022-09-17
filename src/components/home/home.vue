<template>
  <div>
    <div id="Type1Count" :style="type1Style"></div>
    <div id="Type2Count" :style="type2Style"></div>
    <div id="Type1CountPie" :style="Type1CountPieStyle"></div>
  </div>

</template>
<script>
import {getType1Count, getType2Count} from "@/components/api/count";
import {getWorkType1} from "@/components/api/worklog";
import {Column,Pie} from '@antv/g2plot';


export default {
  data() {
    return {
      type1_List: [],
      countType1Data: [],
      countType2Data: [],
      type1Style: {},
      type2Style: {},
      Type1CountPieStyle: {},
      ColumnCountType2: undefined,
      defaultType1: 1,
    }
  },
  created() {

    this.styleHandler()
  },
  methods: {
    Type1CountEcharts() {
      getType1Count().then(res => {
        if (res.data.flag) {
          this.countType1Data = res.data.data.countType1Data
          const plot = new Column('Type1Count', {
            data: this.countType1Data,
            xField: 'type1',
            yField: 'count',
            seriesField: 'type1',
            legend: {
              position: 'right',
            },
            columnStyle: {
              radius: [50, 50, 0, 0],
            },
          });
          plot.render();
          plot.on('tooltip:show', (data) => {
            this.type1_List.forEach(item => {
              if (item.description === data.data.title) {
                this.WorkLogType1Change(item.id)
              }
            })
          });
        }
      })
    },
    Type1CountPieEcharts() {
      getType1Count().then(res => {
        if (res.data.flag) {
          const piePlot = new Pie('Type1CountPie', {
            appendPadding: 10,
            data: this.countType1Data,
            angleField: 'count',
            colorField: 'type1',
            radius: 1,
            innerRadius: 0.6,
            label: {
              type: 'inner',
              offset: '-50%',

              content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
              style: {
                textAlign: 'center',
                fontSize: 14,
              },
            },
            interactions: [{ type: 'element-active' }],
            statistic: {
              title: false,
              content: {
                style: {
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                content: '工作占比',
              },
            },
          });

          piePlot.render();
        }
      })
    },

    WorkLogType1Change(value) {
      getType2Count(value).then(res => {
        if (res.data.flag) {
          this.countType2Data = res.data.data.countType2Data
          this.ColumnCountType2.changeData(this.countType2Data);
        }
      })
    },
    Type2CountEcharts() {
      getType2Count(this.defaultType1).then(res => {
        if (res.data.flag) {
          this.countType2Data = res.data.data.countType2Data
          this.ColumnCountType2 = new Column('Type2Count', {
            data: this.countType2Data,
            xField: 'type2',
            yField: 'count',
            seriesField: 'type2',
            legend: {
              position: 'right',
            },
            columnStyle: {
              radius: [20, 20, 0, 0],
            },
          });
          this.ColumnCountType2.render();
        }
      })
    },


    getWorkType1Handler() {
      getWorkType1().then(res => {
        if (res.data.flag) {
          this.type1_List = res.data.data.type_list
        }
      })
    },


    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },

    styleHandler() {
      if (this.isMobile()) {
        this.type1Style = "width: 100%;height:400px;padding: 10px"
        this.type2Style = "width: 100%;height:400px;padding: 10px"
        this.Type1CountPieStyle = "width: 100%;height:400px;padding: 10px"
      } else if (!this.isMobile()) {
        this.type1Style = "width: 50%;height:50%;float: left;padding: 10px"
        this.type2Style = "width: 50%;height:50%;float: right;padding: 10px"
        this.Type1CountPieStyle = "width: 50%;height:50%;float: left;padding: 10px"
      }
    }
  },
  mounted() {
    this.getWorkType1Handler()
    this.Type1CountEcharts();
    this.Type2CountEcharts();
    this.Type1CountPieEcharts();
  },
  watch: {
  },
};
</script>
<style>
.chartStyle {
  background: #f0f2f5;
}

</style>