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
  Upload,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UploadOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ContractType {
  key: string;
  code: string;
  name: string;
  customer: string;
  amount: number;
  signDate: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  paymentStatus: string;
  attachments: string[];
  remark: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const ContractList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: ContractType[] = [
    {
      key: '1',
      code: 'CT202403001',
      name: '企业ERP系统采购合同',
      customer: '阿里巴巴',
      amount: 500000,
      signDate: '2024-03-15',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      type: 'purchase',
      status: 'active',
      paymentStatus: 'partial',
      attachments: ['contract.pdf'],
      remark: '包含一年维保服务',
      createdBy: '张三',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      key: '2',
      code: 'CT202403002',
      name: '数据中心建设合同',
      customer: '腾讯',
      amount: 1200000,
      signDate: '2024-03-18',
      startDate: '2024-05-01',
      endDate: '2024-12-31',
      type: 'service',
      status: 'pending',
      paymentStatus: 'unpaid',
      attachments: ['contract.pdf', 'appendix.pdf'],
      remark: '分三期交付',
      createdBy: '李四',
      createdAt: '2024-03-18',
      updatedAt: '2024-03-18',
    },
  ];

  const [dataSource, setDataSource] = useState<ContractType[]>(mockData);

  const contractTypes = [
    { label: '采购合同', value: 'purchase' },
    { label: '服务合同', value: 'service' },
    { label: '代理合同', value: 'agency' },
    { label: '技术合同', value: 'technology' },
  ];

  const statusOptions = [
    { label: '执行中', value: 'active', color: 'green' },
    { label: '待审核', value: 'pending', color: 'orange' },
    { label: '已完成', value: 'completed', color: 'blue' },
    { label: '已终止', value: 'terminated', color: 'red' },
  ];

  const paymentStatusOptions = [
    { label: '未支付', value: 'unpaid', color: 'default' },
    { label: '部分支付', value: 'partial', color: 'orange' },
    { label: '已支付', value: 'paid', color: 'green' },
  ];

  const columns: ColumnsType<ContractType> = [
    {
      title: '合同编号',
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
      title: '合同名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: '合同金额',
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
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const option = contractTypes.find(t => t.value === type);
        return <Tag>{option?.label}</Tag>;
      },
      filters: contractTypes.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: '合同状态',
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
      title: '付款状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => {
        const option = paymentStatusOptions.find(s => s.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
      filters: paymentStatusOptions.map(status => ({ text: status.label, value: status.value })),
      onFilter: (value: any, record) => record.paymentStatus === value,
    },
    {
      title: '签订日期',
      dataIndex: 'signDate',
      key: 'signDate',
      width: 120,
      sorter: (a, b) => new Date(a.signDate).getTime() - new Date(b.signDate).getTime(),
    },
    {
      title: '合同期限',
      key: 'period',
      width: 200,
      render: (_, record) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
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
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
          <Tooltip title="打印">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          <Tooltip title="审核">
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(record)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: ContractType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个合同吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== key));
        message.success('删除成功');
      },
    });
  };

  const handlePrint = (record: ContractType) => {
    message.info(`打印合同: ${record.name}`);
    // 实现打印功能
  };

  const handleApprove = (record: ContractType) => {
    Modal.confirm({
      title: '确认审核',
      content: '确定要审核通过这个合同吗？',
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? { ...item, status: 'active', updatedAt: new Date().toISOString().split('T')[0] }
              : item
          )
        );
        message.success('审核成功');
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
        const newContract = {
          key: Date.now().toString(),
          code: `CT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newContract]);
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
              placeholder="搜索合同编号或名称"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['签订开始日期', '签订结束日期']} />
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
            新增合同
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
        title={editingKey ? '编辑合同' : '新增合同'}
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
            type: 'purchase',
            status: 'pending',
            paymentStatus: 'unpaid',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="合同名称"
                rules={[{ required: true, message: '请输入合同名称' }]}
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
                name="amount"
                label="合同金额"
                rules={[{ required: true, message: '请输入合同金额' }]}
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
                name="type"
                label="合同类型"
                rules={[{ required: true, message: '请选择合同类型' }]}
              >
                <Select>
                  {contractTypes.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="signDate"
                label="签订日期"
                rules={[{ required: true, message: '请选择签订日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['period', 'range']}
                label="合同期限"
                rules={[{ required: true, message: '请选择合同期限' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="合同状态"
                rules={[{ required: true, message: '请选择合同状态' }]}
              >
                <Select>
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentStatus"
                label="付款状态"
                rules={[{ required: true, message: '请选择付款状态' }]}
              >
                <Select>
                  {paymentStatusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="attachments"
            label="合同附件"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
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

export default ContractList; 