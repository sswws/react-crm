import React, { useState, Key } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Tree,
  Row,
  Col,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode, EventDataNode } from 'antd/es/tree';

interface RoleType {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

// 权限树形数据
const permissionTreeData: DataNode[] = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      {
        title: '用户管理',
        key: 'users',
        children: [
          { title: '查看用户', key: 'users.view' },
          { title: '创建用户', key: 'users.create' },
          { title: '编辑用户', key: 'users.edit' },
          { title: '删除用户', key: 'users.delete' },
        ],
      },
      {
        title: '角色管理',
        key: 'roles',
        children: [
          { title: '查看角色', key: 'roles.view' },
          { title: '创建角色', key: 'roles.create' },
          { title: '编辑角色', key: 'roles.edit' },
          { title: '删除角色', key: 'roles.delete' },
        ],
      },
    ],
  },
  {
    title: '业务管理',
    key: 'business',
    children: [
      {
        title: '客户管理',
        key: 'customers',
        children: [
          { title: '查看客户', key: 'customers.view' },
          { title: '创建客户', key: 'customers.create' },
          { title: '编辑客户', key: 'customers.edit' },
          { title: '删除客户', key: 'customers.delete' },
        ],
      },
      {
        title: '订单管理',
        key: 'orders',
        children: [
          { title: '查看订单', key: 'orders.view' },
          { title: '创建订单', key: 'orders.create' },
          { title: '编辑订单', key: 'orders.edit' },
          { title: '删除订单', key: 'orders.delete' },
        ],
      },
    ],
  },
];

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(['system', 'business']);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // 模拟角色数据
  const mockRoles: RoleType[] = [
    {
      key: '1',
      name: '超级管理员',
      description: '拥有所有权限',
      permissions: ['system', 'users', 'roles'],
      userCount: 2,
      createdAt: '2024-01-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      name: '普通管理员',
      description: '拥有部分管理权限',
      permissions: ['users.view', 'users.edit'],
      userCount: 5,
      createdAt: '2024-01-02',
      updatedAt: '2024-03-19',
    },
    {
      key: '3',
      name: '普通用户',
      description: '基础功能权限',
      permissions: ['users.view'],
      userCount: 100,
      createdAt: '2024-01-03',
      updatedAt: '2024-03-18',
    },
  ];

  const [roles, setRoles] = useState<RoleType[]>(mockRoles);

  const columns: ColumnsType<RoleType> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '权限数量',
      key: 'permissions',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.permissions.length} 个权限</Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      sorter: (a, b) => a.userCount - b.userCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定删除该角色吗？"
              description="删除后无法恢复，请谨慎操作。"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record.key)}
              okText="确定"
              cancelText="取消"
              disabled={record.name === '超级管理员'}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.name === '超级管理员'}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: RoleType) => {
    form.setFieldsValue({
      ...record,
    });
    setCheckedKeys(record.permissions);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleCopy = (record: RoleType) => {
    const newRole = {
      ...record,
      key: Date.now().toString(),
      name: `${record.name} (副本)`,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setRoles([...roles, newRole]);
    message.success('复制成功');
  };

  const handleDelete = (key: string) => {
    setRoles(roles.filter(role => role.key !== key));
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        permissions: checkedKeys.map(key => key.toString()),
        updatedAt: new Date().toISOString().split('T')[0],
      };

      if (editingKey) {
        setRoles(
          roles.map(role =>
            role.key === editingKey
              ? { ...role, ...formData }
              : role
          )
        );
        message.success('更新成功');
      } else {
        const newRole = {
          key: Date.now().toString(),
          ...formData,
          userCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setRoles([...roles, newRole]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const onExpand = (
    expandedKeys: Key[],
    info: {
      node: EventDataNode<DataNode>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checked: Key[] | { checked: Key[]; halfChecked: Key[] }) => {
    const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (
    selectedKeys: Key[],
    info: {
      node: EventDataNode<DataNode>;
      selected: boolean;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => {
    setSelectedKeys(selectedKeys);
  };

  return (
    <Card>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setCheckedKeys([]);
              setEditingKey('');
              setIsModalVisible(true);
            }}
          >
            添加角色
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingKey ? '编辑角色' : '添加角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            label="权限配置"
            required
          >
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={permissionTreeData}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RoleManagement; 