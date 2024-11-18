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
  Tabs,
  Typography,
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
  LinkOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CustomerType {
  key: string;
  name: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  address: {
    province: string;
    city: string;
    detail: string;
  };
  website: string;
  industry: string;
  size: string;
  source: string;
  status: string;
  level: string;
  lastContact: string;
  nextContact: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
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
      address: {
        province: '浙江省',
        city: '杭州市',
        detail: '西湖区工专路 77 号',
      },
      website: 'www.alibaba.com',
      industry: '互联网',
      size: '10000人以上',
      source: '网站注册',
      status: 'active',
      level: 'A',
      lastContact: '2024-03-20',
      nextContact: '2024-03-25',
      remark: '重点客户，需要持续跟进',
      createdAt: '2024-01-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      name: '李四',
      company: '腾讯',
      contact: '李总',
      phone: '13800138001',
      email: 'li@example.com',
      address: {
        province: '广东省',
        city: '深圳市',
        detail: '南山区科技园',
      },
      website: 'www.tencent.com',
      industry: '互联网',
      size: '50000人以上',
      source: '销售推荐',
      status: 'inactive',
      level: 'B',
      lastContact: '2024-03-19',
      nextContact: '2024-03-24',
      remark: '一般客户，需要定期跟进',
      createdAt: '2024-01-02',
      updatedAt: '2024-03-19',
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

  // 添加更多选项配置
  const industryOptions = [
    { label: '互联网', value: 'internet' },
    { label: '金融', value: 'finance' },
    { label: '制造业', value: 'manufacture' },
    { label: '教育', value: 'education' },
    { label: '医疗', value: 'medical' },
  ];

  const sizeOptions = [
    { label: '0-50人', value: 'xs' },
    { label: '51-200人', value: 'sm' },
    { label: '201-1000人', value: 'md' },
    { label: '1001-10000人', value: 'lg' },
    { label: '10000人以上', value: 'xl' },
  ];

  // 更新表格列配置
  const columns: ColumnsType<CustomerType> = [
    {
      title: '客户信息',
      key: 'info',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <UserOutlined />
            <Text strong>{record.company}</Text>
            <Tag color={record.level === 'A' ? 'red' : record.level === 'B' ? 'orange' : 'blue'}>
              {record.level}级客户
            </Tag>
          </Space>
          <Text type="secondary">{record.industry} | {record.size}</Text>
          <Space>
            <LinkOutlined />
            <a href={`http://${record.website}`} target="_blank" rel="noopener noreferrer">
              {record.website}
            </a>
          </Space>
        </Space>
      ),
    },
    {
      title: '联系信息',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <UserOutlined />
            <Text>{record.contact}</Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text copyable>{record.phone}</Text>
          </Space>
          <Space>
            <MailOutlined />
            <Text copyable>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '地址',
      key: 'address',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.address.province} {record.address.city}</Text>
          <Text type="secondary">{record.address.detail}</Text>
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
      title: '联系记录',
      key: 'contactRecord',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <ClockCircleOutlined />
            <Text>上次：{record.lastContact}</Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>下次：{record.nextContact}</Text>
          </Space>
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
      title: '确认��除',
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
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', level: 'C' }}
        >
          <Tabs>
            <Tabs.TabPane tab="基本信息" key="basic">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="company"
                    label="公司名称"
                    rules={[{ required: true, message: '请输入公司名称' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="website"
                    label="公司网站"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="industry"
                    label="所属行业"
                    rules={[{ required: true, message: '请选择所属行业' }]}
                  >
                    <Select options={industryOptions} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="size"
                    label="公司规模"
                    rules={[{ required: true, message: '请选择公司规模' }]}
                  >
                    <Select options={sizeOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="联系信息" key="contact">
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
                    name={['address', 'province']}
                    label="所在省份"
                    rules={[{ required: true, message: '请选择所在省份' }]}
                  >
                    <Select>
                      <Option value="浙江省">浙江省</Option>
                      {/* 可以添加更多省份选项 */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={['address', 'city']}
                    label="所在城市"
                    rules={[{ required: true, message: '请选择所在城市' }]}
                  >
                    <Select>
                      <Option value="杭州市">杭州市</Option>
                      {/* 可以添加更多城市选项 */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['address', 'detail']}
                    label="详细地址"
                    rules={[{ required: true, message: '请输入详细地址' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="其他信息" key="other">
              <Row gutter={16}>
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
              </Row>
              <Form.Item
                name="remark"
                label="备注"
              >
                <TextArea rows={4} />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </Card>
  );
};

export default CustomerList; 