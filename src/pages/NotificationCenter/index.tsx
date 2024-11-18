import React, { useState } from 'react';
import {
  Card,
  Tabs,
  List,
  Button,
  Space,
  Tag,
  Badge,
  Typography,
  Avatar,
  Dropdown,
  Empty,
  Tooltip,
  Row,
  Col,
  Modal,
  message,
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
  AuditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  MoreOutlined,
  NotificationOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text, Paragraph } = Typography;

interface NotificationType {
  key: string;
  type: 'system' | 'todo' | 'customer' | 'approval';
  title: string;
  content: string;
  sender: string;
  senderAvatar?: string;
  status: 'unread' | 'read';
  priority: 'high' | 'medium' | 'low';
  link?: string;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  // 模拟通知数据
  const mockNotifications: NotificationType[] = [
    {
      key: '1',
      type: 'system',
      title: '系统升级通知',
      content: '系统将于今晚22:00-23:00进行升级维护，请提前做好相关工作安排。',
      sender: '系统管理员',
      status: 'unread',
      priority: 'high',
      createdAt: '2024-03-20 10:00',
    },
    {
      key: '2',
      type: 'todo',
      title: '待跟进客户提醒',
      content: '您有一个客户"阿里巴巴"需要在今天下午3点前进行跟进。',
      sender: '系统',
      status: 'unread',
      priority: 'medium',
      link: '/customers/follow',
      createdAt: '2024-03-20 09:30',
    },
    {
      key: '3',
      type: 'customer',
      title: '新的客户评论',
      content: '客户"张三"对最近的服务进行了评价，请及时查看并回复。',
      sender: '张三',
      senderAvatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
      status: 'unread',
      priority: 'medium',
      link: '/service/feedback',
      createdAt: '2024-03-20 09:00',
    },
    {
      key: '4',
      type: 'approval',
      title: '新的合同审批',
      content: '您有一个新的合同审批需要处理，请尽快查看。',
      sender: '李四',
      senderAvatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
      status: 'unread',
      priority: 'high',
      link: '/approvals',
      createdAt: '2024-03-20 08:30',
    },
  ];

  const [notifications, setNotifications] = useState<NotificationType[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  // 获取未读消息数量
  const getUnreadCount = (type?: string) => {
    return notifications.filter(
      n => n.status === 'unread' && (type ? n.type === type : true)
    ).length;
  };

  // 处理标记已读
  const handleMarkAsRead = (notification: NotificationType) => {
    setNotifications(
      notifications.map(n =>
        n.key === notification.key ? { ...n, status: 'read' } : n
      )
    );
    message.success('已标记为已读');
  };

  // 处理删除通知
  const handleDelete = (notification: NotificationType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条通知吗？',
      onOk() {
        setNotifications(notifications.filter(n => n.key !== notification.key));
        message.success('删除成功');
      },
    });
  };

  // 处理全部已读
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, status: 'read' }))
    );
    message.success('已全部标记为已读');
  };

  // 处理清空通知
  const handleClearAll = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有通知吗？',
      onOk() {
        setNotifications([]);
        message.success('清空成功');
      },
    });
  };

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'markRead',
      label: '标记已读',
      icon: <CheckOutlined />,
    },
    {
      key: 'delete',
      label: '删除通知',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // 渲染通知图标
  const renderNotificationIcon = (type: string) => {
    const iconMap = {
      system: <NotificationOutlined style={{ color: '#1890ff' }} />,
      todo: <ClockCircleOutlined style={{ color: '#52c41a' }} />,
      customer: <TeamOutlined style={{ color: '#722ed1' }} />,
      approval: <FileTextOutlined style={{ color: '#fa8c16' }} />,
    };
    return iconMap[type as keyof typeof iconMap];
  };

  // 渲染优先级标签
  const renderPriorityTag = (priority: string) => {
    const priorityMap = {
      high: { color: 'error', text: '高' },
      medium: { color: 'warning', text: '中' },
      low: { color: 'default', text: '低' },
    };
    const config = priorityMap[priority as keyof typeof priorityMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Badge count={getUnreadCount()}>
              <BellOutlined style={{ fontSize: 24 }} />
            </Badge>
            <Text strong>消息通知</Text>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button onClick={handleMarkAllAsRead}>全部已读</Button>
            <Button onClick={handleClearAll}>清空通知</Button>
          </Space>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'all',
            label: (
              <Badge count={getUnreadCount()} offset={[10, 0]}>
                全部消息
              </Badge>
            ),
            children: (
              <List
                dataSource={notifications}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Space>
                        {item.status === 'unread' && (
                          <Button
                            type="link"
                            onClick={() => handleMarkAsRead(item)}
                          >
                            标记已读
                          </Button>
                        )}
                        <Button
                          type="link"
                          danger
                          onClick={() => handleDelete(item)}
                        >
                          删除
                        </Button>
                      </Space>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={item.status === 'unread'}>
                          {renderNotificationIcon(item.type)}
                        </Badge>
                      }
                      title={
                        <Space>
                          <Text strong>{item.title}</Text>
                          {renderPriorityTag(item.priority)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {item.content}
                          </Paragraph>
                          <Space>
                            <Avatar
                              size="small"
                              src={item.senderAvatar}
                              icon={<UserOutlined />}
                            />
                            <Text type="secondary">{item.sender}</Text>
                            <Text type="secondary">{item.createdAt}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: <Empty description="暂无通知" />,
                }}
              />
            ),
          },
          {
            key: 'system',
            label: (
              <Badge count={getUnreadCount('system')} offset={[10, 0]}>
                系统通知
              </Badge>
            ),
            children: (
              <List
                dataSource={notifications.filter(n => n.type === 'system')}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<NotificationOutlined />}
                      title={item.title}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'todo',
            label: (
              <Badge count={getUnreadCount('todo')} offset={[10, 0]}>
                待办提醒
              </Badge>
            ),
            children: (
              <List
                dataSource={notifications.filter(n => n.type === 'todo')}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ClockCircleOutlined />}
                      title={item.title}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'customer',
            label: (
              <Badge count={getUnreadCount('customer')} offset={[10, 0]}>
                客户互动
              </Badge>
            ),
            children: (
              <List
                dataSource={notifications.filter(n => n.type === 'customer')}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<MessageOutlined />}
                      title={item.title}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'approval',
            label: (
              <Badge count={getUnreadCount('approval')} offset={[10, 0]}>
                审批提醒
              </Badge>
            ),
            children: (
              <List
                dataSource={notifications.filter(n => n.type === 'approval')}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<AuditOutlined />}
                      title={item.title}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};

export default NotificationCenter; 