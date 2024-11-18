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
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { Option } = Select;

interface CustomerType {
  key: string;
  name: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  level: string;
  source: string;
  createdAt: string;
  lastContact: string;
}

const CustomerList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: CustomerType[] = [
    {
      key: '1',
      name: '张三',
      company: '阿里巴巴',
      contact: '张经理',
      phone: '13800138000',
      email: 'zhang@example.com',
      status: 'active',
      level: 'A',
      source: '网站注册',
      createdAt: '2024-01-01',
      lastContact: '2024-03-20',
    },
    {
      key: '2',
      name: '李四',
      company: '腾讯',
      contact: '李总',
      phone: '13800138001',
      email: 'li@example.com',
      status: 'inactive',
      level: 'B',
      source: '销售推荐',
      createdAt: '2024-01-02',
      lastContact: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<CustomerType[]>(mockData);

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'follow',
      label: '添加跟进',
    },
    {
      key: 'contact',
      label: '添加联系人',
    },
    {
      key: 'opportunity',
      label: '创建商机',
    },
  ];

  const columns: ColumnsType<CustomerType> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CustomerType) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
          <Tag>{record.company}</Tag>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            {record.phone}
          </Space>
          <Space>
            <MailOutlined />
            {record.email}
          </Space>
        </Space>
      ),
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors = {
          A: 'red',
          B: 'orange',
          C: 'blue',
          D: 'default',
        };
        return <Tag color={colors[level as keyof typeof colors]}>{level}级客户</Tag>;
      },
      filters: [
        { text: 'A级', value: 'A' },
        { text: 'B级', value: 'B' },
        { text: 'C级', value: 'C' },
        { text: 'D级', value: 'D' },
      ],
      onFilter: (value: any, record) => record.level === value,
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      key: 'source',
      filters: [
        { text: '网站注册', value: '网站注册' },
        { text: '销售推荐', value: '销售推荐' },
        { text: '广告投放', value: '广告投放' },
        { text: '合作伙伴', value: '合作伙伴' },
      ],
      onFilter: (value: any, record) => record.source === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '非活跃', value: 'inactive' },
      ],
      onFilter: (value: any, record) => record.status === value,
    },
    {
      title: '最近联系',
      dataIndex: 'lastContact',
      key: 'lastContact',
      sorter: (a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime(),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
          <Dropdown menu={{ items: moreActions, onClick: ({ key }) => handleMoreAction(key, record) }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleMoreAction = (key: string, record: CustomerType) => {
    switch (key) {
      case 'follow':
        message.info(`添加跟进: ${record.name}`);
        break;
      case 'contact':
        message.info(`添加联系人: ${record.name}`);
        break;
      case 'opportunity':
        message.info(`创建商机: ${record.name}`);
        break;
      default:
        break;
    }
  };

  const handleEdit = (record: CustomerType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个客户吗？',
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
        const newCustomer = {
          key: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          lastContact: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newCustomer]);
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
            placeholder="搜索客户名称、公司、联系人"
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
            新增客户
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
        title={editingKey ? '编辑客户' : '新增客户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', level: 'C' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
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
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入电子邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="客户等级"
                rules={[{ required: true, message: '请选择客户等级' }]}
              >
                <Select>
                  <Option value="A">A级</Option>
                  <Option value="B">B级</Option>
                  <Option value="C">C级</Option>
                  <Option value="D">D级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="source"
                label="客户来源"
                rules={[{ required: true, message: '请选择客户来源' }]}
              >
                <Select>
                  <Option value="网站注册">网站注册</Option>
                  <Option value="销售推荐">销售推荐</Option>
                  <Option value="广告投放">广告投放</Option>
                  <Option value="合作伙伴">合作伙伴</Option>
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
                  <Option value="active">活跃</Option>
                  <Option value="inactive">非活跃</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default CustomerList; 