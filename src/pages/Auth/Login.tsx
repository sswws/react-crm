import React from 'react';
import { Card, Form, Input, Button, Checkbox, message, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    try {
      // 这里应该调用登录 API
      console.log('登录信息:', values);
      
      // 模拟登录成功，添加权限信息
      const mockUserData = {
        id: '1',
        username: values.username,
        role: 'admin',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
        permissions: [
          'dashboard',
          'users.view', 'users.create', 'users.edit', 'users.delete',
          'roles.view', 'roles.manage',
          'permissions.manage',
          'customers.view', 'customers.contacts.view', 'customers.follow.view',
          'business.opportunities.view', 'business.contracts.view', 'business.quotes.view',
          'marketing.campaigns.view', 'marketing.leads.view',
          'products.view', 'products.categories.view',
          'service.tickets.view',
          'analytics.view',
          'teams',
          'settings',
          'finance.payments.view',
          'finance.invoices.view',
          'finance.receivables.view',
          'finance.analytics.view',
          'approvals.view',
          'approvals.approve',
          'approvals.reject',
          'notifications.view',
          'schedules.view',
          'schedules.manage',
        ]
      };
      
      login('mock_token', mockUserData);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  const handleThirdPartyLogin = (type: string) => {
    message.info(`${type}登录功能开发中`);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
    }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>CRM 系统</Title>
          <Title level={4} style={{ marginTop: 0 }}>用户登录</Title>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <a style={{ float: 'right' }} href="/forgot-password">
              忘记密码？
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Space>
              还没有账号？
              <Link to="/register">立即注册</Link>
            </Space>
          </Form.Item>

          <Divider>其他登录方式</Divider>
          
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button 
                type="link" 
                icon={<WechatOutlined style={{ fontSize: 24, color: '#07C160' }} />}
                onClick={() => handleThirdPartyLogin('微信')}
              />
              <Button 
                type="link" 
                icon={<GithubOutlined style={{ fontSize: 24 }} />}
                onClick={() => handleThirdPartyLogin('GitHub')}
              />
              <Button 
                type="link" 
                icon={<GoogleOutlined style={{ fontSize: 24, color: '#DB4437' }} />}
                onClick={() => handleThirdPartyLogin('Google')}
              />
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 