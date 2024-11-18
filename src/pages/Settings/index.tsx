import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Space,
  Select,
  Upload,
  message,
  Row,
  Col,
  Typography,
  Divider,
  DatePicker,
  Table,
  Tag,
  Statistic,
  Descriptions,
  Progress,
  List,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  GlobalOutlined,
  MailOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  CloudUploadOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  WechatOutlined,
  DingdingOutlined,
  MessageOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 添加系统日志接口
interface LogType {
  key: string;
  type: string;
  action: string;
  user: string;
  ip: string;
  timestamp: string;
  details: string;
}

// 添加备份记录接口
interface BackupType {
  key: string;
  name: string;
  size: number;
  type: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 基本设置表单
  const [basicForm] = Form.useForm();
  // 邮件设置表单
  const [emailForm] = Form.useForm();
  // 安全设置表单
  const [securityForm] = Form.useForm();
  // 通知设置表单
  const [notificationForm] = Form.useForm();
  // 存储设置表单
  const [storageForm] = Form.useForm();

  // 添加系统日志和备份状态
  const [logs] = useState<LogType[]>([
    {
      key: '1',
      type: 'user',
      action: '用户登录',
      user: '张三',
      ip: '192.168.1.1',
      timestamp: '2024-03-20 14:30:00',
      details: '用户登录成功',
    },
    {
      key: '2',
      type: 'system',
      action: '系统配置修改',
      user: '管理员',
      ip: '192.168.1.2',
      timestamp: '2024-03-20 15:00:00',
      details: '修改了邮件服务器配置',
    },
  ]);

  const [backups] = useState<BackupType[]>([
    {
      key: '1',
      name: 'backup_20240320_143000',
      size: 1024 * 1024 * 50, // 50MB
      type: 'full',
      status: 'completed',
      createdAt: '2024-03-20 14:30:00',
      createdBy: '系统',
    },
    {
      key: '2',
      name: 'backup_20240319_143000',
      size: 1024 * 1024 * 45, // 45MB
      type: 'incremental',
      status: 'completed',
      createdAt: '2024-03-19 14:30:00',
      createdBy: '系统',
    },
  ]);

