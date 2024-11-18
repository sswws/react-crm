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
  DatePicker,
  Typography,
  Upload,
  List,
  Avatar,
  Divider,
  Progress,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface WorkReportType {
  key: string;
  title: string;
  type: string;
  period: string;
  content: {
    completed: string[];
    inProgress: string[];
    planned: string[];
    issues: string[];
  };
  attachments: string[];
  status: string;
  visibility: string;
  author: string;
  reviewers: string[];
  comments: {
    user: string;
    content: string;
    time: string;
  }[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const WorkReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedReport, setSelectedReport] = useState<WorkReportType | null>(null);

  // 模拟数据
  const mockData: WorkReportType[] = [
    {
      key: '1',
      title: '本周工作总结',
      type: 'weekly',
      period: '2024-03-18 至 2024-03-22',
      content: {
        completed: [
          '完成客户管理模块开发',
          '修复系统Bug 5个',
          '完成产品培训 2场',
        ],
        inProgress: [
          '数据统计功能开发 (80%)',
          '用户手册编写 (50%)',
        ],
        planned: [
          '开始报表模块开发',
          '准备月度产品发布会',
        ],
        issues: [
          '服务器性能需要优化',
          '部分客户反馈系统响应慢',
        ],
      },
      attachments: ['weekly_report.pdf'],
      status: 'submitted',
      visibility: 'team',
      author: '张三',
      reviewers: ['李经理', '王总监'],
      comments: [
        {
          user: '李经理',
          content: '做得很好，继续保持',
          time: '2024-03-22 15:30',
        },
      ],
      likes: 5,
      createdAt: '2024-03-22 14:30',
      updatedAt: '2024-03-22 14:30',
    },
  ];

  const [dataSource, setDataSource] = useState<WorkReportType[]>(mockData);

  const typeOptions = [
    { label: '日报', value: 'daily' },
    { label: '周报', value: 'weekly' },
    { label: '月报', value: 'monthly' },
    { label: '项目报告', value: 'project' },
  ];

  const statusOptions = [
    { label: '草稿', value: 'draft', color: 'default' },
    { label: '已提交', value: 'submitted', color: 'processing' },
    { label: '已审阅', value: 'reviewed', color: 'success' },
    { label: '需修改', value: 'revision', color: 'warning' },
  ];

  const visibilityOptions = [
    { label: '仅自己可见', value: 'private' },
    { label: '团队可见', value: 'team' },
    { label: '部门可见', value: 'department' },
    { label: '公司可见', value: 'company' },
  ];

  const columns: ColumnsType<WorkReportType> = [
    {
      title: '报告信息',
      key: 'info',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FileTextOutlined />
            <Text strong>{record.title}</Text>
          </Space>
          <Space>
            <Tag>{typeOptions.find(t => t.value === record.type)?.label}</Tag>
            <Tag>{record.period}</Tag>
          </Space>
        </Space>
      ),
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
      title: '可见范围',
      dataIndex: 'visibility',
      key: 'visibility',
      width: 120,
      render: (visibility: string) => {
        const option = visibilityOptions.find(v => v.value === visibility);
        return <Tag>{option?.label}</Tag>;
      },
    },
    {
      title: '互动',
      key: 'interaction',
      width: 150,
      render: (_, record) => (
        <Space>
          <Space>
            <LikeOutlined />
            {record.likes}
          </Space>
          <Space>
            <CommentOutlined />
            {record.comments.length}
          </Space>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setSelectedReport(record);
              setIsViewModalVisible(true);
            }}
          >
            查看详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status === 'reviewed'}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
            disabled={record.status === 'reviewed'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: WorkReportType) => {
    form.setFieldsValue({
      ...record,
      completed: record.content.completed.join('\n'),
      inProgress: record.content.inProgress.join('\n'),
      planned: record.content.planned.join('\n'),
      issues: record.content.issues.join('\n'),
    });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: WorkReportType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这份工作报告吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        content: {
          completed: values.completed.split('\n').filter(Boolean),
          inProgress: values.inProgress.split('\n').filter(Boolean),
          planned: values.planned.split('\n').filter(Boolean),
          issues: values.issues.split('\n').filter(Boolean),
        },
      };

      if (editingKey) {
        setDataSource(
          dataSource.map(item =>
            item.key === editingKey
              ? {
                  ...item,
                  ...formData,
                  updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newReport = {
          key: Date.now().toString(),
          ...formData,
          attachments: [],
          status: 'draft',
          author: '当前用户',
          reviewers: [],
          comments: [],
          likes: 0,
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
        };
        setDataSource([...dataSource, newReport]);
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
              placeholder="搜索报告标题"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="报告类型"
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
            写报告
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingKey ? '编辑报告' : '写报告'}
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
            type: 'weekly',
            visibility: 'team',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="报告标题"
                rules={[{ required: true, message: '请输入报告标题' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="报告类型"
                rules={[{ required: true, message: '请选择报告类型' }]}
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
          <Form.Item
            name="period"
            label="报告周期"
            rules={[{ required: true, message: '请选择报告周期' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="completed"
            label="已完成工作"
            rules={[{ required: true, message: '请输入已完成工作' }]}
          >
            <TextArea
              rows={4}
              placeholder="每行一项工作内容"
            />
          </Form.Item>
          <Form.Item
            name="inProgress"
            label="进行中工作"
          >
            <TextArea
              rows={4}
              placeholder="每行一项工作内容"
            />
          </Form.Item>
          <Form.Item
            name="planned"
            label="计划工作"
          >
            <TextArea
              rows={4}
              placeholder="每行一项工作内容"
            />
          </Form.Item>
          <Form.Item
            name="issues"
            label="问题与建议"
          >
            <TextArea
              rows={4}
              placeholder="每行一项内容"
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="visibility"
                label="可见范围"
                rules={[{ required: true, message: '请选择可见范围' }]}
              >
                <Select>
                  {visibilityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reviewers"
                label="审阅人"
              >
                <Select mode="multiple" placeholder="选择审阅人">
                  <Option value="李经理">李经理</Option>
                  <Option value="王总监">王总监</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="attachments"
            label="附件"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="报告详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="share"
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={() => message.success('分享成功')}
          >
            分享
          </Button>,
        ]}
        width={800}
      >
        {selectedReport && (
          <div>
            <Title level={4}>{selectedReport.title}</Title>
            <Space split={<Divider type="vertical" />}>
              <Tag>{typeOptions.find(t => t.value === selectedReport.type)?.label}</Tag>
              <Text>{selectedReport.period}</Text>
              <Tag color={statusOptions.find(s => s.value === selectedReport.status)?.color}>
                {statusOptions.find(s => s.value === selectedReport.status)?.label}
              </Tag>
            </Space>

            <Divider />

            <Title level={5}>已完成工作</Title>
            <List
              dataSource={selectedReport.content.completed}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Title level={5}>进行中工作</Title>
            <List
              dataSource={selectedReport.content.inProgress}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Title level={5}>计划工作</Title>
            <List
              dataSource={selectedReport.content.planned}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            {selectedReport.content.issues.length > 0 && (
              <>
                <Title level={5}>问题与建议</Title>
                <List
                  dataSource={selectedReport.content.issues}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <TeamOutlined />
                <Text strong>审阅人：</Text>
                {selectedReport.reviewers.map(reviewer => (
                  <Tag key={reviewer}>{reviewer}</Tag>
                ))}
              </Space>

              {selectedReport.comments.length > 0 && (
                <>
                  <Title level={5}>评论</Title>
                  <Timeline
                    items={selectedReport.comments.map(comment => ({
                      children: (
                        <div>
                          <Space>
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text strong>{comment.user}</Text>
                            <Text type="secondary">{comment.time}</Text>
                          </Space>
                          <div style={{ marginTop: 8 }}>{comment.content}</div>
                        </div>
                      ),
                    }))}
                  />
                </>
              )}
            </Space>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default WorkReport; 