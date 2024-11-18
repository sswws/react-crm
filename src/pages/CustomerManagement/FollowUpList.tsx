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
  DatePicker,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  CommentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;

interface FollowUpType {
  key: string;
  customer: string;
  contact: string;
  type: string;
  content: string;
  nextPlan: string;
  nextTime: string;
  status: string;
  creator: string;
  createdAt: string;
}

const FollowUpList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: FollowUpType[] = [
    {
      key: '1',
      customer: '阿里巴巴',
      contact: '张经理',
      type: 'visit',
      content: '进行了产品演示，客户对价格比较关注',
      nextPlan: '准备详细的报价方案',
      nextTime: '2024-03-25',
      status: 'pending',
      creator: '王销售',
      createdAt: '2024-03-20',
    },
    {
      key: '2',
      customer: '腾讯',
      contact: '李总',
      type: 'phone',
      content: '电话沟通了项目进展，需要提供更多技术支持',
      nextPlan: '安排技术团队对接',
      nextTime: '2024-03-22',
      status: 'completed',
      creator: '张销售',
      createdAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<FollowUpType[]>(mockData);

  const columns: ColumnsType<FollowUpType> = [
    {
      title: '客户信息',
      key: 'customer',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <span>{record.customer}</span>
          </Space>
          <Space>
            <span style={{ color: '#666' }}>{record.contact}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: '跟进方式',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const types = {
          visit: { color: 'blue', text: '实地拜访' },
          phone: { color: 'green', text: '电话沟通' },
          email: { color: 'orange', text: '邮件往来' },
          other: { color: 'default', text: '其他方式' },
        };
        const typeInfo = types[type as keyof typeof types];
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
      filters: [
        { text: '实地拜访', value: 'visit' },
        { text: '电话沟通', value: 'phone' },
        { text: '邮件往来', value: 'email' },
        { text: '其他方式', value: 'other' },
      ],
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      key: 'content',
      width: 250,
      ellipsis: true,
    },
    {
      title: '下次计划',
      key: 'nextPlan',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>{record.nextPlan}</div>
          <Tag icon={<ClockCircleOutlined />}>{record.nextTime}</Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status === 'completed' ? '已完成' : '进行中'}
        </Tag>
      ),
      filters: [
        { text: '已完成', value: 'completed' },
        { text: '进行中', value: 'pending' },
      ],
      onFilter: (value: any, record) => record.status === value,
    },
    {
      title: '创建信息',
      key: 'creator',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>{record.creator}</span>
          <span style={{ color: '#666' }}>{record.createdAt}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: FollowUpType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条跟进记录吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== key));
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
            item.key === editingKey ? { ...item, ...values } : item
          )
        );
        message.success('更新成功');
      } else {
        const newRecord = {
          key: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          creator: '当前用户', // 实际应该从用户状态获取
        };
        setDataSource([...dataSource, newRecord]);
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
          <Input.Search
            placeholder="搜索客户名称、联系人或内容"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
          />
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
            新增跟进
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
        title={editingKey ? '编辑跟进' : '新增跟进'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'phone', status: 'pending' }}
        >
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
                name="type"
                label="跟进方式"
                rules={[{ required: true, message: '请选择跟进方式' }]}
              >
                <Select>
                  <Option value="visit">实地拜访</Option>
                  <Option value="phone">电话沟通</Option>
                  <Option value="email">邮件往来</Option>
                  <Option value="other">其他方式</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="pending">进行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nextPlan"
                label="下次计划"
                rules={[{ required: true, message: '请输入下次计划' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nextTime"
                label="计划时间"
                rules={[{ required: true, message: '请选择计划时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default FollowUpList; 