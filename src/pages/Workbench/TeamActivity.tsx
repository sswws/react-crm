import React, { useState } from 'react';
import {
  Card,
  List,
  Avatar,
  Space,
  Tag,
  Button,
  Input,
  Typography,
  Divider,
  Row,
  Col,
  Tooltip,
  Modal,
  Form,
  Select,
  Upload,
  message,
  Statistic,
} from 'antd';
import dayjs from 'dayjs';
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  UserOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  GlobalOutlined,
  LockOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ActivityType {
  key: string;
  type: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  visibility: string;
  tags: string[];
  likes: number;
  comments: {
    author: string;
    avatar: string;
    content: string;
    time: string;
  }[];
  createdAt: string;
}

const TeamActivity: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockActivities: ActivityType[] = [
    {
      key: '1',
      type: 'work',
      content: '完成了客户管理模块的开发，新增了批量导入功能',
      author: {
        name: '张三',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
        title: '前端开发',
      },
      attachments: [
        {
          name: '开发文档.pdf',
          url: '#',
          type: 'pdf',
        },
      ],
      visibility: 'team',
      tags: ['开发进展', '功能更新'],
      likes: 5,
      comments: [
        {
          author: '李四',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
          content: '做得很好，下一步我们开始测试',
          time: '2024-03-20 15:30',
        },
      ],
      createdAt: '2024-03-20 14:30',
    },
    {
      key: '2',
      type: 'achievement',
      content: '我们的团队成功完成了Q1的销售目标！',
      author: {
        name: '王经理',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3',
        title: '销售经理',
      },
      attachments: [],
      visibility: 'all',
      tags: ['团队成就', '销售目标'],
      likes: 12,
      comments: [
        {
          author: '张三',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
          content: '太棒了！',
          time: '2024-03-20 11:30',
        },
      ],
      createdAt: '2024-03-20 10:00',
    },
  ];

  const [activities, setActivities] = useState<ActivityType[]>(mockActivities);

  const activityTypes = [
    { label: '工作进展', value: 'work', icon: <FileTextOutlined /> },
    { label: '客户服务', value: 'service', icon: <CustomerServiceOutlined /> },
    { label: '团队协作', value: 'team', icon: <TeamOutlined /> },
    { label: '成就分享', value: 'achievement', icon: <TrophyOutlined /> },
  ];

  const visibilityOptions = [
    { label: '公开', value: 'all', icon: <GlobalOutlined /> },
    { label: '团队可见', value: 'team', icon: <TeamOutlined /> },
    { label: '仅自己可见', value: 'private', icon: <LockOutlined /> },
  ];

  const handleLike = (activity: ActivityType) => {
    setActivities(
      activities.map(item =>
        item.key === activity.key
          ? { ...item, likes: item.likes + 1 }
          : item
      )
    );
  };

  const handleComment = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setIsCommentVisible(true);
  };

  const handleShare = (activity: ActivityType) => {
    message.success('分享成功');
  };

  const handleSubmitComment = (values: { comment: string }) => {
    if (selectedActivity) {
      const newComment = {
        author: '当前用户',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=4',
        content: values.comment,
        time: new Date().toLocaleString(),
      };

      setActivities(
        activities.map(item =>
          item.key === selectedActivity.key
            ? { ...item, comments: [...item.comments, newComment] }
            : item
        )
      );
      setIsCommentVisible(false);
      message.success('评论成功');
    }
  };

  const handleSubmitActivity = async () => {
    try {
      const values = await form.validateFields();
      const newActivity = {
        key: Date.now().toString(),
        ...values,
        author: {
          name: '当前用户',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=4',
          title: '开发工程师',
        },
        likes: 0,
        comments: [],
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      setActivities([newActivity, ...activities]);
      setIsModalVisible(false);
      message.success('发布成功');
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            {/* 动态发布区 */}
            <Card
              title="发布动态"
              bordered={false}
              style={{ marginBottom: 16 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="dashed"
                  block
                  icon={<UsergroupAddOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  分享工作动态...
                </Button>
              </Space>
            </Card>

            {/* 动态列表 */}
            <List
              itemLayout="vertical"
              size="large"
              dataSource={activities}
              renderItem={item => (
                <Card style={{ marginBottom: 16 }}>
                  <List.Item
                    key={item.key}
                    actions={[
                      <Tooltip title="点赞">
                        <Button
                          type="text"
                          icon={<LikeOutlined />}
                          onClick={() => handleLike(item)}
                        >
                          {item.likes}
                        </Button>
                      </Tooltip>,
                      <Tooltip title="评论">
                        <Button
                          type="text"
                          icon={<CommentOutlined />}
                          onClick={() => handleComment(item)}
                        >
                          {item.comments.length}
                        </Button>
                      </Tooltip>,
                      <Tooltip title="分享">
                        <Button
                          type="text"
                          icon={<ShareAltOutlined />}
                          onClick={() => handleShare(item)}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.author.avatar} />}
                      title={
                        <Space>
                          <Text strong>{item.author.name}</Text>
                          <Tag>{item.author.title}</Tag>
                          {activityTypes.find(t => t.value === item.type)?.icon}
                          <Tag>{activityTypes.find(t => t.value === item.type)?.label}</Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <ClockCircleOutlined />
                          <Text type="secondary">{item.createdAt}</Text>
                          {visibilityOptions.find(v => v.value === item.visibility)?.icon}
                          <Text type="secondary">
                            {visibilityOptions.find(v => v.value === item.visibility)?.label}
                          </Text>
                        </Space>
                      }
                    />
                    <div style={{ margin: '16px 0' }}>
                      <Text>{item.content}</Text>
                    </div>
                    {item.attachments.length > 0 && (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">附件：</Text>
                        {item.attachments.map(attachment => (
                          <Button
                            key={attachment.name}
                            type="link"
                            icon={<FileTextOutlined />}
                          >
                            {attachment.name}
                          </Button>
                        ))}
                      </Space>
                    )}
                    {item.tags.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <Space>
                          {item.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                    {item.comments.length > 0 && (
                      <>
                        <Divider />
                        <List
                          itemLayout="horizontal"
                          dataSource={item.comments}
                          renderItem={comment => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar src={comment.avatar} />}
                                title={
                                  <Space>
                                    <Text strong>{comment.author}</Text>
                                    <Text type="secondary">{comment.time}</Text>
                                  </Space>
                                }
                                description={comment.content}
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    )}
                  </List.Item>
                </Card>
              )}
            />
          </Col>

          <Col span={8}>
            {/* 团队动态统计 */}
            <Card title="动态统计" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic title="今日动态" value={activities.length} />
                <Statistic title="互动总数" value={activities.reduce((sum, item) => sum + item.likes + item.comments.length, 0)} />
              </Space>
            </Card>

            {/* 活跃成员 */}
            <Card title="活跃成员" bordered={false} style={{ marginTop: 16 }}>
              <List
                itemLayout="horizontal"
                dataSource={Array.from(new Set(activities.map(item => item.author))).slice(0, 5)}
                renderItem={author => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={author.avatar} />}
                      title={author.name}
                      description={author.title}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 发布动态模态框 */}
      <Modal
        title="发布动态"
        open={isModalVisible}
        onOk={handleSubmitActivity}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'work',
            visibility: 'team',
            tags: [],
          }}
        >
          <Form.Item
            name="type"
            label="动态类型"
            rules={[{ required: true, message: '请选择动态类型' }]}
          >
            <Select>
              {activityTypes.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    {option.icon}
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="动态内容"
            rules={[{ required: true, message: '请输入动态内容' }]}
          >
            <TextArea rows={4} />
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
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="输入标签后按回车" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 评论模态框 */}
      <Modal
        title="发表评论"
        open={isCommentVisible}
        onOk={() => {
          form.validateFields().then(values => {
            handleSubmitComment(values);
            form.resetFields();
          });
        }}
        onCancel={() => setIsCommentVisible(false)}
      >
        <Form form={form}>
          <Form.Item
            name="comment"
            rules={[{ required: true, message: '请输入评论内容' }]}
          >
            <TextArea rows={4} placeholder="写下你的评论..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamActivity; 