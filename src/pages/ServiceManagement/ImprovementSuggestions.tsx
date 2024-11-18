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
  Row,
  Col,
  Progress,
  Timeline,
  Typography,
  Statistic,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
  BulbOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface SuggestionType {
  key: string;
  title: string;
  type: string;
  source: string;
  priority: string;
  status: string;
  content: string;
  solution: string;
  submitter: string;
  assignee: string;
  supportCount: number;
  department: string;
  expectedTime: string;
  createdAt: string;
  updatedAt: string;
  progress: {
    current: number;
    total: number;
  };
  history: {
    time: string;
    operator: string;
    action: string;
    content: string;
  }[];
}

const ImprovementSuggestions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionType | null>(null);

  // 模拟数据
  const mockData: SuggestionType[] = [
    {
      key: '1',
      title: '优化系统响应速度',
      type: 'performance',
      source: 'customer',
      priority: 'high',
      status: 'processing',
      content: '系统在高并发时响应较慢，建议优化数据库查询和缓存机制',
      solution: '1. 优化SQL查询\n2. 添加Redis缓存\n3. 增加服务器资源',
      submitter: '张三',
      assignee: '李工程师',
      supportCount: 15,
      department: '技术部',
      expectedTime: '2024-04-30',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-21',
      progress: {
        current: 3,
        total: 5,
      },
      history: [
        {
          time: '2024-03-20',
          operator: '张三',
          action: 'create',
          content: '提交建议',
        },
        {
          time: '2024-03-21',
          operator: '李工程师',
          action: 'process',
          content: '开始处理',
        },
      ],
    },
    // ... 可以添加更多模拟数据
  ];

  const [dataSource, setDataSource] = useState<SuggestionType[]>(mockData);

  // 统计数据
  const statistics = {
    total: dataSource.length,
    processing: dataSource.filter(item => item.status === 'processing').length,
    completed: dataSource.filter(item => item.status === 'completed').length,
    highPriority: dataSource.filter(item => item.priority === 'high').length,
  };

  const typeOptions = [
    { label: '性能优化', value: 'performance', color: 'blue' },
    { label: '功能建议', value: 'feature', color: 'green' },
    { label: '体验改进', value: 'experience', color: 'purple' },
    { label: '流程优化', value: 'process', color: 'orange' },
  ];

  const sourceOptions = [
    { label: '客户反馈', value: 'customer' },
    { label: '内部建议', value: 'internal' },
    { label: '系统监控', value: 'system' },
    { label: '市场调研', value: 'market' },
  ];

  const priorityOptions = [
    { label: '高', value: 'high', color: 'red' },
    { label: '中', value: 'medium', color: 'orange' },
    { label: '低', value: 'low', color: 'blue' },
  ];

  const statusOptions = [
    { label: '待处理', value: 'pending', color: 'default' },
    { label: '处理中', value: 'processing', color: 'processing' },
    { label: '已完成', value: 'completed', color: 'success' },
    { label: '已关闭', value: 'closed', color: 'error' },
  ];

  const columns: ColumnsType<SuggestionType> = [
    {
      title: '建议标题',
      key: 'title',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
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
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (source: string) => {
        const option = sourceOptions.find(s => s.value === source);
        return <Tag>{option?.label}</Tag>;
      },
      filters: sourceOptions.map(option => ({ text: option.label, value: option.value })),
      onFilter: (value: any, record) => record.source === value,
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
      title: '进度',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress 
            percent={Math.round((record.progress.current / record.progress.total) * 100)}
            size="small"
          />
          <Text type="secondary">
            {record.progress.current}/{record.progress.total}
          </Text>
        </Space>
      ),
    },
    {
      title: '支持数',
      dataIndex: 'supportCount',
      key: 'supportCount',
      width: 100,
      render: (count: number) => (
        <Space>
          <LikeOutlined />
          {count}
        </Space>
      ),
      sorter: (a, b) => a.supportCount - b.supportCount,
    },
    {
      title: '负责部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '预计完成',
      dataIndex: 'expectedTime',
      key: 'expectedTime',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
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
              setSelectedSuggestion(record);
              setIsDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: SuggestionType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: SuggestionType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条改进建议吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
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
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newSuggestion = {
          key: Date.now().toString(),
          ...values,
          supportCount: 0,
          progress: { current: 0, total: 5 },
          history: [
            {
              time: new Date().toISOString().split('T')[0],
              operator: '当前用户',
              action: 'create',
              content: '创建建议',
            },
          ],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newSuggestion]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总建议数"
              value={statistics.total}
              prefix={<BulbOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={statistics.processing}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高优先级"
              value={statistics.highPriority}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和过滤 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索建议标题或内容"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="选择类型"
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
              placeholder="选择优先级"
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
              placeholder="选择状态"
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
            新增建议
          </Button>
        </Col>
      </Row>

      {/* 建议列表 */}
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

      {/* 新增/编辑表单 */}
      <Modal
        title={editingKey ? '编辑建议' : '新增建议'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'feature',
            priority: 'medium',
            status: 'pending',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="建议标题"
                rules={[{ required: true, message: '请输入建议标题' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="建议类型"
                rules={[{ required: true, message: '请选择建议类型' }]}
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
                name="source"
                label="来源"
                rules={[{ required: true, message: '请选择来源' }]}
              >
                <Select>
                  {sourceOptions.map(option => (
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
          <Form.Item
            name="content"
            label="建议内容"
            rules={[{ required: true, message: '请输入建议内容' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="solution"
            label="解决方案"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="负责部门"
                rules={[{ required: true, message: '请选择负责部门' }]}
              >
                <Select>
                  <Option value="技术部">技术部</Option>
                  <Option value="产品部">产品部</Option>
                  <Option value="运营部">运营部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="expectedTime"
            label="预计完成时间"
            rules={[{ required: true, message: '请选择预计完成时间' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="建议详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSuggestion && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Space>
                      <Title level={4}>{selectedSuggestion.title}</Title>
                      <Tag color={typeOptions.find(t => t.value === selectedSuggestion.type)?.color}>
                        {typeOptions.find(t => t.value === selectedSuggestion.type)?.label}
                      </Tag>
                      <Tag color={priorityOptions.find(p => p.value === selectedSuggestion.priority)?.color}>
                        {priorityOptions.find(p => p.value === selectedSuggestion.priority)?.label}优先级
                      </Tag>
                    </Space>
                    <Text>{selectedSuggestion.content}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="解决方案">
                  <Text>{selectedSuggestion.solution || '暂无解决方案'}</Text>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="处理进度">
                  <Timeline
                    items={selectedSuggestion.history.map(item => ({
                      color: item.action === 'create' ? 'blue' : 'green',
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
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ImprovementSuggestions; 