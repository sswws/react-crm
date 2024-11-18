import React from 'react';
import { Card, Form, Input, Button, message, Typography, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    try {
      // 这里应该调用重置密码API
      console.log('重置密码邮箱:', values.email);
      message.success('重置密码链接已发送到您的邮箱');
    } catch (error) {
      message.error('发送失败，请重试');
    }
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
          <Title level={2}>找回密码</Title>
          <Title level={4} style={{ marginTop: 0 }}>输入您的邮箱</Title>
        </div>
        
        <Form
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              发送重置链接
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Space>
              <Link to="/login">返回登录</Link>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword; 