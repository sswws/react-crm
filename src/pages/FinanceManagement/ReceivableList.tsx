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
  Progress,
  Statistic,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ReceivableType {
  key: string;
  code: string;
  customer: string;
  contract: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  type: string;
  remark: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const ReceivableList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: ReceivableType[] = [
    {
      key: '1',
      code: 'AR202403001',
      customer: '阿里巴巴',
      contract: 'CT202403001',
      totalAmount: 500000,
      paidAmount: 200000,
      dueDate: '2024-04-20',
      status: 'partial',
      type: 'contract',
      remark: '首期款已收',
      createdBy: '张三',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      code: 'AR202403002',
      customer: '腾讯',
      contract: 'CT202403002',
      totalAmount: 1200000,
      paidAmount: 0,
      dueDate: '2024-04-15',
      status: 'overdue',
      type: 'contract',
      remark: '已逾期',
      createdBy: '李四',
      createdAt: '2024-03-19',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<ReceivableType[]>(mockData);

  const statusOptions = [
    { label: '未收款', value: 'unpaid', color: 'default' },
    { label: '部分收款', value: 'partial', color: 'processing' },
    { label: '已收款', value: 'paid', color: 'success' },
    { label: '已逾期', value: 'overdue', color: 'error' },
  ];

  const typeOptions = [
    { label: '合同款项', value: 'contract' },
    { label: '预付款', value: 'advance' },
    { label: '质保金', value: 'warranty' },
    { label: '其他', value: 'other' },
  ];

  // 计算统计数据
  const statistics = {
    totalReceivable: dataSource.reduce((sum, item) => sum + (item.totalAmount - item.paidAmount), 0),
    overdueAmount: dataSource
      .filter(item => item.status === 'overdue')
      .reduce((sum, item) => sum + (item.totalAmount - item.paidAmount), 0),
    partialCount: dataSource.filter(item => item.status === 'partial').length,
    overdueCount: dataSource.filter(item => item.status === 'overdue').length,
  };

  const columns: ColumnsType<ReceivableType> = [
    {
      title: '应收编号',
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
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: '关联合同',
      dataIndex: 'contract',
      key: 'contract',
      width: 120,
    },
    {
      title: '应收金额',
      key: 'amount',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>总额: ¥{record.totalAmount.toLocaleString()}</Text>
          <Text type="success">已收: ¥{record.paidAmount.toLocaleString()}</Text>
          <Text type="danger">
            待收: ¥{(record.totalAmount - record.paidAmount).toLocaleString()}
          </Text>
          <Progress 
            percent={Math.round((record.paidAmount / record.totalAmount) * 100)} 
            size="small"
            status={record.status === 'overdue' ? 'exception' : undefined}
          />
        </Space>
      ),
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date: string) => {
        const isOverdue = new Date(date) < new Date();
        return (
          <Tag icon={<ClockCircleOutlined />} color={isOverdue ? 'error' : 'default'}>
            {date}
          </Tag>
        );
      },
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const option = typeOptions.find(t => t.value === type);
        return <Tag>{option?.label}</Tag>;
      },
      filters: typeOptions.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
          <Tooltip title="催收提醒">
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => handleRemind(record)}
              disabled={record.status === 'paid'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: ReceivableType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: ReceivableType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条应收账款记录吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleRemind = (record: ReceivableType) => {
    Modal.confirm({
      title: '发送催收提醒',
      content: `确定要向 ${record.customer} 发送催收提醒吗？`,
      onOk() {
        message.success('催收提醒已发送');
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
        const newReceivable = {
          key: Date.now().toString(),
          code: `AR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'unpaid',
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newReceivable]);
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
              title="应收总额"
              value={statistics.totalReceivable}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期金额"
              value={statistics.overdueAmount}
              precision={2}
              prefix={<ExclamationCircleOutlined />}
              suffix="元"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部分收款"
              value={statistics.partialCount}
              suffix="笔"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期账款"
              value={statistics.overdueCount}
              suffix="笔"
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索应收编号或客户"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['到期开始日期', '到期结束日期']} />
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
            新增应收
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
        title={editingKey ? '编辑应收' : '新增应收'}
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
                name="totalAmount"
                label="应收金额"
                rules={[{ required: true, message: '请输入应收金额' }]}
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
                name="paidAmount"
                label="已收金额"
                rules={[{ required: true, message: '请输入已收金额' }]}
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
                name="type"
                label="款项类型"
                rules={[{ required: true, message: '请选择款项类型' }]}
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
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="到期日期"
                rules={[{ required: true, message: '请选择到期日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
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

export default ReceivableList; 