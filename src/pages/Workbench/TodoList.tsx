import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Checkbox,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface TodoType {
  key: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  type: 'task' | 'meeting' | 'follow' | 'other';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

const TodoList: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const [todos, setTodos] = useState<TodoType[]>([
    {
      key: '1',
      title: '联系重点客户跟进项目进度',
      description: '需要与客户确认项目具体需求和时间节点',
      priority: 'high',
      dueDate: '2024-03-25',
      status: 'pending',
      type: 'follow',
      assignee: '张三',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      title: '准备季度销售报告',
      description: '整理Q1销售数据，分析业绩达成情况',
      priority: 'medium',
      dueDate: '2024-03-28',
      status: 'pending',
      type: 'task',
      assignee: '张三',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
  ]);

  const priorityColors = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };

  const typeLabels = {
    task: '任务',
    meeting: '会议',
    follow: '跟进',
    other: '其他',
  };

  const moreActions: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
    },
  ];

  const handleMenuClick = (key: string, record: TodoType) => {
    switch (key) {
      case 'edit':
        handleEdit(record);
        break;
      case 'delete':
        handleDelete(record);
        break;
      default:
        break;
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  const handleEdit = (record: TodoType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: TodoType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个待办事项吗？',
      onOk() {
        setTodos(todos.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleComplete = (record: TodoType) => {
    setTodos(
      todos.map(item =>
        item.key === record.key
          ? { ...item, status: 'completed', updatedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    message.success('已完成');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        setTodos(
          todos.map(item =>
            item.key === editingKey
              ? {
                  ...item,
                  ...values,
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newTodo = {
          key: Date.now().toString(),
          ...values,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setTodos([...todos, newTodo]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card
      title="待办事项"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增待办
        </Button>
      }
    >
      <List
        dataSource={todos}
        renderItem={item => (
          <List.Item
            actions={[
              <Checkbox
                checked={item.status === 'completed'}
                onChange={() => handleComplete(item)}
              >
                完成
              </Checkbox>,
              <Dropdown
                menu={{
                  items: moreActions,
                  onClick: ({ key }) => handleMenuClick(key, item),
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text
                    style={{
                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                    }}
                  >
                    {item.title}
                  </Text>
                  <Tag color={priorityColors[item.priority]}>
                    <FlagOutlined /> {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                  </Tag>
                  <Tag>{typeLabels[item.type]}</Tag>
                </Space>
              }
              description={
                <Space direction="vertical">
                  <Text>{item.description}</Text>
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">截止日期: {item.dueDate}</Text>
                    <Text type="secondary">负责人: {item.assignee}</Text>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingKey ? '编辑待办' : '新增待办'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ priority: 'medium', type: 'task' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} />
          </Form.Item>
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
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select>
              <Option value="task">任务</Option>
              <Option value="meeting">会议</Option>
              <Option value="follow">跟进</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="assignee"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TodoList; 