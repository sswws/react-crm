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
  Upload,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface InvoiceType {
  key: string;
  code: string;
  customer: string;
  contract: string;
  amount: number;
  type: string;
  title: string;
  taxNumber: string;
  status: string;
  remark: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 添加发票类型接口
interface InvoiceTypeOption {
  label: string;
  value: string;
}

// 修改 PrintPreview 组件的 props 类型
interface PrintPreviewProps {
  invoice: InvoiceType;
  visible: boolean;
  onClose: () => void;
  invoiceTypes: InvoiceTypeOption[];
}

// 添加打印预览模态框组件
const PrintPreview: React.FC<PrintPreviewProps> = ({
  invoice,
  visible,
  onClose,
  invoiceTypes,
}) => {
  const printContent = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printContent.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>发票打印预览</title>
              <style>
                body { font-family: Arial, sans-serif; }
                .invoice-header { text-align: center; margin-bottom: 20px; }
                .invoice-title { font-size: 24px; font-weight: bold; }
                .invoice-info { margin: 20px 0; }
                .invoice-info table { width: 100%; border-collapse: collapse; }
                .invoice-info td { padding: 8px; border: 1px solid #ddd; }
                .invoice-footer { margin-top: 40px; }
                .text-right { text-align: right; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${content.innerHTML}
              <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">打印</button>
                <button onclick="window.close()">关闭</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <Modal
      title="发票打印预览"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          打印
        </Button>,
      ]}
    >
      <div ref={printContent}>
        <div className="invoice-header">
          <h1 className="invoice-title">发票</h1>
          <p>发票编号：{invoice.code}</p>
        </div>
        <div className="invoice-info">
          <table>
            <tbody>
              <tr>
                <td width="120">开票日期：</td>
                <td>{invoice.createdAt}</td>
                <td width="120">发票类型：</td>
                <td>{invoiceTypes.find(t => t.value === invoice.type)?.label}</td>
              </tr>
              <tr>
                <td>购买方：</td>
                <td colSpan={3}>{invoice.title}</td>
              </tr>
              <tr>
                <td>纳税人识别号：</td>
                <td colSpan={3}>{invoice.taxNumber}</td>
              </tr>
              <tr>
                <td>关联合同：</td>
                <td colSpan={3}>{invoice.contract}</td>
              </tr>
              <tr>
                <td>金额：</td>
                <td colSpan={3} className="text-right">
                  ¥{invoice.amount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>备注：</td>
                <td colSpan={3}>{invoice.remark}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="invoice-footer">
          <p>开票人：{invoice.createdBy}</p>
          <p>开票时间：{invoice.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
};

const InvoiceList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);

  // 模拟数据
  const mockData: InvoiceType[] = [
    {
      key: '1',
      code: 'INV202403001',
      customer: '阿里巴巴',
      contract: 'CT202403001',
      amount: 500000,
      type: 'special',
      title: '阿里巴巴（中国）有限公司',
      taxNumber: '91330100799655058B',
      status: 'pending',
      remark: '项目首付款发票',
      attachments: [],
      createdBy: '张三',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
    },
    // ... 可以添加更多模拟数据
  ];

  const [dataSource, setDataSource] = useState<InvoiceType[]>(mockData);

  // 定义发票类型选项
  const invoiceTypes: InvoiceTypeOption[] = [
    { label: '增值税专用发票', value: 'special' },
    { label: '增值税普通发票', value: 'normal' },
    { label: '电子发票', value: 'electronic' },
  ];

  const statusOptions = [
    { label: '待开票', value: 'pending', color: 'warning' },
    { label: '已开票', value: 'issued', color: 'success' },
    { label: '已作废', value: 'cancelled', color: 'error' },
  ];

  // 表格列定义
  const columns: ColumnsType<InvoiceType> = [
    {
      title: '开票信息',
      key: 'info',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FileTextOutlined />
            <Text strong>{record.code}</Text>
          </Space>
          <Text>{record.title}</Text>
          <Tag>{invoiceTypes.find(t => t.value === record.type)?.label}</Tag>
        </Space>
      ),
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.customer}</Text>
          <Text type="secondary">{record.taxNumber}</Text>
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <Text type="danger">¥{amount.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '关联合同',
      dataIndex: 'contract',
      key: 'contract',
      width: 120,
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
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
          <Tooltip title="打印">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: InvoiceType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: InvoiceType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个发票吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handlePrint = (record: InvoiceType) => {
    setSelectedInvoice(record);
    setPrintModalVisible(true);
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
        const newInvoice = {
          key: Date.now().toString(),
          code: `INV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'pending',
          createdBy: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newInvoice]);
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
              placeholder="搜索发票号或客户"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <RangePicker placeholder={['开始日期', '结束日期']} />
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
            开具发票
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
        title={editingKey ? '编辑发票' : '开具发票'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'pending' }}
        >
          {/* 表单内容 */}
        </Form>
      </Modal>

      {/* 添加打印预览模态框 */}
      {selectedInvoice && (
        <PrintPreview
          invoice={selectedInvoice}
          visible={printModalVisible}
          onClose={() => {
            setPrintModalVisible(false);
            setSelectedInvoice(null);
          }}
          invoiceTypes={invoiceTypes}
        />
      )}
    </Card>
  );
};

export default InvoiceList; 