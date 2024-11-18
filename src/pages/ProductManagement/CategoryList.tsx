import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Row,
  Col,
  Tree,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { TextArea } = Input;
const { Text } = Typography;

interface CategoryType {
  key: string;
  name: string;
  code: string;
  parentId: string | null;
  level: number;
  path: string;
  productCount: number;
  status: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TreeNodeType extends DataNode {
  children?: TreeNodeType[];
}

interface CategoryWithChildren extends CategoryType {
  children?: CategoryWithChildren[];
}

const CategoryList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  // 模拟数据
  const mockData: CategoryType[] = [
    {
      key: '1',
      name: '软件产品',
      code: 'SOFTWARE',
      parentId: null,
      level: 1,
      path: '/SOFTWARE',
      productCount: 10,
      status: true,
      description: '软件类产品',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      name: 'ERP系统',
      code: 'SOFTWARE_ERP',
      parentId: '1',
      level: 2,
      path: '/SOFTWARE/ERP',
      productCount: 5,
      status: true,
      description: 'ERP系统产品',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '3',
      name: '硬件产品',
      code: 'HARDWARE',
      parentId: null,
      level: 1,
      path: '/HARDWARE',
      productCount: 15,
      status: true,
      description: '硬件类产品',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<CategoryType[]>(mockData);

  // 修改树形数据构建函数
  const buildTreeData = (data: CategoryType[]): TreeNodeType[] => {
    const map = new Map<string, CategoryWithChildren>();
    data.forEach(item => map.set(item.key, { ...item }));

    const treeData: TreeNodeType[] = [];

    // 构建树形结构
    data.forEach(item => {
      if (item.parentId === null) {
        // 根节点
        treeData.push({
          title: item.name,
          key: item.key,
          icon: <FolderOutlined />,
          children: [],
        });
      } else {
        // 子节点，确保 parentId 不为 null
        const parentNode = treeData.find(node => 
          item.parentId && findNodeByKey(node, item.parentId)
        );
        if (parentNode && item.parentId) {  // 添加 item.parentId 的检查
          const targetNode = findNodeByKey(parentNode, item.parentId);
          if (targetNode) {
            if (!targetNode.children) {
              targetNode.children = [];
            }
            targetNode.children.push({
              title: item.name,
              key: item.key,
              icon: <FolderOutlined />,
              children: [],
            });
          }
        }
      }
    });

    return treeData;
  };

  // 辅助函数：递归查找节点
  const findNodeByKey = (node: TreeNodeType, key: string): TreeNodeType | null => {
    if (node.key === key) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeByKey(child, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const columns: ColumnsType<CategoryType> = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record) => (
        <Space>
          <AppstoreOutlined />
          <span>{text}</span>
          {record.level > 1 && (
            <Tag color="blue">子分类</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '分类编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '产品数量',
      dataIndex: 'productCount',
      key: 'productCount',
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'default'}>
          {status ? '启用' : '禁用'}
        </Tag>
      ),
      filters: [
        { text: '启用', value: true },
        { text: '禁用', value: false },
      ],
      onFilter: (value: any, record) => record.status === value,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={record.productCount > 0}
            />
          </Tooltip>
          <Button
            type="link"
            onClick={() => handleAddSub(record)}
          >
            添加子分类
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: CategoryType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setSelectedParent(record.parentId);
    setIsModalVisible(true);
  };

  const handleDelete = (record: CategoryType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个分类吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleAddSub = (record: CategoryType) => {
    form.resetFields();
    setSelectedParent(record.key);
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const parentCategory = selectedParent ? dataSource.find(item => item.key === selectedParent) : null;
      
      const newCategory = {
        ...values,
        key: editingKey || Date.now().toString(),
        parentId: selectedParent,
        level: parentCategory ? parentCategory.level + 1 : 1,
        path: parentCategory ? `${parentCategory.path}/${values.code}` : `/${values.code}`,
        productCount: editingKey ? (dataSource.find(item => item.key === editingKey)?.productCount || 0) : 0,
        createdAt: editingKey ? (dataSource.find(item => item.key === editingKey)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      if (editingKey) {
        setDataSource(dataSource.map(item => item.key === editingKey ? newCategory : item));
        message.success('更新成功');
      } else {
        setDataSource([...dataSource, newCategory]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="分类树" size="small">
            <Tree
              showIcon
              defaultExpandAll
              treeData={buildTreeData(dataSource)}
              onSelect={(selectedKeys) => {
                if (selectedKeys.length > 0) {
                  setSelectedParent(selectedKeys[0].toString());
                }
              }}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Row style={{ marginBottom: 16 }}>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.resetFields();
                  setEditingKey('');
                  setSelectedParent(null);
                  setIsModalVisible(true);
                }}
              >
                新增分类
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Col>
      </Row>

      <Modal
        title={editingKey ? '编辑分类' : '新增分类'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="分类编码"
            rules={[{ required: true, message: '请输入分类编码' }]}
          >
            <Input />
          </Form.Item>
          {selectedParent && (
            <Form.Item label="上级分类">
              <Input 
                value={dataSource.find(item => item.key === selectedParent)?.name} 
                disabled 
              />
            </Form.Item>
          )}
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryList; 