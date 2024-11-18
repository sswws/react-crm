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
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface CampaignType {
  key: string;
  name: string;
  type: string;
  channel: string;
  budget: number;
  cost: number;
  startDate: string;
  endDate: string;
  status: string;
  target: {
    leads: number;
    achieved: number;
  };
  performance: {
    views: number;
    clicks: number;
    conversions: number;
  };
  owner: string;
  createdAt: string;
  updatedAt: string;
}

const CampaignList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: CampaignType[] = [
    {
      key: '1',
      name: '2024春季促销活动',
      type: 'promotion',
      channel: 'social',
      budget: 50000,
      cost: 35000,
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      target: {
        leads: 1000,
        achieved: 750,
      },
      performance: {
        views: 100000,
        clicks: 5000,
        conversions: 750,
      },
      owner: '张三',
      createdAt: '2024-02-25',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      name: '新产品发布会',
      type: 'event',
      channel: 'offline',
      budget: 100000,
      cost: 80000,
      startDate: '2024-04-15',
      endDate: '2024-04-15',
      status: 'planned',
      target: {
        leads: 500,
        achieved: 0,
      },
      performance: {
        views: 0,
        clicks: 0,
        conversions: 0,
      },
      owner: '李四',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<CampaignType[]>(mockData);

  const campaignTypes = [
    { label: '促销活动', value: 'promotion' },
    { label: '品牌推广', value: 'branding' },
    { label: '产品发布', value: 'product' },
    { label: '线下活动', value: 'event' },
    { label: '内容营销', value: 'content' },
  ];

  const channelOptions = [
    { label: '社交媒体', value: 'social' },
    { label: '搜索引擎', value: 'search' },
    { label: '电子邮件', value: 'email' },
    { label: '线下活动', value: 'offline' },
    { label: '展会', value: 'exhibition' },
  ];

  const statusOptions = [
    { label: '计划中', value: 'planned', color: 'default' },
    { label: '进行中', value: 'active', color: 'processing' },
    { label: '已暂停', value: 'paused', color: 'warning' },
    { label: '已完成', value: 'completed', color: 'success' },
    { label: '已终止', value: 'terminated', color: 'error' },
  ];

  const columns: ColumnsType<CampaignType> = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const option = campaignTypes.find(t => t.value === type);
        return <Tag>{option?.label}</Tag>;
      },
      filters: campaignTypes.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 120,
      render: (channel: string) => {
        const option = channelOptions.find(c => c.value === channel);
        return <Tag>{option?.label}</Tag>;
      },
      filters: channelOptions.map(channel => ({ text: channel.label, value: channel.value })),
      onFilter: (value: any, record) => record.channel === value,
    },
    {
      title: '预算/支出',
      key: 'budget',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>预算: ¥{record.budget.toLocaleString()}</Text>
          <Text type={record.cost > record.budget ? 'danger' : 'success'}>
            支出: ¥{record.cost.toLocaleString()}
          </Text>
        </Space>
      ),
    },
    {
      title: '目标完成度',
      key: 'target',
      width: 150,
      render: (_, record) => {
        const percentage = Math.round((record.target.achieved / record.target.leads) * 100);
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Progress percent={percentage} size="small" />
            <Text type="secondary">
              {record.target.achieved}/{record.target.leads}
            </Text>
          </Space>
        );
      },
    },
    {
      title: '活动时间',
      key: 'period',
      width: 200,
      render: (_, record) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
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
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
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
          {record.status === 'active' ? (
            <Tooltip title="暂停">
              <Button
                type="text"
                icon={<PauseCircleOutlined />}
                onClick={() => handleStatusChange(record, 'paused')}
              />
            </Tooltip>
          ) : record.status === 'paused' ? (
            <Tooltip title="继续">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStatusChange(record, 'active')}
              />
            </Tooltip>
          ) : null}
          <Tooltip title="终止">
            <Button
              type="text"
              danger
              icon={<StopOutlined />}
              onClick={() => handleStatusChange(record, 'terminated')}
              disabled={['completed', 'terminated'].includes(record.status)}
            />
          </Tooltip>
          <Tooltip title="数据分析">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => handleAnalytics(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: CampaignType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: CampaignType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个营销活动吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleStatusChange = (record: CampaignType, status: string) => {
    const statusMap = {
      paused: '暂停',
      active: '继续',
      terminated: '终止',
    };
    Modal.confirm({
      title: `确认${statusMap[status as keyof typeof statusMap]}`,
      content: `确定要${statusMap[status as keyof typeof statusMap]}这个营销活动吗？`,
      onOk() {
        setDataSource(
          dataSource.map(item =>
            item.key === record.key
              ? { ...item, status, updatedAt: new Date().toISOString().split('T')[0] }
              : item
          )
        );
        message.success('操作成功');
      },
    });
  };

  const handleAnalytics = (record: CampaignType) => {
    message.info(`查看活动数据分析: ${record.name}`);
    // 实现数据分析功能或跳转到数据分析页面
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
        const newCampaign = {
          key: Date.now().toString(),
          ...values,
          status: 'planned',
          target: {
            leads: values.targetLeads,
            achieved: 0,
          },
          performance: {
            views: 0,
            clicks: 0,
            conversions: 0,
          },
          cost: 0,
          owner: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newCampaign]);
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
              placeholder="搜索活动名称"
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
            新建活动
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
        title={editingKey ? '编辑活动' : '新建活动'}
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
                name="name"
                label="活动名称"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="活动类型"
                rules={[{ required: true, message: '请选择活动类型' }]}
              >
                <Select>
                  {campaignTypes.map(option => (
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
                name="channel"
                label="营销渠道"
                rules={[{ required: true, message: '请选择营销渠道' }]}
              >
                <Select>
                  {channelOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="活动预算"
                rules={[{ required: true, message: '请输入活动预算' }]}
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
                name={['period', 'range']}
                label="活动时间"
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="targetLeads"
                label="目标线索数"
                rules={[{ required: true, message: '请输入目标线索数' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="活动描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CampaignList; 