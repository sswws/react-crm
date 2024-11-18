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
  Progress,
  Typography,
  Rate,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  BarChartOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface SurveyType {
  key: string;
  title: string;
  customer: string;
  contact: string;
  service: string;
  type: string;
  status: string;
  score: number;
  feedback: string;
  response: {
    satisfaction: number;
    quality: number;
    timeliness: number;
    attitude: number;
  };
  createdAt: string;
  respondedAt: string;
}

const SatisfactionSurvey: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyType | null>(null);

  // 模拟数据
  const mockData: SurveyType[] = [
    {
      key: '1',
      title: '产品实施满意度调查',
      customer: '阿里巴巴',
      contact: '张经理',
      service: 'ERP系统实施',
      type: 'implementation',
      status: 'responded',
      score: 4.5,
      feedback: '整体实施过程专业，进度控制良好',
      response: {
        satisfaction: 5,
        quality: 4,
        timeliness: 4,
        attitude: 5,
      },
      createdAt: '2024-03-20',
      respondedAt: '2024-03-21',
    },
    {
      key: '2',
      title: '技术支持服务评价',
      customer: '腾讯',
      contact: '李总',
      service: '技术支持服务',
      type: 'support',
      status: 'pending',
      score: 0,
      feedback: '',
      response: {
        satisfaction: 0,
        quality: 0,
        timeliness: 0,
        attitude: 0,
      },
      createdAt: '2024-03-21',
      respondedAt: '',
    },
  ];

  const [dataSource, setDataSource] = useState<SurveyType[]>(mockData);

  // 计算总体满意度统计
  const statistics = {
    totalCount: dataSource.length,
    respondedCount: dataSource.filter(item => item.status === 'responded').length,
    averageScore: dataSource.reduce((sum, item) => sum + item.score, 0) / dataSource.filter(item => item.status === 'responded').length,
    satisfactionRate: (dataSource.filter(item => item.score >= 4).length / dataSource.filter(item => item.status === 'responded').length) * 100,
  };

  const typeOptions = [
    { label: '实施服务', value: 'implementation' },
    { label: '技术支持', value: 'support' },
    { label: '培训服务', value: 'training' },
    { label: '咨询服务', value: 'consulting' },
  ];

  const statusOptions = [
    { label: '待回复', value: 'pending', color: 'warning' },
    { label: '已回复', value: 'responded', color: 'success' },
    { label: '已过期', value: 'expired', color: 'default' },
  ];

  const columns: ColumnsType<SurveyType> = [
    {
      title: '调查信息',
      key: 'info',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
          <Tag>{typeOptions.find(t => t.value === record.type)?.label}</Tag>
          <Text type="secondary">{record.service}</Text>
        </Space>
      ),
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.customer}</Text>
          <Text type="secondary">{record.contact}</Text>
        </Space>
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
      title: '评分',
      key: 'score',
      width: 150,
      render: (_, record) => (
        record.status === 'responded' ? (
          <Space>
            <Rate disabled defaultValue={record.score} />
            <Text strong>{record.score}分</Text>
          </Space>
        ) : (
          <Text type="secondary">未评价</Text>
        )
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: '反馈内容',
      dataIndex: 'feedback',
      key: 'feedback',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '回复时间',
      dataIndex: 'respondedAt',
      key: 'respondedAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<BarChartOutlined />}
            onClick={() => {
              setSelectedSurvey(record);
              setIsViewModalVisible(true);
            }}
          >
            查看详情
          </Button>
          <Button
            type="link"
            icon={<SendOutlined />}
            onClick={() => handleResend(record)}
            disabled={record.status === 'responded'}
          >
            重发问卷
          </Button>
        </Space>
      ),
    },
  ];

  const handleResend = (record: SurveyType) => {
    Modal.confirm({
      title: '确认重发',
      content: '确定要重新发送这份满意度调查问卷吗？',
      onOk() {
        message.success('问卷已重新发送');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newSurvey = {
        key: Date.now().toString(),
        ...values,
        status: 'pending',
        score: 0,
        feedback: '',
        response: {
          satisfaction: 0,
          quality: 0,
          timeliness: 0,
          attitude: 0,
        },
        createdAt: new Date().toISOString().split('T')[0],
        respondedAt: '',
      };
      setDataSource([...dataSource, newSurvey]);
      message.success('创建成功');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总调查数"
              value={statistics.totalCount}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="回复率"
              value={Math.round((statistics.respondedCount / statistics.totalCount) * 100)}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={statistics.averageScore.toFixed(1)}
              prefix={<Rate count={1} defaultValue={1} disabled />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="满意度"
              value={Math.round(statistics.satisfactionRate)}
              suffix="%"
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜索客户名称或标题"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="选择类型"
              style={{ width: 150 }}
              allowClear
            >
              {typeOptions.map(option => (
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
              setIsModalVisible(true);
            }}
          >
            新建调查
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
        title="新建满意度调查"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="调查标题"
            rules={[{ required: true, message: '请输入调查标题' }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="调查类型"
                rules={[{ required: true, message: '请选择调查类型' }]}
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
                name="service"
                label="服务内容"
                rules={[{ required: true, message: '请输入服务内容' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="调查详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSurvey && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="基本信息">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text>客户：{selectedSurvey.customer}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>联系人：{selectedSurvey.contact}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Text>服务内容：{selectedSurvey.service}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>调查类型：{typeOptions.find(t => t.value === selectedSurvey.type)?.label}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {selectedSurvey.status === 'responded' && (
                <>
                  <Col span={24}>
                    <Card title="评分详情">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Text>整体满意度</Text>
                          <Rate disabled value={selectedSurvey.response.satisfaction} />
                        </Col>
                        <Col span={12}>
                          <Text>服务质量</Text>
                          <Rate disabled value={selectedSurvey.response.quality} />
                        </Col>
                      </Row>
                      <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                          <Text>响应及时性</Text>
                          <Rate disabled value={selectedSurvey.response.timeliness} />
                        </Col>
                        <Col span={12}>
                          <Text>服务态度</Text>
                          <Rate disabled value={selectedSurvey.response.attitude} />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="反馈意见">
                      <Text>{selectedSurvey.feedback || '无'}</Text>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default SatisfactionSurvey; 