<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
// 引入lodash
import _ from 'lodash'
export default {
  data() {
    return {
      // 指定图表的配置项和数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  // mounted钩子函数,当页面渲染完毕然后初始化一个echarts实例
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const result = await this.axios.get('reports/type/1')
    //合并折线图和获取到的数据
    const res = _.merge(result.data.data, this.options)

    myChart.setOption(res)
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
</style>