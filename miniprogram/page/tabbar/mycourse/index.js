// miniprogram/pages/mycourse/mycourse.js
import * as echarts from '../../../components/ec-canvas/echarts';
const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {
    color: ["#6b74f7"],
    legend: {
      data: ['A'],
      // top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      // containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      offset: 10,
      data: ['4.18', '4.19', '4.20', '4.21', '4.22', '4.23', '今天'],
      axisLabel: {
        show: true,
        textStyle: {
          color: 'black', //更改坐标轴文字颜色
          fontSize: 16 //更改坐标轴文字大小
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        show: true
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      // smooth: true,
      data: [0, 36, 65, 30, 78, 40, 33],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: { //数值样式
              color: 'black',
              fontSize: 14
            }
          }
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}
Component({
  data: {
    ec: {
      onInit: initChart
    },
    navHeight: app.globalData.navHeight,
    navTop: app.globalData.navTop,
    searchHeight: app.globalData.searchHeight,
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  }
})