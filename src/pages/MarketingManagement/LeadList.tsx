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
  Typography,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface LeadType {
  key: string;
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  source: string;
  campaign: string;
  status: string;
  score: number;
  lastContact: string;
  nextContact: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  remark: string;
}

const LeadList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: LeadType[] = [
    {
      key: '1',
      name: '张三',
      company: '阿里巴巴',
      title: '技术总监',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      source: 'campaign',
      campaign: '2024春季促销活动',
      status: 'new',
      score: 85,
      lastContact: '2024-03-20',
      nextContact: '2024-03-25',
      owner: '王销售',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
      remark: '对产品很感兴趣',
    },
    {
      key: '2',
      name: '李四',
      company: '腾讯',
      title: '采购经理',
      phone: '13800138001',
      email: 'lisi@example.com',
      source: 'website',
      campaign: '-',
      status: 'following',
      score: 65,
      lastContact: '2024-03-19',
      nextContact: '2024-03-22',
      owner: '张销售',
      createdAt: '2024-03-19',
      updatedAt: '2024-03-19',
      remark: '需要详细报价',
    },
  ];

  const [dataSource, setDataSource] = useState<LeadType[]>(mockData);

  const sourceOptions = [
    { label: '营销活动', value: 'campaign' },
    { label: '网站注册', value: 'website' },
    { label: '电话咨询', value: 'phone' },
    { label: '客户推荐', value: 'referral' },
    { label: '社交媒体', value: 'social' },
  ];

  const statusOptions = [
    { label: '新线索', value: 'new', color: 'blue' },
    { label: '跟进中', value: 'following', color: 'processing' },
    { label: '已转化', value: 'converted', color: 'success' },
    { label: '已失效', value: 'lost', color: 'default' },
  ];

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'convert',
      label: '转为商机',
      icon: <ArrowRightOutlined />,
    },
    {
      key: 'assign',
      label: '分配销售',
    },
    {
      key: 'follow',
      label: '添加跟进',
    },
  ];

  const columns: ColumnsType<LeadType> = [
    {
      title: '线索信息',
      key: 'info',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <Text strong>{record.name}</Text>
            <Tag>{record.title}</Tag>
          </Space>
          <Text type="secondary">{record.company}</Text>
          <Space>
            <PhoneOutlined /> {record.phone}
          </Space>
          <Space>
            <MailOutlined /> {record.email}
          </Space>
        </Space>
      ),
    },
    {
      title: '来源',
      key: 'source',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag>{sourceOptions.find(s => s.value === record.source)?.label}</Tag>
          <Text type="secondary">{record.campaign}</Text>
        </Space>
      ),
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
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number) => {
        let color = 'default';
        if (score >= 80) color = 'success';
        else if (score >= 60) color = 'warning';
        else if (score < 60) color = 'error';
        return <Tag color={color}>{score}分</Tag>;
      },
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: '最近联系',
      dataIndex: 'lastContact',
      key: 'lastContact',
      width: 120,
      sorter: (a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime(),
    },
    {
      title: '下次联系',
      dataIndex: 'nextContact',
      key: 'nextContact',
      width: 120,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
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
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
          <Dropdown menu={{ items: moreActions, onClick: ({ key }) => handleMoreAction(key, record) }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: LeadType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: LeadType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个线索吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleMoreAction = (key: string, record: LeadType) => {
    switch (key) {
      case 'convert':
        message.info(`转化为商机: ${record.name}`);
        break;
      case 'assign':
        message.info(`分配销售: ${record.name}`);
        break;
      case 'follow':
        message.info(`添加跟进: ${record.name}`);
        break;
      default:
        break;
    }
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
        const newLead = {
          key: Date.now().toString(),
          ...values,
          status: 'new',
          score: 0,
          owner: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newLead]);
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
              placeholder="搜索线索名称、公司或联系方式"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="选择来源"
              style={{ width: 150 }}
              allowClear
            >
              {sourceOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 150 }}
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
            新增线索
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1800 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingKey ? '编辑线索' : '新增线索'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="公司"
                rules={[{ required: true, message: '请输入公司' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[
                  { required: true, message: '请输入电话' },
                  { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
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
          </Row>
          <Form.Item
            name="campaign"
            label="关联活动"
          >
            <Select
              placeholder="请选择关联活动"
              allowClear
            >
              <Option value="2024春季促销活动">2024春季促销活动</Option>
              <Option value="新产品发布会">新产品发布会</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="nextContact"
            label="下次联系时间"
            rules={[{ required: true, message: '请选择下次联系时间' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LeadList; 