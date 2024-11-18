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
  InputNumber,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PrinterOutlined,
  SendOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface QuoteType {
  key: string;
  code: string;
  title: string;
  customer: string;
  contact: string;
  totalAmount: number;
  validityPeriod: string;
  status: string;
  opportunity: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    discount: number;
    amount: number;
  }[];
  remark: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const QuoteList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: QuoteType[] = [
    {
      key: '1',
      code: 'QT202403001',
      title: 'ERP系统报价方案',
      customer: '阿里巴巴',
      contact: '张经理',
      totalAmount: 500000,
      validityPeriod: '2024-04-20',
      status: 'pending',
      opportunity: '企业ERP系统升级项目',
      products: [
        {
          name: 'ERP基础模块',
          quantity: 1,
          price: 300000,
          discount: 0.9,
          amount: 270000,
        },
        {
          name: '实施服务',
          quantity: 1,
          price: 200000,
          discount: 1,
          amount: 200000,
        },
      ],
      remark: '含一年免费维护',
      createdBy: '王销售',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      code: 'QT202403002',
      title: '数据中心解决方案报价',
      customer: '腾讯',
      contact: '李总',
      totalAmount: 1200000,
      validityPeriod: '2024-04-15',
      status: 'sent',
      opportunity: '数据中心建设项目',
      products: [
        {
          name: '服务器集群',
          quantity: 10,
          price: 80000,
          discount: 0.95,
          amount: 760000,
        },
        {
          name: '存储系统',
          quantity: 2,
          price: 200000,
          discount: 0.9,
          amount: 360000,
        },
      ],
      remark: '包含安装调试',
      createdBy: '张销售',
      createdAt: '2024-03-19',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<QuoteType[]>(mockData);

  const statusOptions = [
    { label: '草稿', value: 'draft', color: 'default' },
    { label: '待审核', value: 'pending', color: 'processing' },
    { label: '已发送', value: 'sent', color: 'warning' },
    { label: '已确认', value: 'confirmed', color: 'success' },
    { label: '已拒绝', value: 'rejected', color: 'error' },
  ];

  const columns: ColumnsType<QuoteType> = [
    {
      title: '报价单号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '报价标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>{record.customer}</span>
          <Text type="secondary">{record.contact}</Text>
        </Space>
      ),
    },
    {
      title: '报价金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <Text type="danger">¥{amount.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '关联商机',
      dataIndex: 'opportunity',
      key: 'opportunity',
      width: 200,
      ellipsis: true,
    },
    {
      title: '有效期至',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod',
      width: 120,
      render: (date: string) => {
        const isExpired = new Date(date) < new Date();
        return (
          <Tag color={isExpired ? 'error' : 'default'}>
            {date}
          </Tag>
        );
      },
      sorter: (a, b) => new Date(a.validityPeriod).getTime() - new Date(b.validityPeriod).getTime(),
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
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'confirmed'}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="打印">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          <Tooltip title="发送">
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={() => handleSend(record)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: QuoteType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleCopy = (record: QuoteType) => {
    const newQuote = {
      ...record,
      key: Date.now().toString(),
      code: `QT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([...dataSource, newQuote]);
    message.success('复制成功');
  };

  const handlePrint = (record: QuoteType) => {
    message.info(`打印报价单: ${record.code}`);
    // 实现打印功能
  };

  const handleSend = (record: QuoteType) => {
    Modal.confirm({
      title: '确认发送',
      content: '确定要发送这个报价单吗？',
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? { ...item, status: 'sent', updatedAt: new Date().toISOString().split('T')[0] }
              : item
          )
        );
        message.success('发送成功');
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
        const newQuote = {
          key: Date.now().toString(),
          code: `QT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'draft',
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newQuote]);
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
              placeholder="搜索报价单号或标题"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['开始日期', '结束日期']} />
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
            新增报价
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
        title={editingKey ? '编辑报价' : '新增报价'}
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
                name="title"
                label="报价标题"
                rules={[{ required: true, message: '请输入报价标题' }]}
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
                name="validityPeriod"
                label="有效期至"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="opportunity"
                label="关联商机"
              >
                <Select
                  placeholder="请选择关联商机"
                  allowClear
                >
                  <Option value="企业ERP系统升级项目">企业ERP系统升级项目</Option>
                  <Option value="数据中心建设项目">数据中心建设项目</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalAmount"
                label="报价金额"
                rules={[{ required: true, message: '请输入报价金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
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

export default QuoteList; 