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
  Timeline,
  Typography,
  Upload,
  Divider,
  Steps,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface ComplaintType {
  key: string;
  code: string;
  title: string;
  customer: string;
  contact: string;
  type: string;
  priority: string;
  status: string;
  product: string;
  description: string;
  solution: string;
  attachments: string[];
  handler: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  history: {
    time: string;
    operator: string;
    action: string;
    content: string;
  }[];
}

const ComplaintList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintType | null>(null);

  // 模拟数据
  const mockData: ComplaintType[] = [
    {
      key: '1',
      code: 'CP202403001',
      title: '系统响应缓慢',
      customer: '阿里巴巴',
      contact: '张经理',
      type: 'system',
      priority: 'high',
      status: 'processing',
      product: 'ERP系统基础版',
      description: '系统在高并发时响应严重延迟',
      solution: '正在进行系统性能优化',
      attachments: ['error_log.txt'],
      handler: '李工程师',
      createdAt: '2024-03-20 14:30',
      updatedAt: '2024-03-20 15:00',
      deadline: '2024-03-21 14:30',
      history: [
        {
          time: '2024-03-20 14:30',
          operator: '张经理',
          action: 'create',
          content: '提交投诉',
        },
        {
          time: '2024-03-20 14:35',
          operator: '系统',
          action: 'assign',
          content: '分配给李工程师',
        },
        {
          time: '2024-03-20 15:00',
          operator: '李工程师',
          action: 'process',
          content: '开始处理问题',
        },
      ],
    },
    // ... 可以添加更多模拟数据
  ];

  const [dataSource, setDataSource] = useState<ComplaintType[]>(mockData);

  const typeOptions = [
    { label: '系统问题', value: 'system', color: 'blue' },
    { label: '服务问题', value: 'service', color: 'green' },
    { label: '产品质量', value: 'quality', color: 'orange' },
    { label: '其他问题', value: 'other', color: 'default' },
  ];

  const priorityOptions = [
    { label: '高', value: 'high', color: 'red' },
    { label: '中', value: 'medium', color: 'orange' },
    { label: '低', value: 'low', color: 'blue' },
  ];

  const statusOptions = [
    { label: '待处理', value: 'pending', color: 'default' },
    { label: '处理中', value: 'processing', color: 'processing' },
    { label: '待反馈', value: 'feedback', color: 'warning' },
    { label: '已解决', value: 'resolved', color: 'success' },
    { label: '已关闭', value: 'closed', color: 'default' },
  ];

  const columns: ColumnsType<ComplaintType> = [
    // ... 表格列配置
  ];

  // 处理投诉状态变更
  const handleStatusChange = (record: ComplaintType, newStatus: string) => {
    Modal.confirm({
      title: '确认操作',
      content: `确定要将投诉状态更改为"${statusOptions.find(s => s.value === newStatus)?.label}"吗？`,
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? {
                  ...item,
                  status: newStatus,
                  updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
                  history: [
                    ...item.history,
                    {
                      time: new Date().toISOString().split('.')[0].replace('T', ' '),
                      operator: '当前用户',
                      action: 'status',
                      content: `更改状态为：${statusOptions.find(s => s.value === newStatus)?.label}`,
                    },
                  ],
                }
              : item
          )
        );
        message.success('状态更新成功');
      },
    });
  };

  // 处理表单提交
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
                  updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
                  history: [
                    ...item.history,
                    {
                      time: new Date().toISOString().split('.')[0].replace('T', ' '),
                      operator: '当前用户',
                      action: 'update',
                      content: '更新投诉信息',
                    },
                  ],
                }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newComplaint = {
          key: Date.now().toString(),
          code: `CP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          status: 'pending',
          history: [
            {
              time: new Date().toISOString().split('.')[0].replace('T', ' '),
              operator: '当前用户',
              action: 'create',
              content: '创建投诉',
            },
          ],
          createdAt: new Date().toISOString().split('.')[0].replace('T', ' '),
          updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
        };
        setDataSource([...dataSource, newComplaint]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      {/* 搜索和过滤区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索投诉编号或内容"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="投诉类型"
              style={{ width: 120 }}
              allowClear
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="优先级"
              style={{ width: 120 }}
              allowClear
            >
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              style={{ width: 120 }}
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
            新建投诉
          </Button>
        </Col>
      </Row>

      {/* 投诉列表 */}
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

      {/* 新建/编辑投诉表单 */}
      <Modal
        title={editingKey ? '编辑投诉' : '新建投诉'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ priority: 'medium' }}
        >
          {/* 表单内容 */}
        </Form>
      </Modal>

      {/* 投诉详情 */}
      <Modal
        title="投诉详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedComplaint && (
          <div>
            {/* 详情内容 */}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ComplaintList; 