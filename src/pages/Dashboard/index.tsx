import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  List, 
  Typography, 
  Calendar, 
  Badge, 
  Progress,
  Timeline,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Space,
  message,
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ShoppingCartOutlined, 
  RiseOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/charts';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 待办任务类型
interface TodoType {
  key: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'completed';
  type: string;
}

// 日程类型
interface ScheduleType {
  key: string;
  title: string;
  date: string;
  time: string;
  type: string;
  participants: string[];
  location: string;
  description: string;
}

// 工作提醒类型
interface ReminderType {
  key: string;
  title: string;
  type: string;
  time: string;
  status: 'unread' | 'read';
}

// 客户互动类型
interface InteractionType {
  key: string;
  customer: string;
  type: string;
  content: string;
  time: string;
  operator: string;
}

const Dashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'todo' | 'schedule'>('todo');
  const [form] = Form.useForm();

  // 待办任务数据
  const [todos] = useState<TodoType[]>([
    {
      key: '1',
      title: '联系重点客户跟进项目进度',
      priority: 'high',
      dueDate: '2024-03-25',
      status: 'pending',
      type: 'customer',
    },
    {
      key: '2',
      title: '准备季度销售报告',
      priority: 'medium',
      dueDate: '2024-03-28',
      status: 'pending',
      type: 'report',
    },
    {
      key: '3',
      title: '产品培训会议',
      priority: 'high',
      dueDate: '2024-03-26',
      status: 'pending',
      type: 'meeting',
    },
  ]);

  // 日程数据
  const [schedules] = useState<ScheduleType[]>([
    {
      key: '1',
      title: '客户需求讨论会',
      date: '2024-03-25',
      time: '14:30',
      type: 'meeting',
      participants: ['张三', '李四', '王五'],
      location: '会议室A',
      description: '讨论新客户的需求细节',
    },
    {
      key: '2',
      title: '产品演示',
      date: '2024-03-26',
      time: '10:00',
      type: 'presentation',
      participants: ['张三', '客户A'],
      location: '演示厅',
      description: '新产品功能演示',
    },
  ]);

  // 工作提醒数据
  const [reminders] = useState<ReminderType[]>([
    {
      key: '1',
      title: '合同即将到期提醒',
      type: 'contract',
      time: '2024-03-25',
      status: 'unread',
    },
    {
      key: '2',
      title: '客户回访提醒',
      type: 'followup',
      time: '2024-03-26',
      status: 'unread',
    },
  ]);

  // 客户互动数据
  const [interactions] = useState<InteractionType[]>([
    {
      key: '1',
      customer: '阿里巴巴',
      type: 'meeting',
      content: '进行了产品演示，客户反馈良好',
      time: '2024-03-20 14:30',
      operator: '张三',
    },
    {
      key: '2',
      customer: '腾讯',
      type: 'call',
      content: '电话沟通项目进展',
      time: '2024-03-20 11:00',
      operator: '李四',
    },
  ]);

  // 业绩目标数据
  const performanceGoals = [
    {
      title: '销售目标',
      target: 1000000,
      current: 750000,
      unit: '元',
    },
    {
      title: '新客户开发',
      target: 100,
      current: 65,
      unit: '个',
    },
    {
      title: '合同签订',
      target: 50,
      current: 30,
      unit: '份',
    },
  ];

  // 处理添加待办/日程
  const handleAdd = (type: 'todo' | 'schedule') => {
    setModalType(type);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('提交数据:', values);
      message.success('添加成功');
      setIsModalVisible(false);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 修改日历单元格渲染函数
  const dateCellRender = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const todaySchedules = schedules.filter(s => s.date === dateStr);
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todaySchedules.map(schedule => (
          <li key={schedule.key}>
            <Badge 
              status={schedule.type === 'meeting' ? 'warning' : 'success'} 
              text={schedule.title}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Title level={4}>工作台</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待办任务"
              value={todos.filter(t => t.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日日程"
              value={schedules.filter(s => s.date === new Date().toISOString().split('T')[0]).length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未读提醒"
              value={reminders.filter(r => r.status === 'unread').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户互动"
              value={interactions.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 待办任务 */}
        <Col span={8}>
          <Card 
            title="待办任务" 
            extra={
              <Button 
                type="link" 
                icon={<PlusOutlined />}
                onClick={() => handleAdd('todo')}
              >
                添加待办
              </Button>
            }
          >
            <List
              dataSource={todos}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<CheckCircleOutlined />}
                      onClick={() => message.success('标记完成')}
                    >
                      完成
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.title}</Text>
                        <Tag color={
                          item.priority === 'high' ? 'red' : 
                          item.priority === 'medium' ? 'orange' : 
                          'blue'
                        }>
                          {item.priority === 'high' ? '高' : 
                           item.priority === 'medium' ? '中' : '低'}
                        </Tag>
                      </Space>
                    }
                    description={`截止日期: ${item.dueDate}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 日程安排 */}
        <Col span={16}>
          <Card 
            title="日程安排"
            extra={
              <Button 
                type="link" 
                icon={<PlusOutlined />}
                onClick={() => handleAdd('schedule')}
              >
                添加日程
              </Button>
            }
          >
            <Calendar 
              dateCellRender={dateCellRender}
              mode="month"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* 业绩目标 */}
        <Col span={12}>
          <Card title="业绩目标">
            <List
              dataSource={performanceGoals}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Progress 
                          percent={Math.round((item.current / item.target) * 100)}
                          status={
                            (item.current / item.target) >= 1 ? 'success' :
                            (item.current / item.target) >= 0.8 ? 'active' :
                            'exception'
                          }
                        />
                        <Space>
                          <Text type="secondary">目标: {item.target}{item.unit}</Text>
                          <Text type="secondary">当前: {item.current}{item.unit}</Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 客户互动时间线 */}
        <Col span={12}>
          <Card title="客户互动">
            <Timeline
              items={interactions.map(item => ({
                color: item.type === 'meeting' ? 'blue' : 'green',
                children: (
                  <div>
                    <Space>
                      <Text strong>{item.customer}</Text>
                      <Tag color={item.type === 'meeting' ? 'blue' : 'green'}>
                        {item.type === 'meeting' ? '会议' : '电话'}
                      </Tag>
                    </Space>
                    <div>{item.content}</div>
                    <div>
                      <Text type="secondary">{item.operator} · {item.time}</Text>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加待办/日程模态框 */}
      <Modal
        title={modalType === 'todo' ? '添加待办' : '添加日程'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          
          {modalType === 'todo' ? (
            <>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select>
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="dueDate"
                label="截止日期"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="time"
                label="时间"
                rules={[{ required: true, message: '请选择时间' }]}
              >
                <TimePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="participants"
                label="参与人"
                rules={[{ required: true, message: '请选择参与人' }]}
              >
                <Select mode="multiple">
                  <Option value="张三">张三</Option>
                  <Option value="李四">李四</Option>
                  <Option value="王五">王五</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="location"
                label="地点"
              >
                <Input />
              </Form.Item>
            </>
          )}
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard; 