  // 系统日志表格列定义
  const logColumns: ColumnsType<LogType> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'user' ? 'blue' : 'green'}>
          {type === 'user' ? '用户操作' : '系统操作'}
        </Tag>
      ),
      filters: [
        { text: '用户操作', value: 'user' },
        { text: '系统操作', value: 'system' },
      ],
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '操作人',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
  ];

  // 备份记录表格列定义
  const backupColumns: ColumnsType<BackupType> = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / (1024 * 1024)).toFixed(2)} MB`,
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'full' ? 'blue' : 'green'}>
          {type === 'full' ? '全量备份' : '增量备份'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status === 'completed' ? '已完成' : '进行中'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">下载</Button>
          <Button type="link">恢复</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  // 处理基本设置保存
  const handleBasicSave = async () => {
    try {
      const values = await basicForm.validateFields();
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        console.log('基本设置:', values);
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  // 处理邮件设置保存
  const handleEmailSave = async () => {
    try {
      const values = await emailForm.validateFields();
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        console.log('邮件设置:', values);
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  // 测试邮件配置
  const handleTestEmail = () => {
    message.info('正在发送测试邮件...');
    setTimeout(() => {
      message.success('测试邮件发送成功');
    }, 2000);
  };

  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: (
        <span>
          <GlobalOutlined />
          基本设置
        </span>
      ),
      children: (
        <Form
          form={basicForm}
          layout="vertical"
          initialValues={{
            systemName: 'CRM系统',
            companyName: '示例公司',
            logo: undefined,
            timezone: 'Asia/Shanghai',
            language: 'zh_CN',
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="systemName"
                label="系统名称"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="logo"
            label="系统Logo"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传Logo</Button>
            </Upload>
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="timezone"
                label="系统时区"
                rules={[{ required: true, message: '请选择系统时区' }]}
              >
                <Select>
                  <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                  <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="系统语言"
                rules={[{ required: true, message: '请选择系统语言' }]}
              >
                <Select>
                  <Option value="zh_CN">简体中文</Option>
                  <Option value="en_US">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleBasicSave} loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined />
          邮件设置
        </span>
      ),
      children: (
        <Form
          form={emailForm}
          layout="vertical"
          initialValues={{
            smtpServer: '',
            smtpPort: 587,
            smtpUsername: '',
            smtpPassword: '',
            senderEmail: '',
            senderName: '',
            enableSSL: true,
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="smtpServer"
                label="SMTP服务器"
                rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
              >
                <Input placeholder="例如: smtp.example.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="smtpPort"
                label="SMTP端口"
                rules={[{ required: true, message: '请输入SMTP端口' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="smtpUsername"
                label="SMTP用户名"
                rules={[{ required: true, message: '请输入SMTP用户名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="smtpPassword"
                label="SMTP密码"
                rules={[{ required: true, message: '请输入SMTP密码' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="senderEmail"
                label="发件人邮箱"
                rules={[
                  { required: true, message: '请输入发件人邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="senderName"
                label="发件人名称"
                rules={[{ required: true, message: '请输入发件人名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="enableSSL"
            label="启用SSL"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleEmailSave} loading={loading}>
                保存设置
              </Button>
              <Button onClick={handleTestEmail}>
                发送测试邮件
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          安全设置
        </span>
      ),
      children: (
        <Form
          form={securityForm}
          layout="vertical"
          initialValues={{
            passwordMinLength: 8,
            passwordComplexity: true,
            loginAttempts: 5,
            lockoutDuration: 30,
            sessionTimeout: 120,
            enableTwoFactor: false,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="passwordMinLength"
                label="密码最小长度"
                rules={[{ required: true, message: '请设置密码最小长度' }]}
              >
                <Input type="number" min={6} max={32} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="passwordComplexity"
                label="启用密码复杂度要求"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="loginAttempts"
                label="最大登录尝试次数"
                rules={[{ required: true, message: '请设置最大登录尝试次数' }]}
              >
                <Input type="number" min={1} max={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lockoutDuration"
                label="账户锁定时长(分钟)"
                rules={[{ required: true, message: '请设置账户锁定时长' }]}
              >
                <Input type="number" min={5} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="sessionTimeout"
                label="会话超时时间(分钟)"
                rules={[{ required: true, message: '请设置会话超时时间' }]}
              >
                <Input type="number" min={5} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enableTwoFactor"
                label="启用双因素认证"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('安全设置已保存')}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'notification',
      label: (
        <span>
          <NotificationOutlined />
          通知设置
        </span>
      ),
      children: (
        <Form
          form={notificationForm}
          layout="vertical"
          initialValues={{
            enableEmailNotification: true,
            enableSystemNotification: true,
            notifyNewCustomer: true,
            notifyNewOpportunity: true,
            notifyContractSigned: true,
            notifyTaskAssigned: true,
          }}
        >
          <Form.Item
            name="enableEmailNotification"
            label="启用邮件通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="enableSystemNotification"
            label="启用系统通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Title level={5}>通知事件</Title>
          <Form.Item
            name="notifyNewCustomer"
            label="新客户创建"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="notifyNewOpportunity"
            label="新商机创建"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="notifyContractSigned"
            label="合同签订"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="notifyTaskAssigned"
            label="任务分配"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('通知设置已保存')}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'storage',
      label: (
        <span>
          <CloudUploadOutlined />
          存储设置
        </span>
      ),
      children: (
        <Form
          form={storageForm}
          layout="vertical"
          initialValues={{
            storageType: 'local',
            maxFileSize: 10,
            allowedFileTypes: ['image/*', 'application/pdf'],
            compressionEnabled: true,
          }}
        >
          <Form.Item
            name="storageType"
            label="存储方式"
            rules={[{ required: true, message: '请选择存储方式' }]}
          >
            <Select>
              <Option value="local">本地存储</Option>
              <Option value="oss">阿里云OSS</Option>
              <Option value="cos">腾讯云COS</Option>
              <Option value="s3">亚马逊S3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="maxFileSize"
            label="最大文件大小(MB)"
            rules={[{ required: true, message: '请设置最大文件大小' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="allowedFileTypes"
            label="允许的文件类型"
            rules={[{ required: true, message: '请选择允许的文件类型' }]}
          >
            <Select mode="multiple">
              <Option value="image/*">图片</Option>
              <Option value="application/pdf">PDF文档</Option>
              <Option value="application/msword">Word文档</Option>
              <Option value="application/vnd.ms-excel">Excel文档</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="compressionEnabled"
            label="启用图片压缩"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('存储设置已保存')}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'logs',
      label: (
        <span>
          <FileSearchOutlined />
          系统日志
        </span>
      ),
      children: (
        <div>
          <Row justify="end" style={{ marginBottom: 16 }}>
            <Space>
              <DatePicker.RangePicker showTime />
              <Select
                placeholder="选择日志类型"
                style={{ width: 150 }}
                allowClear
              >
                <Option value="user">用户操作</Option>
                <Option value="system">系统操作</Option>
              </Select>
              <Button type="primary">导出日志</Button>
            </Space>
          </Row>
          <Table
            columns={logColumns}
            dataSource={logs}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'backup',
      label: (
        <span>
          <DatabaseOutlined />
          数据备份
        </span>
      ),
      children: (
        <div>
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Space>
              <Card size="small">
                <Statistic
                  title="上次备份时间"
                  value="2024-03-20 14:30:00"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
              <Card size="small">
                <Statistic
                  title="备份总大小"
                  value="95 MB"
                  prefix={<DatabaseOutlined />}
                />
              </Card>
            </Space>
            <Space>
              <Button type="primary" icon={<DatabaseOutlined />}>
                立即备份
              </Button>
              <Button icon={<UploadOutlined />}>
                导入备份
              </Button>
            </Space>
          </Row>
          <Table
            columns={backupColumns}
            dataSource={backups}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'monitor',
      label: (
        <span>
          <MonitorOutlined />
          系统监控
        </span>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="CPU使用率">
              <Progress type="dashboard" percent={45} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="内存使用率">
              <Progress type="dashboard" percent={60} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="磁盘使用率">
              <Progress type="dashboard" percent={75} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="系统信息">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="操作系统">Linux</Descriptions.Item>
                <Descriptions.Item label="系统版本">CentOS 7.9</Descriptions.Item>
                <Descriptions.Item label="CPU核心数">4核</Descriptions.Item>
                <Descriptions.Item label="总内存">16GB</Descriptions.Item>
                <Descriptions.Item label="系统运行时间">30天</Descriptions.Item>
                <Descriptions.Item label="最后更新时间">2024-03-20</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'integration',
      label: (
        <span>
          <ApiOutlined />
          第三方集成
        </span>
      ),
      children: (
        <div>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={[
              {
                title: '微信公众号',
                status: true,
                icon: <WechatOutlined style={{ fontSize: 32 }} />,
                description: '已连接企业微信公众号',
              },
              {
                title: '钉钉',
                status: false,
                icon: <DingdingOutlined style={{ fontSize: 32 }} />,
                description: '未配置钉钉集成',
              },
              {
                title: '短信服务',
                status: true,
                icon: <MessageOutlined style={{ fontSize: 32 }} />,
                description: '已连接阿里云短信服务',
              },
              {
                title: '对象存储',
                status: true,
                icon: <CloudOutlined style={{ fontSize: 32 }} />,
                description: '已连接阿里云OSS',
              },
            ]}
            renderItem={item => (
              <List.Item>
                <Card>
                  <Card.Meta
                    avatar={item.icon}
                    title={
                      <Space>
                        {item.title}
                        <Switch checked={item.status} />
                      </Space>
                    }
                    description={item.description}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Button type="link">配置</Button>
                    <Button type="link">测试连接</Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>系统设置</Title>
      <Tabs defaultActiveKey="basic" items={items} />
    </Card>
  );
};

export default Settings; 