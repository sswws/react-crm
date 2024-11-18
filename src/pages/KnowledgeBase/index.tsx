import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Tree,
  List,
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
  Typography,
  Upload,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  TreeSelect,
} from 'antd';
import {
  PlusOutlined,
  FolderOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  FileOutlined,
  TeamOutlined,
  GlobalOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

// 定义知识库文档类型
interface DocumentType {
  key: string;
  title: string;
  category: string;
  type: string;
  content: string;
  tags: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  visibility: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
  comments: number;
  version: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 定义目录树节点类型
interface CategoryNode extends DataNode {
  children?: CategoryNode[];
}

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 目录树数据
  const categoryData: Record<string, CategoryNode[]> = {
    products: [
      {
        title: '产品介绍',
        key: 'product-intro',
        icon: <FolderOutlined />,
        children: [
          { title: '产品功能说明', key: 'product-features' },
          { title: '技术规格', key: 'technical-specs' },
          { title: '使用指南', key: 'user-guide' },
        ],
      },
      {
        title: '解决方案',
        key: 'solutions',
        icon: <FolderOutlined />,
        children: [
          { title: '行业解决方案', key: 'industry-solutions' },
          { title: '技术方案', key: 'technical-solutions' },
        ],
      },
    ],
    sales: [
      {
        title: '销售话术',
        key: 'sales-scripts',
        icon: <FolderOutlined />,
        children: [
          { title: '开场白', key: 'opening' },
          { title: '需求挖掘', key: 'needs-analysis' },
          { title: '异议处理', key: 'objection-handling' },
          { title: '成交技巧', key: 'closing-techniques' },
        ],
      },
      {
        title: '案例分享',
        key: 'case-studies',
        icon: <FolderOutlined />,
        children: [
          { title: '成功案例', key: 'success-stories' },
          { title: '行业案例', key: 'industry-cases' },
        ],
      },
    ],
    faq: [
      {
        title: '常见问题',
        key: 'common-issues',
        icon: <FolderOutlined />,
        children: [
          { title: '产品问题', key: 'product-issues' },
          { title: '技术问题', key: 'technical-issues' },
          { title: '商务问题', key: 'business-issues' },
        ],
      },
      {
        title: '故障排除',
        key: 'troubleshooting',
        icon: <FolderOutlined />,
        children: [
          { title: '常见故障', key: 'common-problems' },
          { title: '解决方案', key: 'solutions-guide' },
        ],
      },
    ],
    training: [
      {
        title: '培训课程',
        key: 'courses',
        icon: <FolderOutlined />,
        children: [
          { title: '新员工培训', key: 'new-employee' },
          { title: '产品培训', key: 'product-training' },
          { title: '技能培训', key: 'skill-training' },
        ],
      },
      {
        title: '考核认证',
        key: 'certification',
        icon: <FolderOutlined />,
        children: [
          { title: '认证体系', key: 'cert-system' },
          { title: '考试题库', key: 'exam-questions' },
        ],
      },
    ],
    templates: [
      {
        title: '合同模板',
        key: 'contract-templates',
        icon: <FolderOutlined />,
        children: [
          { title: '标准合同', key: 'standard-contracts' },
          { title: '补充协议', key: 'supplementary-agreements' },
        ],
      },
      {
        title: '方案模板',
        key: 'proposal-templates',
        icon: <FolderOutlined />,
        children: [
          { title: '建议书模板', key: 'proposal-templates' },
          { title: '报价模板', key: 'quotation-templates' },
        ],
      },
    ],
  };

  // 模拟文档数据
  const mockDocuments: DocumentType[] = [
    {
      key: '1',
      title: 'ERP系统功能说明书',
      category: 'product-features',
      type: 'document',
      content: '# ERP系统功能说明\n\n## 1. 系统概述\n...',
      tags: ['ERP', '产品文档', '功能说明'],
      attachments: [
        { name: '功能清单.xlsx', url: '#', type: 'excel' },
      ],
      visibility: 'public',
      author: {
        name: '张三',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      },
      views: 1200,
      likes: 45,
      comments: 8,
      version: '1.0',
      status: 'published',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    // ... 可以添加更多模拟数据
  ];

  const [documents, setDocuments] = useState<DocumentType[]>(mockDocuments);

  // 标签选项
  const tagOptions = [
    { label: 'ERP', value: 'erp' },
    { label: '产品文档', value: 'product-doc' },
    { label: '技术文档', value: 'technical-doc' },
    { label: '培训资料', value: 'training' },
    { label: '销售资料', value: 'sales' },
  ];

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public', icon: <GlobalOutlined /> },
    { label: '团队可见', value: 'team', icon: <TeamOutlined /> },
    { label: '仅自己可见', value: 'private', icon: <LockOutlined /> },
  ];

  // Tab 配置
  const tabItems = [
    {
      key: 'products',
      label: (
        <span>
          <BookOutlined />
          产品资料库
        </span>
      ),
    },
    {
      key: 'sales',
      label: (
        <span>
          <TeamOutlined />
          销售话术库
        </span>
      ),
    },
    {
      key: 'faq',
      label: (
        <span>
          <QuestionCircleOutlined />
          常见问题解答
        </span>
      ),
    },
    {
      key: 'training',
      label: (
        <span>
          <ReadOutlined />
          培训资料
        </span>
      ),
    },
    {
      key: 'templates',
      label: (
        <span>
          <FileOutlined />
          文档模板
        </span>
      ),
    },
  ];

  // 处理文档操作
  const handleDocumentAction = (action: string, document: DocumentType) => {
    switch (action) {
      case 'view':
        // 实现查看功能
        break;
      case 'edit':
        // 实现编辑功能
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: '确定要删除这个文档吗？',
          onOk() {
            setDocuments(documents.filter(doc => doc.key !== document.key));
            message.success('删除成功');
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>知识库管理</Title>
            <Space>
              <Input.Search
                placeholder="搜索文档"
                allowClear
                style={{ width: 300 }}
                onSearch={value => setSearchText(value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                新建文档
              </Button>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </Col>
        <Col span={6}>
          <Card title="目录" size="small">
            <Tree
              showIcon
              defaultExpandAll
              treeData={categoryData[activeTab]}
              onSelect={keys => setSelectedCategory(keys[0]?.toString() || '')}
            />
          </Card>
        </Col>
        <Col span={18}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 10,
            }}
            dataSource={documents}
            renderItem={item => (
              <List.Item
                key={item.key}
                actions={[
                  <Space>
                    <EyeOutlined /> {item.views}
                  </Space>,
                  <Space>
                    <LikeOutlined /> {item.likes}
                  </Space>,
                  <Space>
                    <MessageOutlined /> {item.comments}
                  </Space>,
                  <Space>
                    <Button type="link" onClick={() => handleDocumentAction('view', item)}>
                      查看
                    </Button>
                    <Button type="link" onClick={() => handleDocumentAction('edit', item)}>
                      编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDocumentAction('delete', item)}>
                      删除
                    </Button>
                  </Space>,
                ]}
                extra={
                  <Space direction="vertical" align="end">
                    <Tag color="blue">{item.version}</Tag>
                    <Text type="secondary">更新于 {item.updatedAt}</Text>
                  </Space>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.author.avatar} />}
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      {item.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  }
                  description={
                    <Space>
                      <Text type="secondary">{item.author.name}</Text>
                      <Tag icon={visibilityOptions.find(v => v.value === item.visibility)?.icon}>
                        {visibilityOptions.find(v => v.value === item.visibility)?.label}
                      </Tag>
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>
                  {item.content.replace(/[#\n]/g, ' ')}
                </Paragraph>
                {item.attachments.length > 0 && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text type="secondary">附件：</Text>
                    {item.attachments.map(attachment => (
                      <Button
                        key={attachment.name}
                        type="link"
                        icon={<FileTextOutlined />}
                        onClick={() => window.open(attachment.url)}
                      >
                        {attachment.name}
                      </Button>
                    ))}
                  </Space>
                )}
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Modal
        title="新建文档"
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            console.log(values);
            setIsModalVisible(false);
          });
        }}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="文档标题"
            rules={[{ required: true, message: '请输入文档标题' }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="所属分类"
                rules={[{ required: true, message: '请选择所属分类' }]}
              >
                <TreeSelect
                  treeData={categoryData[activeTab]}
                  placeholder="请选择分类"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="visibility"
                label="可见范围"
                rules={[{ required: true, message: '请选择可见范围' }]}
              >
                <Select>
                  {visibilityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        {option.icon}
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="content"
            label="文档内容"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="输入或选择标签">
              {tagOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="attachments"
            label="附件"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KnowledgeBase; 