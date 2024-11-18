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
  WechatOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface ContactType {
  key: string;
  name: string;
  company: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  wechat: string;
  linkedin: string;
  type: string;
  status: string;
  remark: string;
  createdAt: string;
  lastContact: string;
}

const ContactList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: ContactType[] = [
    {
      key: '1',
      name: '张经理',
      company: '阿里巴巴',
      department: '销售部',
      position: '销售总监',
      phone: '13800138000',
      email: 'zhang@example.com',
      wechat: 'zhangsan_wx',
      linkedin: 'zhangsan_linkedin',
      type: 'primary',
      status: 'active',
      remark: '重要客户联系人',
      createdAt: '2024-01-01',
      lastContact: '2024-03-20',
    },
    {
      key: '2',
      name: '李总',
      company: '腾讯',
      department: '采购部',
      position: '采购经理',
      phone: '13800138001',
      email: 'li@example.com',
      wechat: 'lisi_wx',
      linkedin: 'lisi_linkedin',
      type: 'secondary',
      status: 'inactive',
      remark: '采购决策人',
      createdAt: '2024-01-02',
      lastContact: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<ContactType[]>(mockData);

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'record',
      label: '添加沟通记录',
    },
    {
      key: 'schedule',
      label: '安排跟进',
    },
    {
      key: 'share',
      label: '分享联系人',
    },
  ];

  const columns: ColumnsType<ContactType> = [
    {
      title: '联系人',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ContactType) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <span>{text}</span>
            <Tag color={record.type === 'primary' ? 'blue' : 'default'}>
              {record.type === 'primary' ? '主要联系人' : '普通联系人'}
            </Tag>
          </Space>
          <Space>
            <span style={{ color: '#666' }}>{record.position}</span>
            <Tag>{record.department}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
      width: 120,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
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
          <Space>
            <WechatOutlined />
            {record.wechat}
          </Space>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      ellipsis: true,
    },
    {
      title: '最近联系',
      dataIndex: 'lastContact',
      key: 'lastContact',
      width: 120,
      sorter: (a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime(),
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

  const handleMoreAction = (key: string, record: ContactType) => {
    switch (key) {
      case 'record':
        message.info(`添加沟通记录: ${record.name}`);
        break;
      case 'schedule':
        message.info(`安排跟进: ${record.name}`);
        break;
      case 'share':
        message.info(`分享联系人: ${record.name}`);
        break;
      default:
        break;
    }
  };

  const handleEdit = (record: ContactType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个联系人吗？',
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
        const newContact = {
          key: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          lastContact: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newContact]);
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
            placeholder="搜索联系人姓名、公司、电话"
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
            新增联系人
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
        scroll={{ x: 1300 }}
      />

      <Modal
        title={editingKey ? '编辑联系人' : '新增联系人'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', type: 'secondary' }}
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
                name="department"
                label="部门"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="wechat"
                label="微信"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="linkedin"
                label="领英"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="联系人类型"
                rules={[{ required: true, message: '请选择联系人类型' }]}
              >
                <Select>
                  <Option value="primary">主要联系人</Option>
                  <Option value="secondary">普通联系人</Option>
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

export default ContactList; 