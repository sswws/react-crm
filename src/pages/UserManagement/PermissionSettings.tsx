import React from 'react';
import { Card, Table, Switch, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface PermissionType {
  key: string;
  module: string;
  action: string;
  description: string;
  enabled: boolean;
}

const PermissionSettings: React.FC = () => {
  const permissions: PermissionType[] = [
    {
      key: '1',
      module: '用户管理',
      action: '查看用户',
      description: '查看用户列表和用户详情',
      enabled: true,
    },
    {
      key: '2',
      module: '用户管理',
      action: '编辑用户',
      description: '创建、修改和删除用户',
      enabled: true,
    },
    {
      key: '3',
      module: '角色管理',
      action: '管理角色',
      description: '创建、修改和删除角色',
      enabled: true,
    },
    {
      key: '4',
      module: '权限管理',
      action: '设置权限',
      description: '配置系统权限',
      enabled: true,
    },
  ];

  const columns: ColumnsType<PermissionType> = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      key: 'enabled',
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record.enabled}
          onChange={(checked) => handlePermissionChange(record.key, checked)}
        />
      ),
    },
  ];

  const handlePermissionChange = (key: string, enabled: boolean) => {
    console.log(`权限 ${key} 已${enabled ? '启用' : '禁用'}`);
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>权限配置</Title>
        <Table
          columns={columns}
          dataSource={permissions}
          pagination={false}
        />
      </Space>
    </Card>
  );
};

export default PermissionSettings; 