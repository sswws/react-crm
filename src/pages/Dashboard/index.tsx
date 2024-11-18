import React from 'react';
import { Card, Row, Col, Statistic, Table, List, Typography } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ShoppingCartOutlined, 
  RiseOutlined,
  PhoneOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/charts';
import ReactECharts from 'echarts-for-react';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  // 模拟数据
  const recentDeals = [
    { key: '1', customer: '张三', amount: '¥50,000', status: '已成交', date: '2024-03-20' },
    { key: '2', customer: '李四', amount: '¥35,000', status: '谈判中', date: '2024-03-19' },
    { key: '3', customer: '王五', amount: '¥28,000', status: '已成交', date: '2024-03-18' },
  ];

  const upcomingTasks = [
    { title: '客户回访 - 阿里巴巴', time: '今天 14:30' },
    { title: '产品演示 - 腾讯', time: '明天 10:00' },
    { title: '合同签署 - 百度', time: '后天 15:00' },
    { title: '需求分析会议 - 字节跳动', time: '周五 09:30' },
  ];

  const recentContacts = [
    { name: '张经理', company: '阿里巴巴', time: '10分钟前' },
    { name: '李总', company: '腾讯', time: '30分钟前' },
    { name: '王总', company: '百度', time: '2小时前' },
    { name: '赵经理', company: '字节跳动', time: '3小时前' },
  ];

  const columns = [
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '日期', dataIndex: 'date', key: 'date' },
  ];

  // 销售趋势数据
  const salesTrendData = [
    { date: '2024-01', sales: 35000 },
    { date: '2024-02', sales: 42000 },
    { date: '2024-03', sales: 48000 },
    { date: '2024-04', sales: 52000 },
    { date: '2024-05', sales: 61000 },
    { date: '2024-06', sales: 55000 },
  ];

  // 销售漏斗数据
  const funnelData = [
    { stage: '线索', value: 5000 },
    { stage: '商机', value: 3500 },
    { stage: '报价', value: 2500 },
    { stage: '谈判', value: 1500 },
    { stage: '成交', value: 800 },
  ];

  // 中国地图数据
  const mapOption = {
    title: {
      text: '客户地理分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: 200,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true
    },
    series: [{
      name: '客户数量',
      type: 'map',
      map: 'china',
      label: {
        show: true
      },
      data: [
        { name: '北京', value: 189 },
        { name: '上海', value: 156 },
        { name: '广东', value: 145 },
        { name: '江苏', value: 123 },
        { name: '浙江', value: 98 },
        // 可以添加更多省份数据
      ]
    }]
  };

  // 销售趋势配置
  const areaConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    line: {
      color: '#1890ff',
    },
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '销售额 (¥)',
      },
    },
  };

  // 修改饼图配置
  const pieConfig = {
    data: funnelData,
    angleField: 'value',
    colorField: 'stage',
    radius: 0.8,
    label: {
      position: 'outside',
      content: (datum: any) => {
        const percent = ((datum.value / 5000) * 100).toFixed(1);
        return `${datum.stage}\n${percent}%`;
      },
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { 
          name: datum.stage, 
          value: `${datum.value} (${((datum.value / 5000) * 100).toFixed(1)}%)`
        };
      },
    },
    interactions: [
      { type: 'element-active' },
      { type: 'element-selected' },
    ],
  };

  return (
    <div>
      <Title level={4}>首页</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总客户数"
              value={2864}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月新增客户"
              value={156}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={234500}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1677ff' }}
              suffix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={25.8}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="销售趋势">
            <Area {...areaConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="销售阶段分布">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 地图 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="客户地理分布">
            <ReactECharts
              option={mapOption}
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 最近成交 */}
        <Col span={12}>
          <Card title="最近成交" style={{ marginBottom: 24 }}>
            <Table 
              columns={columns} 
              dataSource={recentDeals}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 待办任务 */}
        <Col span={12}>
          <Card title="待办任务" style={{ marginBottom: 24 }}>
            <List
              size="small"
              dataSource={upcomingTasks}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined />}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最近联系 */}
        <Col span={24}>
          <Card title="最近联系">
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={recentContacts}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small">
                    <List.Item.Meta
                      avatar={<PhoneOutlined />}
                      title={item.name}
                      description={
                        <>
                          <div>{item.company}</div>
                          <div style={{ color: '#999' }}>{item.time}</div>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 