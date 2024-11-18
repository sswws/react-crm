import React, { useState } from 'react';
import {
  Card,
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
  Tooltip,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface ArticleType {
  key: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  attachments: string[];
  author: string;
  views: number;
  likes: number;
  comments: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryType {
  key: string;
  title: string;
  children?: CategoryType[];
}

const KnowledgeBase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);

  // 模拟分类数据
  const categories: CategoryType[] = [
    {
      key: 'product',
      title: '产品知识',
      children: [
        { key: 'features', title: '功能介绍' },
        { key: 'usage', title: '使用指南' },
        { key: 'faq', title: '常见问题' },
      ],
    },
    {
      key: 'service',
      title: '服务支持',
      children: [
        { key: 'implementation', title: '实施指南' },
        { key: 'maintenance', title: '维护手册' },
        { key: 'troubleshooting', title: '故障排查' },
      ],
    },
    {
      key: 'sales',
      title: '销售支持',
      children: [
        { key: 'pricing', title: '价格政策' },
        { key: 'proposal', title: '方案模板' },
        { key: 'cases', title: '案例分享' },
      ],
    },
  ];

  // 模拟文章数据
  const mockArticles: ArticleType[] = [
    {
      key: '1',
      title: 'ERP系统功能详解',
      category: 'features',
      content: '# ERP系统功能详解\n\n## 1. 系统概述\n...\n## 2. 核心功能\n...',
      tags: ['ERP', '功能介绍', '入门指南'],
      attachments: ['guide.pdf'],
      author: '张三',
      views: 1200,
      likes: 45,
      comments: 8,
      status: 'published',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      title: '常见问题解答',
      category: 'faq',
      content: '# 常见问题解答\n\n## Q1: 如何重置密码？\n...\n## Q2: 如何导出报表？\n...',
      tags: ['FAQ', '问题解答'],
      attachments: [],
      author: '李四',
      views: 2300,
      likes: 89,
      comments: 15,
      status: 'published',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-19',
    },
  ];

  const [articles, setArticles] = useState<ArticleType[]>(mockArticles);

  const statusOptions = [
    { label: '已发布', value: 'published', color: 'success' },
    { label: '草稿', value: 'draft', color: 'default' },
    { label: '审核中', value: 'reviewing', color: 'processing' },
    { label: '已归档', value: 'archived', color: 'warning' },
  ];

  // 处理文章编辑
  const handleEdit = (record: ArticleType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  // 处理文章删除
  const handleDelete = (record: ArticleType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？',
      onOk() {
        setArticles(articles.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  // 处理文章预览
  const handlePreview = (record: ArticleType) => {
    setSelectedArticle(record);
    setIsPreviewVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        setArticles(
          articles.map(item =>
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
        const newArticle = {
          key: Date.now().toString(),
          ...values,
          views: 0,
          likes: 0,
          comments: 0,
          author: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setArticles([...articles, newArticle]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 过滤文章列表
  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchSearch = article.title.toLowerCase().includes(searchText.toLowerCase()) ||
                       article.content.toLowerCase().includes(searchText.toLowerCase()) ||
                       article.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <Card>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="知识分类" size="small">
            <Tree
              defaultExpandAll
              defaultSelectedKeys={['all']}
              treeData={[
                {
                  key: 'all',
                  title: '全部分类',
                  icon: <FolderOutlined />,
                },
                ...categories,
              ]}
              onSelect={([key]) => setSelectedCategory(key as string)}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            <Col flex="auto">
              <Input.Search
                placeholder="搜索文章标题、内容或标签"
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={value => setSearchText(value)}
                style={{ width: 300 }}
              />
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
                新建文章
              </Button>
            </Col>
          </Row>

          <List
            className="knowledge-list"
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 10,
            }}
            dataSource={filteredArticles}
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
                    <Button type="link" onClick={() => handlePreview(item)}>
                      查看详情
                    </Button>
                    <Button type="link" onClick={() => handleEdit(item)}>
                      编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(item)}>
                      删除
                    </Button>
                  </Space>,
                ]}
                extra={
                  <Space direction="vertical" align="end">
                    <Tag color={statusOptions.find(s => s.value === item.status)?.color}>
                      {statusOptions.find(s => s.value === item.status)?.label}
                    </Tag>
                    <Text type="secondary">更新于 {item.updatedAt}</Text>
                  </Space>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.title}
                  description={
                    <Space size={[0, 8]} wrap>
                      {item.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>
                  {item.content.replace(/[#\n]/g, ' ')}
                </Paragraph>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Modal
        title={editingKey ? '编辑文章' : '新建文章'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'draft' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
              {categories.map(category => (
                category.children?.map(child => (
                  <Option key={child.key} value={child.key}>
                    {category.title} - {child.title}
                  </Option>
                ))
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Select mode="tags" placeholder="输入标签后按回车" />
          </Form.Item>
          <Form.Item
            name="attachments"
            label="附件"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="文章预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width={800}
        footer={null}
      >
        {selectedArticle && (
          <div>
            <Title level={2}>{selectedArticle.title}</Title>
            <Space split={<Divider type="vertical" />}>
              <Text type="secondary">作者：{selectedArticle.author}</Text>
              <Text type="secondary">发布于：{selectedArticle.createdAt}</Text>
              <Text type="secondary">更新于：{selectedArticle.updatedAt}</Text>
            </Space>
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br/>') }} />
            <Divider />
            <Space size={[0, 8]} wrap>
              {selectedArticle.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default KnowledgeBase; 