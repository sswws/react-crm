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
  Space,
  List,
  Tag,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { BadgeProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface ScheduleType {
  key: string;
  title: string;
  type: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  participants: string[];
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'cancelled';
  reminder: number;
  createdBy: string;
  createdAt: string;
}

const Schedule: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 模拟数据
  const [schedules, setSchedules] = useState<ScheduleType[]>([
    {
      key: '1',
      title: '产品评审会议',
      type: 'meeting',
      date: '2024-03-25',
      time: '14:30',
      endTime: '16:30',
      location: '会议室A',
      participants: ['张三', '李四', '王五'],
      description: '讨论新产品功能规划',
      priority: 'high',
      status: 'pending',
      reminder: 30,
      createdBy: '张三',
      createdAt: '2024-03-20',
    },
    {
      key: '2',
      title: '客户拜访',
      type: 'visit',
      date: '2024-03-26',
      time: '10:00',
      endTime: '12:00',
      location: '客户公司',
      participants: ['张三', '客户A'],
      description: '产品演示和需求讨论',
      priority: 'medium',
      status: 'pending',
      reminder: 60,
      createdBy: '张三',
      createdAt: '2024-03-20',
    },
  ]);

  const typeOptions = [
    { label: '会议', value: 'meeting', color: 'blue' },
    { label: '拜访', value: 'visit', color: 'green' },
    { label: '培训', value: 'training', color: 'orange' },
    { label: '其他', value: 'other', color: 'default' },
  ];

  const priorityOptions = [
    { label: '高', value: 'high', color: 'red' },
    { label: '中', value: 'medium', color: 'orange' },
    { label: '低', value: 'low', color: 'blue' },
  ];

  const reminderOptions = [
    { label: '不提醒', value: 0 },
    { label: '15分钟前', value: 15 },
    { label: '30分钟前', value: 30 },
    { label: '1小时前', value: 60 },
    { label: '2小时前', value: 120 },
    { label: '1天前', value: 1440 },
  ];

  // 日历单元格渲染
  const dateCellRender = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const daySchedules = schedules.filter(s => s.date === dateStr);

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {daySchedules.map(schedule => (
          <li key={schedule.key}>
            <Badge
              status={getBadgeStatus(schedule)}
              text={
                <Text
                  ellipsis
                  style={{ width: '100%' }}
                  onClick={() => handleEdit(schedule)}
                >
                  {schedule.time.substring(0, 5)} {schedule.title}
                </Text>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 获取徽标状态
  const getBadgeStatus = (schedule: ScheduleType): BadgeProps['status'] => {
    if (schedule.status === 'completed') return 'success';
    if (schedule.status === 'cancelled') return 'default';
    if (schedule.priority === 'high') return 'error';
    if (schedule.priority === 'medium') return 'warning';
    return 'processing';
  };

  // 处理日期选择
  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
    form.setFieldsValue({
      date: date,
      time: null,
      endTime: null,
    });
    setEditingKey('');
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: ScheduleType) => {
    form.setFieldsValue({
      ...record,
      date: record.date,
      time: record.time,
      endTime: record.endTime,
    });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个日程吗？',
      onOk() {
        setSchedules(schedules.filter(item => item.key !== key));
        message.success('删除成功');
      },
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
      };

      if (editingKey) {
        setSchedules(
          schedules.map(item =>
            item.key === editingKey ? { ...item, ...formData } : item
          )
        );
        message.success('更新成功');
      } else {
        const newSchedule = {
          key: Date.now().toString(),
          ...formData,
          status: 'pending',
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setSchedules([...schedules, newSchedule]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={18}>
        <Card
          title={
            <Space>
              <CalendarOutlined />
              日程管理
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setEditingKey('');
                setIsModalVisible(true);
              }}
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
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              今日日程
            </Space>
          }
          size="small"
        >
          <List
            dataSource={schedules.filter(s => s.date === new Date().toISOString().split('T')[0])}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Tag color={typeOptions.find(t => t.value === item.type)?.color}>
                        {typeOptions.find(t => t.value === item.type)?.label}
                      </Tag>
                      <Text>{item.title}</Text>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">{item.time} - {item.endTime}</Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text type="secondary">{item.location}</Text>
                      </Space>
                      <Space>
                        <TeamOutlined />
                        <Text type="secondary">{item.participants.join(', ')}</Text>
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Modal
        title={editingKey ? '编辑日程' : '新增日程'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'meeting',
            priority: 'medium',
            reminder: 30,
          }}
        >
          <Form.Item
            name="title"
            label="日程标题"
            rules={[{ required: true, message: '请输入日程标题' }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="日程类型"
                rules={[{ required: true, message: '请选择日程类型' }]}
              >
                <Select>
                  {typeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select>
                  {priorityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reminder"
                label="提醒"
                rules={[{ required: true, message: '请选择提醒时间' }]}
              >
                <Select>
                  {reminderOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="time"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
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
            rules={[{ required: true, message: '请选择参与人' }]}
          >
            <Select mode="multiple">
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
              <Option value="客户A">客户A</Option>
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

export default Schedule; 