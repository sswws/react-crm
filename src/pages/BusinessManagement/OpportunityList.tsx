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
  Progress,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ShopOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface OpportunityType {
  key: string;
  name: string;
  customer: string;
  contact: string;
  amount: number;
  stage: string;
  probability: number;
  source: string;
  expectedDate: string;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

const OpportunityList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: OpportunityType[] = [
    {
      key: '1',
      name: '企业ERP系统升级项目',
      customer: '阿里巴巴',
      contact: '张经理',
      amount: 500000,
      stage: 'negotiation',
      probability: 80,
      source: 'referral',
      expectedDate: '2024-06-30',
      status: 'active',
      owner: '王销售',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      name: '数据中心建设项目',
      customer: '腾讯',
      contact: '李总',
      amount: 1200000,
      stage: 'proposal',
      probability: 60,
      source: 'website',
      expectedDate: '2024-07-15',
      status: 'active',
      owner: '张销售',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<OpportunityType[]>(mockData);

  const stageOptions = [
    { label: '初步接触', value: 'initial', color: 'blue' },
    { label: '需求确认', value: 'requirement', color: 'cyan' },
    { label: '方案报价', value: 'proposal', color: 'orange' },
    { label: '商务谈判', value: 'negotiation', color: 'gold' },
    { label: '合同签订', value: 'contract', color: 'green' },
    { label: '已失败', value: 'lost', color: 'red' },
  ];

  const sourceOptions = [
    { label: '网站注册', value: 'website' },
    { label: '客户推荐', value: 'referral' },
    { label: '电话营销', value: 'telemarketing' },
    { label: '展会获取', value: 'exhibition' },
    { label: '广告投放', value: 'advertising' },
  ];

  const columns: ColumnsType<OpportunityType> = [
    {
      title: '商机名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => (
        <Space>
          <ShopOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>{record.customer}</span>
          <span style={{ color: '#666' }}>{record.contact}</span>
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#f50' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      width: 120,
      render: (stage: string) => {
        const option = stageOptions.find(opt => opt.value === stage);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
      filters: stageOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value: any, record) => record.stage === value,
    },
    {
      title: '赢单率',
      dataIndex: 'probability',
      key: 'probability',
      width: 120,
      render: (probability: number) => (
        <Progress percent={probability} size="small" />
      ),
      sorter: (a, b) => a.probability - b.probability,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (source: string) => {
        const option = sourceOptions.find(opt => opt.value === source);
        return option?.label;
      },
      filters: sourceOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value: any, record) => record.source === value,
    },
    {
      title: '预计成交时间',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 120,
      sorter: (a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime(),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
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
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
          <Tooltip title="创建合同">
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => handleCreateContract(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: OpportunityType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个商机吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== key));
        message.success('删除成功');
      },
    });
  };

  const handleCreateContract = (record: OpportunityType) => {
    message.info(`准备为商机 ${record.name} 创建合同`);
    // 这里可以跳转到创建合同页面或打开创建合同的模态框
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
        const newOpportunity = {
          key: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newOpportunity]);
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
              placeholder="搜索商机名称或客户"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['预计成交开始', '预计成交结束']} />
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
            新增商机
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
        title={editingKey ? '编辑商机' : '新增商机'}
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
            stage: 'initial',
            probability: 20,
            status: 'active',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商机名称"
                rules={[{ required: true, message: '请输入商机名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
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
                name="amount"
                label="商机金额"
                rules={[{ required: true, message: '请输入商机金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stage"
                label="商机阶段"
                rules={[{ required: true, message: '请选择商机阶段' }]}
              >
                <Select>
                  {stageOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="probability"
                label="赢单率"
                rules={[{ required: true, message: '请输入赢单率' }]}
              >
                <InputNumber<number>
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => {
                    const parsed = value ? Number(value.replace('%', '')) : 0;
                    if (parsed <= 0) return 0;
                    if (parsed >= 100) return 100;
                    return Math.min(100, Math.max(0, Math.round(parsed)));
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="source"
                label="商机来源"
                rules={[{ required: true, message: '请选择商机来源' }]}
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
                name="expectedDate"
                label="预计成交时间"
                rules={[{ required: true, message: '请选择预计成交时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="active">进行中</Option>
                  <Option value="won">已赢单</Option>
                  <Option value="lost">已输单</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default OpportunityList; 