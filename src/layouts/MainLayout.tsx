import React, { useState, useTransition } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ShopOutlined,
  ContactsOutlined,
  FileTextOutlined,
  FundOutlined,
  ApartmentOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  PayCircleOutlined,
  AuditOutlined,
  BellOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Breadcrumb, Avatar, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user, logout } = useAuth();

  // 获取当前路径的第一级路径作为默认展开的菜单项
  const defaultOpenKey = '/' + location.pathname.split('/')[1];

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/customers',
      icon: <ContactsOutlined />,
      label: '客户管理',
      children: [
        {
          key: '/customers/list',
          label: '客户列表',
        },
        {
          key: '/customers/contacts',
          label: '联系人',
        },
        {
          key: '/customers/follow',
          label: '跟进记录',
        },
      ],
    },
    {
      key: '/business',
      icon: <ShopOutlined />,
      label: '商机管理',
      children: [
        {
          key: '/business/opportunities',
          label: '商机列表',
        },
        {
          key: '/business/contracts',
          label: '合同管理',
        },
        {
          key: '/business/quotes',
          label: '报价管理',
        },
      ],
    },
    {
      key: '/marketing',
      icon: <FundOutlined />,
      label: '营销管理',
      children: [
        {
          key: '/marketing/campaigns',
          label: '营销活动',
        },
        {
          key: '/marketing/leads',
          label: '线索管理',
        },
      ],
    },
    {
      key: '/products',
      icon: <ApartmentOutlined />,
      label: '产品管理',
      children: [
        {
          key: '/products/list',
          label: '产品列表',
        },
        {
          key: '/products/categories',
          label: '产品分类',
        },
      ],
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/users/list',
          label: '用户列表',
        },
        {
          key: '/users/roles',
          label: '角色管理',
        },
        {
          key: '/users/permissions',
          label: '权限设置',
        },
      ],
    },
    {
      key: '/teams',
      icon: <TeamOutlined />,
      label: '团队管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      key: '/service',
      icon: <CustomerServiceOutlined />,
      label: '客服管理',
      children: [
        {
          key: '/service/tickets',
          label: '工单管理',
        },
        {
          key: '/service/satisfaction',
          label: '满意度调查',
        },
        {
          key: '/service/complaints',
          label: '投诉处理',
        },
      ],
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '报表分析',
    },
    {
      key: '/finance',
      icon: <PayCircleOutlined />,
      label: '财务管理',
      children: [
        {
          key: '/finance/payments',
          label: '收款管理',
        },
        {
          key: '/finance/invoices',
          label: '开票管理',
        },
        {
          key: '/finance/receivables',
          label: '应收账款',
        },
        {
          key: '/finance/analytics',
          label: '收支统计',
        },
      ],
    },
    {
      key: '/approvals',
      icon: <AuditOutlined />,
      label: '审批管理',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: '消息通知',
    },
    {
      key: '/schedules',
      icon: <CalendarOutlined />,
      label: '日程管理',
    },
  ];

  // 用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理用户菜单点击
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      message.success('已退出登录');
      startTransition(() => {
        navigate('/login');
      });
    } else if (key === 'profile') {
      message.info('功能开发中');
    } else if (key === 'settings') {
      message.info('功能开发中');
    }
  };

  // 获取面包屑项
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
      {
        title: '首页',
        path: '/',
      },
    ];

    let currentPath = '';
    pathSnippets.forEach((snippet) => {
      currentPath += `/${snippet}`;
      const menuItem = menuItems.find(item => item.key === currentPath);
      if (menuItem) {
        breadcrumbItems.push({
          title: menuItem.label,
          path: currentPath,
        });
      } else {
        // 处理子菜单项
        menuItems.forEach(item => {
          if (item.children) {
            const childItem = item.children.find(child => child.key === currentPath);
            if (childItem) {
              if (!breadcrumbItems.find(b => b.path === item.key)) {
                breadcrumbItems.push({
                  title: item.label,
                  path: item.key,
                });
              }
              breadcrumbItems.push({
                title: childItem.label,
                path: currentPath,
              });
            }
          }
        });
      }
    });

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo-container" style={{
          height: 64,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'rgba(255, 255, 255, 0.1)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 32,
            height: 32,
            background: '#1890ff',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShopOutlined style={{ color: '#fff', fontSize: 20 }} />
          </div>
          {!collapsed && (
            <span style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              marginLeft: 12,
              whiteSpace: 'nowrap',
            }}>
              CRM管理系统
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[defaultOpenKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingRight: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <Breadcrumb
                items={getBreadcrumbItems().map(item => ({
                  title: <span onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>{item.title}</span>,
                }))}
              />
            </div>
            <Dropdown 
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }} 
              placement="bottomRight"
              arrow
            >
              <div style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ marginRight: 8 }}
                  src={user?.avatar}
                  icon={<UserOutlined />}
                />
                <span>{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 