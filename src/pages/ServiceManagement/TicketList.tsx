import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Tooltip,
  Row,
  Col,
  Timeline,
  Avatar,
  Typography,
  Upload,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface TicketType {
  key: string;
  code: string;
  title: string;
  customer: string;
  contact: string;
  type: string;
  priority: string;
  status: string;
  assignee: string;
  description: string;
  attachments: string[];
  history: {
    time: string;
    operator: string;
    action: string;
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
  deadline: string;
}

const TicketList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  // 模拟数据
  const mockData: TicketType[] = [
    {
      key: '1',
      code: 'TK202403001',
      title: '系统登录异常',
      customer: '阿里巴巴',
      contact: '张经理',
      type: 'bug',
      priority: 'high',
      status: 'processing',
      assignee: '李工程师',
      description: '用户无法正常登录系统，提示网络错误',
      attachments: ['error.png'],
      history: [
        {
          time: '2024-03-20 14:30',
          operator: '张经理',
          action: 'create',
          content: '创建工单',
        },
        {
          time: '2024-03-20 14:35',
          operator: '系统',
          action: 'assign',
          content: '分配给李工程师',
        },
        {
          time: '2024-03-20 15:00',
          operator: '李工程师',
          action: 'reply',
          content: '正在排查问题',
        },
      ],
      createdAt: '2024-03-20 14:30',
      updatedAt: '2024-03-20 15:00',
      deadline: '2024-03-21 14:30',
    },
    {
      key: '2',
      code: 'TK202403002',
      title: '功能优化建议',
      customer: '腾讯',
      contact: '李总',
      type: 'feature',
      priority: 'medium',
      status: 'pending',
      assignee: '王产品',
      description: '建议添加批量导入功能',
      attachments: [],
      history: [
        {
          time: '2024-03-20 16:00',
          operator: '李总',
          action: 'create',
          content: '创建工单',
        },
      ],
      createdAt: '2024-03-20 16:00',
      updatedAt: '2024-03-20 16:00',
      deadline: '2024-03-23 16:00',
    },
  ];

  const [dataSource, setDataSource] = useState<TicketType[]>(mockData);

  const typeOptions = [
    { label: '问题反馈', value: 'bug', color: 'error' },
    { label: '功能建议', value: 'feature', color: 'processing' },
    { label: '使用咨询', value: 'question', color: 'warning' },
    { label: '投诉建议', value: 'complaint', color: 'default' },
  ];

  const priorityOptions = [
    { label: '高', value: 'high', color: 'red' },
    { label: '中', value: 'medium', color: 'orange' },
    { label: '低', value: 'low', color: 'blue' },
  ];

  const statusOptions = [
    { label: '待处理', value: 'pending', color: 'default' },
    { label: '处理中', value: 'processing', color: 'processing' },
    { label: '待反馈', value: 'feedback', color: 'warning' },
    { label: '已解决', value: 'resolved', color: 'success' },
    { label: '已关闭', value: 'closed', color: 'default' },
  ];

  const columns: ColumnsType<TicketType> = [
    {
      title: '工单信息',
      key: 'info',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FileTextOutlined />
            <Text strong>{record.code}</Text>
          </Space>
          <Text>{record.title}</Text>
          <Space>
            <Tag color={typeOptions.find(t => t.value === record.type)?.color}>
              {typeOptions.find(t => t.value === record.type)?.label}
            </Tag>
            <Tag color={priorityOptions.find(p => p.value === record.priority)?.color}>
              {priorityOptions.find(p => p.value === record.priority)?.label}优先级
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.customer}</Text>
          <Text type="secondary">{record.contact}</Text>
        </Space>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const option = statusOptions.find(s => s.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
      filters: statusOptions.map(status => ({ text: status.label, value: status.value })),
      onFilter: (value: any, record) => record.status === value,
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 150,
      render: (deadline: string) => {
        const isOverdue = new Date(deadline) < new Date();
        return (
          <Tag color={isOverdue ? 'error' : 'default'} icon={<ClockCircleOutlined />}>
            {deadline}
          </Tag>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<CommentOutlined />}
            onClick={() => {
              setSelectedTicket(record);
              setIsHistoryVisible(true);
            }}
          >
            处理记录
          </Button>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.status !== 'closed' && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleClose(record)}
            >
              关闭
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (record: TicketType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleClose = (record: TicketType) => {
    Modal.confirm({
      title: '确认关闭',
      content: '确定要关闭这个工单吗？',
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? {
                  ...item,
                  status: 'closed',
                  updatedAt: new Date().toISOString().split('T')[0],
                  history: [
                    ...item.history,
                    {
                      time: new Date().toISOString().split('.')[0].replace('T', ' '),
                      operator: '当前用户',
                      action: 'close',
                      content: '关闭工单',
                    },
                  ],
                }
              : item
          )
        );
        message.success('工单已关闭');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        setDataSource(
          dataSource.map(item =>
            item.key === editingKey
              ? {
                  ...item,
                  ...values,
                  updatedAt: new Date().toISOString().split('T')[0],
                  history: [
                    ...item.history,
                    {
                      time: new Date().toISOString().split('.')[0].replace('T', ' '),
                      operator: '当前用户',
                      action: 'update',
                      content: '更新工单信息',
                    },
                  ],
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newTicket = {
          key: Date.now().toString(),
          code: `TK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'pending',
          history: [
            {
              time: new Date().toISOString().split('.')[0].replace('T', ' '),
              operator: '当前用户',
              action: 'create',
              content: '创建工单',
            },
          ],
          createdAt: new Date().toISOString().split('.')[0].replace('T', ' '),
          updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
        };
        setDataSource([...dataSource, newTicket]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索工单编号或标题"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="工单类型"
              style={{ width: 120 }}
              allowClear
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="优先级"
              style={{ width: 120 }}
              allowClear
            >
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              allowClear
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditingKey('');
              setIsModalVisible(true);
            }}
          >
            新建工单
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingKey ? '编辑工单' : '新建工单'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ priority: 'medium' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="工单标题"
                rules={[{ required: true, message: '请输入工单标题' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="工单类型"
                rules={[{ required: true, message: '请选择工单类型' }]}
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select>
                  <Option value="李工程师">李工程师</Option>
                  <Option value="王产品">王产品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="attachments"
            label="附件"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="deadline"
            label="截止时间"
            rules={[{ required: true, message: '请选择截止时间' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="处理记录"
        open={isHistoryVisible}
        onCancel={() => setIsHistoryVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTicket && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text strong>工单信息：</Text>
              <div>{selectedTicket.title}</div>
              <div>
                <Tag color={typeOptions.find(t => t.value === selectedTicket.type)?.color}>
                  {typeOptions.find(t => t.value === selectedTicket.type)?.label}
                </Tag>
                <Tag color={priorityOptions.find(p => p.value === selectedTicket.priority)?.color}>
                  {priorityOptions.find(p => p.value === selectedTicket.priority)?.label}优先级
                </Tag>
              </div>
            </div>
            <Timeline
              items={selectedTicket.history.map(item => ({
                color: getTimelineItemColor(item.action),
                children: (
                  <div>
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text strong>{item.operator}</Text>
                      <Text type="secondary">{item.time}</Text>
                    </Space>
                    <div style={{ marginTop: 8 }}>{item.content}</div>
                  </div>
                ),
              }))}
            />
            <Divider />
            <Form layout="vertical">
              <Form.Item
                label="添加处理记录"
                required
              >
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => message.success('记录已添加')}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </Card>
  );
};

// 获取时间线项目颜色
const getTimelineItemColor = (action: string) => {
  switch (action) {
    case 'create':
      return 'blue';
    case 'assign':
      return 'orange';
    case 'reply':
      return 'green';
    case 'close':
      return 'red';
    default:
      return 'gray';
  }
};

export default TicketList; 