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
  InputNumber,
  Typography,
  Tooltip,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  BankOutlined,
  PayCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface PaymentType {
  key: string;
  code: string;
  customer: string;
  contract: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  remark: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: PaymentType[] = [
    {
      key: '1',
      code: 'PAY202403001',
      customer: '阿里巴巴',
      contract: 'CT202403001',
      amount: 500000,
      paymentMethod: 'bank',
      paymentDate: '2024-03-20',
      status: 'completed',
      remark: '首付款',
      attachments: ['payment1.pdf'],
      createdBy: '张三',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
    // ... 可以添加更多模拟数据
  ];

  const [dataSource, setDataSource] = useState<PaymentType[]>(mockData);

  const paymentMethods = [
    { label: '银行转账', value: 'bank' },
    { label: '支票', value: 'check' },
    { label: '现金', value: 'cash' },
    { label: '其他', value: 'other' },
  ];

  const statusOptions = [
    { label: '待确认', value: 'pending', color: 'warning' },
    { label: '已完成', value: 'completed', color: 'success' },
    { label: '已取消', value: 'cancelled', color: 'error' },
  ];

  // 表格列定义
  const columns: ColumnsType<PaymentType> = [
    {
      title: '收款编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: '关联合同',
      dataIndex: 'contract',
      key: 'contract',
      width: 150,
    },
    {
      title: '收款金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number) => (
        <Text type="danger">¥{amount.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '收款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method: string) => {
        const option = paymentMethods.find(m => m.value === method);
        return <Tag icon={<BankOutlined />}>{option?.label}</Tag>;
      },
    },
    {
      title: '收款日期',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      sorter: (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
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
              disabled={record.status === 'completed'}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={record.status === 'completed'}
            />
          </Tooltip>
          <Tooltip title="打印">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="确认">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirm(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // ... 处理函数实现
  const handleEdit = (record: PaymentType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: PaymentType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条收款记录吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handlePrint = (record: PaymentType) => {
    message.info(`打印收款单: ${record.code}`);
  };

  const handleConfirm = (record: PaymentType) => {
    Modal.confirm({
      title: '确认收款',
      content: '确定要确认这笔收款吗？',
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? { ...item, status: 'completed', updatedAt: new Date().toISOString().split('T')[0] }
              : item
          )
        );
        message.success('确认成功');
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
        const newPayment = {
          key: Date.now().toString(),
          code: `PAY${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'pending',
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newPayment]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月收款"
              value={500000}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待确认"
              value={3}
              prefix={<PayCircleOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索收款编号或客户"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['收款开始日期', '收款结束日期']} />
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
            新增收款
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
        title={editingKey ? '编辑收款' : '新增收款'}
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
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: '请选择客户' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择客户"
                  optionFilterProp="children"
                >
                  <Option value="阿里巴巴">阿里巴巴</Option>
                  <Option value="腾讯">腾讯</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contract"
                label="关联合同"
                rules={[{ required: true, message: '请选择关联合同' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择合同"
                  optionFilterProp="children"
                >
                  <Option value="CT202403001">CT202403001</Option>
                  <Option value="CT202403002">CT202403002</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="收款金额"
                rules={[{ required: true, message: '请输入收款金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="收款方式"
                rules={[{ required: true, message: '请选择收款方式' }]}
              >
                <Select>
                  {paymentMethods.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="paymentDate"
            label="收款日期"
            rules={[{ required: true, message: '请选择收款日期' }]}
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

export default PaymentList; 