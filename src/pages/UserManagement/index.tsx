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
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface UserType {
  key: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟用户数据
  const mockData: UserType[] = [
    {
      key: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-20 14:30',
      createdAt: '2024-01-01',
    },
    {
      key: '2',
      name: '李四',
      email: 'lisi@example.com',
      phone: '13800138001',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-03-19 09:15',
      createdAt: '2024-01-02',
    },
    // 可以添加更多模拟数据
  ];

  const [dataSource, setDataSource] = useState<UserType[]>(mockData);
  const [searchText, setSearchText] = useState('');

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
      onFilter: (value: any, record: UserType) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '活跃' : '未活跃'}
        </Tag>
      ),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '未活跃', value: 'inactive' },
      ],
      onFilter: (value: any, record: UserType) => record.status === value,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a: UserType, b: UserType) =>
        new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: UserType, b: UserType) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserType) => (
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

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.phone.includes(value)
    );
    setDataSource(filteredData);
  };

  // 处理添加用户
  const handleAdd = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (record: UserType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  // 处理删除用户
  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk() {
        setDataSource(dataSource.filter((item) => item.key !== key));
        message.success('删除成功');
      },
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        // 编辑现有用户
        setDataSource(
          dataSource.map((item) =>
            item.key === editingKey ? { ...item, ...values } : item
          )
        );
        message.success('更新成功');
      } else {
        // 添加新用户
        const newUser = {
          key: Date.now().toString(),
          ...values,
          lastLogin: '-',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newUser]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col flex="auto">
            <Input.Search
              placeholder="搜索用户名、邮箱或电话"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加用户
            </Button>
          </Col>
        </Row>

        <Table
          style={{ marginTop: 16 }}
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
          title={editingKey ? '编辑用户' : '添加用户'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ role: 'user', status: 'active' }}
          >
            <Form.Item
              name="name"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input />
            </Form.Item>
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
            <Form.Item name="role" label="角色">
              <Select>
                <Option value="admin">管理员</Option>
                <Option value="user">普通用户</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select>
                <Option value="active">活跃</Option>
                <Option value="inactive">未活跃</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserManagement; 