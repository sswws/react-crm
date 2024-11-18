import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Timeline,
  Typography,
  Tooltip,
  Badge,
  Progress,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CommentOutlined,
  DollarOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

// 审批记录类型
interface ApprovalRecord {
  key: string;
  type: string;
  title: string;
  requestor: string;
  department: string;
  amount: number;
  reason: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  approvers: string[];
  comments: {
    user: string;
    content: string;
    time: string;
    action: 'approve' | 'reject' | 'comment';
  }[];
  createdAt: string;
  updatedAt: string;
}

// 添加新的审批类型
const approvalTypes = {
  contract: { label: '合同审批', color: 'blue' },
  quote: { label: '报价审批', color: 'green' },
  discount: { label: '折扣审批', color: 'orange' },
  refund: { label: '退款审批', color: 'red' },
};

const ApprovalManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contract');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: ApprovalRecord[] = [
    {
      key: '1',
      type: 'contract',
      title: '阿里巴巴采购合同审批',
      requestor: '张三',
      department: '销售部',
      amount: 500000,
      reason: '客户采购ERP系统',
      status: 'pending',
      currentStep: 2,
      totalSteps: 3,
      approvers: ['部门经理', '财务总监', '总经理'],
      comments: [
        {
          user: '部门经理',
          content: '同意，请财务审核',
          time: '2024-03-20 14:30',
          action: 'approve',
        },
      ],
      createdAt: '2024-03-20 10:00',
      updatedAt: '2024-03-20 14:30',
    },
    {
      key: '2',
      type: 'quote',
      title: '阿里巴巴ERP系统报价审批',
      requestor: '李四',
      department: '销售部',
      amount: 500000,
      reason: '客户要求优惠价格',
      status: 'pending',
      currentStep: 1,
      totalSteps: 2,
      approvers: ['销售经理', '财务总监'],
      comments: [],
      createdAt: '2024-03-21 10:00',
      updatedAt: '2024-03-21 10:00',
    },
    {
      key: '3',
      type: 'discount',
      title: '腾讯大客户折扣审批',
      requestor: '王五',
      department: '销售部',
      amount: 100000,
      reason: '战略客户优惠政策',
      status: 'pending',
      currentStep: 1,
      totalSteps: 3,
      approvers: ['销售经理', '财务总监', '总经理'],
      comments: [],
      createdAt: '2024-03-21 11:00',
      updatedAt: '2024-03-21 11:00',
    },
    {
      key: '4',
      type: 'refund',
      title: '华为项目退款申请',
      requestor: '赵六',
      department: '客服部',
      amount: 50000,
      reason: '项目变更退款',
      status: 'pending',
      currentStep: 1,
      totalSteps: 3,
      approvers: ['客服经理', '财务经理', '财务总监'],
      comments: [],
      createdAt: '2024-03-21 14:00',
      updatedAt: '2024-03-21 14:00',
    },
  ];

  const [dataSource, setDataSource] = useState<ApprovalRecord[]>(mockData);

  const statusOptions = [
    { label: '待审批', value: 'pending', color: 'processing' },
    { label: '已通过', value: 'approved', color: 'success' },
    { label: '已拒绝', value: 'rejected', color: 'error' },
    { label: '已撤回', value: 'withdrawn', color: 'default' },
  ];

  const columns: ColumnsType<ApprovalRecord> = [
    {
      title: '审批信息',
      key: 'info',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FileTextOutlined />
            <Text strong>{record.title}</Text>
          </Space>
          <Space>
            <UserOutlined />
            <Text>{record.requestor}</Text>
            <Tag>{record.department}</Tag>
          </Space>
          <Text type="secondary">申请时间：{record.createdAt}</Text>
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
      title: '状态',
      key: 'status',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusOptions.find(s => s.value === record.status)?.color}>
            {statusOptions.find(s => s.value === record.status)?.label}
          </Tag>
          <Progress 
            percent={Math.round((record.currentStep / record.totalSteps) * 100)}
            size="small"
            style={{ marginTop: 8 }}
          />
          <Text type="secondary">
            当前审批：{record.approvers[record.currentStep - 1]}
          </Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            disabled={record.status !== 'pending'}
          >
            同意
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleReject(record)}
            disabled={record.status !== 'pending'}
          >
            拒绝
          </Button>
          <Button
            type="link"
            icon={<CommentOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  const handleApprove = (record: ApprovalRecord) => {
    Modal.confirm({
      title: '确认审批',
      content: '确定要同意这个审批申请吗？',
      onOk: () => {
        setDataSource(dataSource.map(item => {
          if (item.key === record.key) {
            const newCurrentStep = item.currentStep + 1;
            return {
              ...item,
              currentStep: newCurrentStep,
              status: newCurrentStep > item.totalSteps ? 'approved' : 'pending',
              comments: [
                ...item.comments,
                {
                  user: '当前用户',
                  content: '同意',
                  time: new Date().toLocaleString(),
                  action: 'approve',
                },
              ],
              updatedAt: new Date().toLocaleString(),
            };
          }
          return item;
        }));
        message.success('审批成功');
      },
    });
  };

  const handleReject = (record: ApprovalRecord) => {
    Modal.confirm({
      title: '确认拒绝',
      content: '确定要拒绝这个审批申请吗？',
      onOk: () => {
        setDataSource(dataSource.map(item => {
          if (item.key === record.key) {
            return {
              ...item,
              status: 'rejected',
              comments: [
                ...item.comments,
                {
                  user: '当前用户',
                  content: '拒绝',
                  time: new Date().toLocaleString(),
                  action: 'reject',
                },
              ],
              updatedAt: new Date().toLocaleString(),
            };
          }
          return item;
        }));
        message.success('已拒绝');
      },
    });
  };

  const handleViewDetail = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setEditingKey('');
    setIsModalVisible(true);
  };

  // 修改表单配置
  const getFormConfig = (type: string) => {
    const commonFields = [
      {
        name: 'title',
        label: '审批标题',
        rules: [{ required: true, message: '请输入审批标题' }],
        component: <Input />,
      },
      {
        name: 'amount',
        label: '金额',
        rules: [{ required: true, message: '请输入金额' }],
        component: (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
          />
        ),
      },
      {
        name: 'reason',
        label: '申请原因',
        rules: [{ required: true, message: '请输入申请原因' }],
        component: <TextArea rows={4} />,
      },
    ];

    const typeSpecificFields = {
      quote: [
        {
          name: 'validityPeriod',
          label: '报价有效期',
          rules: [{ required: true, message: '请选择报价有效期' }],
          component: <DatePicker style={{ width: '100%' }} />,
        },
      ],
      discount: [
        {
          name: 'discountRate',
          label: '折扣率',
          rules: [{ required: true, message: '请输入折扣率' }],
          component: (
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value): 0 | 100 => {
                const parsed = value ? Number(value.replace('%', '')) : 0;
                if (parsed <= 0) return 0;
                if (parsed >= 100) return 100;
                // 将中间值四舍五入到最接近的整数
                const rounded = Math.round(parsed);
                // 确保返回类型为 0 | 100
                return rounded <= 0 ? 0 : rounded >= 100 ? 100 : 0;
              }}
            />
          ),
        },
      ],
      refund: [
        {
          name: 'refundType',
          label: '退款类型',
          rules: [{ required: true, message: '请选择退款类型' }],
          component: (
            <Select>
              <Option value="full">全额退款</Option>
              <Option value="partial">部分退款</Option>
            </Select>
          ),
        },
        {
          name: 'refundReason',
          label: '退款原因',
          rules: [{ required: true, message: '请选择退款原因' }],
          component: (
            <Select>
              <Option value="quality">质量问题</Option>
              <Option value="service">服务问题</Option>
              <Option value="change">需求变更</Option>
              <Option value="other">其他原因</Option>
            </Select>
          ),
        },
      ],
    };

    return [...commonFields, ...(typeSpecificFields[type as keyof typeof typeSpecificFields] || [])];
  };

  // 添加 handleSubmit 函数
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
                  updatedAt: new Date().toLocaleString(),
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newApproval = {
          key: Date.now().toString(),
          ...values,
          currentStep: 1,
          comments: [],
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };
        setDataSource([...dataSource, newApproval]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'contract',
            label: (
              <span>
                <FileTextOutlined />
                合同审批
              </span>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={dataSource.filter(item => item.type === 'contract')}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            ),
          },
          {
            key: 'quote',
            label: (
              <span>
                <DollarOutlined />
                报价审批
              </span>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={dataSource.filter(item => item.type === 'quote')}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            ),
          },
          {
            key: 'discount',
            label: (
              <span>
                <DollarOutlined />
                折扣审批
              </span>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={dataSource.filter(item => item.type === 'discount')}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            ),
          },
          {
            key: 'refund',
            label: (
              <span>
                <RollbackOutlined />
                退款审批
              </span>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={dataSource.filter(item => item.type === 'refund')}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            ),
          },
        ]}
      />

      <Modal
        title={selectedRecord ? '编辑审批' : '新增审批'}
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
          <Form.Item
            name="type"
            label="审批类型"
            rules={[{ required: true, message: '请选择审批类型' }]}
          >
            <Select>
              {Object.entries(approvalTypes).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {form.getFieldValue('type') && getFormConfig(form.getFieldValue('type')).map(field => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              {field.component}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </Card>
  );
};

export default ApprovalManagement; 