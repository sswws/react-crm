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
  Select,
  message,
  Tooltip,
  Row,
  Col,
  InputNumber,
  Upload,
  Image,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;

interface ProductType {
  key: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // 模拟数据
  const mockData: ProductType[] = [
    {
      key: '1',
      code: 'P001',
      name: '企业ERP系统基础版',
      category: 'software',
      price: 50000,
      stock: 999,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      description: '适用于中小型企业的ERP系统',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
    },
    {
      key: '2',
      code: 'P002',
      name: '数据中心解决方案',
      category: 'service',
      price: 100000,
      stock: 1,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      description: '企业级数据中心建设方案',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-19',
    },
  ];

  const [dataSource, setDataSource] = useState<ProductType[]>(mockData);

  const categoryOptions = [
    { label: '软件产品', value: 'software' },
    { label: '硬件产品', value: 'hardware' },
    { label: '服务产品', value: 'service' },
    { label: '解决方案', value: 'solution' },
  ];

  const statusOptions = [
    { label: '在售', value: 'active', color: 'success' },
    { label: '下架', value: 'inactive', color: 'default' },
    { label: '预售', value: 'presale', color: 'processing' },
    { label: '售罄', value: 'soldout', color: 'error' },
  ];

  const columns: ColumnsType<ProductType> = [
    {
      title: '产品图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <Image
          src={image}
          alt="产品图片"
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '产品信息',
      key: 'info',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <BarcodeOutlined />
            <span>{record.code}</span>
          </Space>
          <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          <Tag>{categoryOptions.find(c => c.value === record.category)?.label}</Tag>
        </Space>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <span style={{ color: '#f50' }}>
          ¥{price.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'error'}>
          {stock}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const option = statusOptions.find(s => s.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
      filters: statusOptions.map(status => ({ text: status.label, value: status.value })),
      onFilter: (value: any, record) => record.status === value,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
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
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleView = (record: ProductType) => {
    Modal.info({
      title: '产品详情',
      width: 600,
      content: (
        <div>
          <Image src={record.image} alt={record.name} width={200} />
          <p><strong>产品编码：</strong>{record.code}</p>
          <p><strong>产品名称：</strong>{record.name}</p>
          <p><strong>产品分类：</strong>{categoryOptions.find(c => c.value === record.category)?.label}</p>
          <p><strong>产品价格：</strong>¥{record.price.toLocaleString()}</p>
          <p><strong>库存数量：</strong>{record.stock}</p>
          <p><strong>产品状态：</strong>{statusOptions.find(s => s.value === record.status)?.label}</p>
          <p><strong>产品描述：</strong>{record.description}</p>
        </div>
      ),
    });
  };

  const handleEdit = (record: ProductType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: ProductType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个产品吗？',
      onOk() {
        setDataSource(dataSource.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        setDataSource(
          dataSource.map(item =>
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
        const newProduct = {
          key: Date.now().toString(),
          code: `P${String(dataSource.length + 1).padStart(3, '0')}`,
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setDataSource([...dataSource, newProduct]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input.Search
              placeholder="搜��产品编码或名称"
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="选择分类"
              style={{ width: 150 }}
              allowClear
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 150 }}
              allowClear
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
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
            新增产品
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingKey ? '编辑产品' : '新增产品'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="产品名称"
                rules={[{ required: true, message: '请输入产品名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="产品分类"
                rules={[{ required: true, message: '请选择产品分类' }]}
              >
                <Select>
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="产品价格"
                rules={[{ required: true, message: '请输入产品价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="库存数量"
                rules={[{ required: true, message: '请输入库存数量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="image"
            label="产品图片"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="产品状态"
            rules={[{ required: true, message: '请选择产品状态' }]}
          >
            <Select>
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="产品描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductList; 