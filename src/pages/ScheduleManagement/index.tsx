import React, { useState } from 'react';
import {
  Card,
  Calendar,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
  Row,
  Col,
  List,
  Tag,
  Space,
  Typography,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { BadgeProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ScheduleType {
  key: string;
  title: string;
  type: 'personal' | 'team' | 'meeting' | 'visit';
  startTime: string;
  endTime: string;
  participants: string[];
  location: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

const ScheduleManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockSchedules: ScheduleType[] = [
    {
      key: '1',
      title: '产品评审会议',
      type: 'meeting',
      startTime: '2024-03-25 10:00',
      endTime: '2024-03-25 12:00',
      participants: ['张三', '李四', '王五'],
      location: '会议室A',
      description: '讨论新产品功能规划',
      priority: 'high',
      status: 'pending',
      createdBy: '张三',
      createdAt: '2024-03-20',
    },
    {
      key: '2',
      title: '客户拜访',
      type: 'visit',
      startTime: '2024-03-26 14:00',
      endTime: '2024-03-26 16:00',
      participants: ['张三', '客户A'],
      location: '客户公司',
      description: '产品演示和需求讨论',
      priority: 'medium',
      status: 'pending',
      createdBy: '张三',
      createdAt: '2024-03-20',
    },
  ];

  const [schedules, setSchedules] = useState<ScheduleType[]>(mockSchedules);

  const scheduleTypes = [
    { label: '个人日程', value: 'personal', color: 'blue', icon: <UserOutlined /> },
    { label: '团队日程', value: 'team', color: 'green', icon: <TeamOutlined /> },
    { label: '会议安排', value: 'meeting', color: 'purple', icon: <VideoCameraOutlined /> },
    { label: '拜访计划', value: 'visit', color: 'orange', icon: <CarOutlined /> },
  ];

  const priorityOptions = [
    { label: '高', value: 'high', color: 'red' },
    { label: '中', value: 'medium', color: 'orange' },
    { label: '低', value: 'low', color: 'blue' },
  ];

  // 日历单元格渲染
  const dateCellRender = (date: Dayjs) => {
    const daySchedules = schedules.filter(
      schedule => date.format('YYYY-MM-DD') === schedule.startTime.split(' ')[0]
    );

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {daySchedules.map(schedule => (
          <li key={schedule.key}>
            <Badge
              status={schedule.priority === 'high' ? 'error' : 
                     schedule.priority === 'medium' ? 'warning' : 'processing'}
              text={
                <Text ellipsis style={{ width: '100%' }}>
                  {schedule.title}
                </Text>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 处理日期选择
  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
    form.setFieldsValue({
      startTime: date,
      endTime: date,
    });
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newSchedule = {
        key: Date.now().toString(),
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm'),
        status: 'pending',
        createdBy: '当前用户',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSchedules([...schedules, newSchedule]);
      setIsModalVisible(false);
      message.success('添加成功');
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={18}>
        <Card
          title="日程日历"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              新增日程
            </Button>
          }
        >
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={handleSelect}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title="今日日程">
          <List
            dataSource={schedules.filter(
              schedule => schedule.startTime.split(' ')[0] === new Date().toISOString().split('T')[0]
            )}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={scheduleTypes.find(t => t.value === item.type)?.icon} />
                  }
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      <Tag color={priorityOptions.find(p => p.value === item.priority)?.color}>
                        {priorityOptions.find(p => p.value === item.priority)?.label}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                          {item.startTime.split(' ')[1]} - {item.endTime.split(' ')[1]}
                        </Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text type="secondary">{item.location}</Text>
                      </Space>
                      {item.participants.length > 0 && (
                        <Space>
                          <TeamOutlined />
                          <Text type="secondary">
                            {item.participants.join(', ')}
                          </Text>
                        </Space>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Modal
        title="新增日程"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ priority: 'medium', type: 'personal' }}
        >
          <Form.Item
            name="title"
            label="日程标题"
            rules={[{ required: true, message: '请输入日程标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="日程类型"
            rules={[{ required: true, message: '请选择日程类型' }]}
          >
            <Select>
              {scheduleTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Space>
                    {type.icon}
                    {type.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="location"
            label="地点"
            rules={[{ required: true, message: '请输入地点' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="participants"
            label="参与人"
          >
            <Select mode="multiple" placeholder="请选择参与人">
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select>
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default ScheduleManagement; 