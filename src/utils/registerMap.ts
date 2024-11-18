import * as echarts from 'echarts';

// 注意：这里需要引入中国地图数据
// 你可以从 https://github.com/apache/echarts/tree/master/map 获取
export const registerMap = () => {
  fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    .then(response => response.json())
    .then(chinaJson => {
      echarts.registerMap('china', chinaJson);
    });
}; 