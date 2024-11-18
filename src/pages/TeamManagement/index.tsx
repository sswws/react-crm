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
  Tabs,
  Progress,
  Avatar,
  List,
  Typography,
  Statistic,
  Calendar,
  Badge,
  Timeline,
  DatePicker,
  Tree,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  UsergroupAddOutlined,
  NotificationOutlined,
  CalendarOutlined,
  FlagOutlined,
  LikeOutlined,
  DislikeOutlined,
  StarOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  FolderOutlined,
  DownloadOutlined,
  UploadOutlined,
  AimOutlined,
  BarChartOutlined,
  WalletOutlined,
  PayCircleOutlined,
  BankOutlined,
  ReconciliationOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Area, Column, Pie } from '@ant-design/charts';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface TeamMemberType {
  key: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
}

interface TeamPerformanceType {
  key: string;
  member: string;
  deals: number;
  revenue: number;
  customers: number;
  conversion: number;
  period: string;
}

interface TeamGoalType {
  key: string;
  title: string;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface TeamAnnouncementType {
  key: string;
  title: string;
  content: string;
  type: string;
  createdBy: string;
  createdAt: string;
  expiredAt: string;
}

interface TeamRankingType {
  key: string;
  member: string;
  avatar: string;
  sales: number;
  deals: number;
  customers: number;
  score: number;
  rank: number;
  lastRank: number;
}

interface TeamRewardType {
  key: string;
  member: string;
  type: 'reward' | 'punishment';
  title: string;
  content: string;
  points: number;
  createdAt: string;
  createdBy: string;
}

interface TrainingType {
  key: string;
  title: string;
  type: string;
  trainer: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  participants: string[];
  materials: string[];
  description: string;
}

interface AttendanceType {
  key: string;
  member: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  remark: string;
}

// 添加文档接口
interface DocumentType {
  key: string;
  title: string;
  category: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

// 添加KPI接口
interface KPIType {
  key: string;
  member: string;
  indicator: string;
  target: number;
  actual: number;
  unit: string;
  weight: number;
  score: number;
  period: string;
}

// 添加团队活动接口
interface TeamActivityType {
  key: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  budget: number;
  expense: number;
  status: string;
  organizer: string;
  description: string;
}

// 添加团队经费接口
interface TeamExpenseType {
  key: string;
  title: string;
  type: string;
  amount: number;
  date: string;
  applicant: string;
  approver: string;
  status: string;
  category: string;
  receipt: string[];
  remark: string;
}

// 添加报表数据接口
interface TeamReportType {
  period: string;
  sales: number;
  deals: number;
  customers: number;
  conversion: number;
}

// 添加通讯录接口
interface ContactType {
  key: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  wechat: string;
  qq: string;
  address: string;
  birthday: string;
  joinDate: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

const TeamManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  // 模拟团队成员数据
  const mockMembers: TeamMemberType[] = [
    {
      key: '1',
      name: '张三',
      role: 'leader',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      email: 'zhang@example.com',
      phone: '13800138000',
      status: 'active',
      joinDate: '2024-01-01',
    },
    {
      key: '2',
      name: '李四',
      role: 'sales',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
      email: 'li@example.com',
      phone: '13800138001',
      status: 'active',
      joinDate: '2024-01-02',
    },
  ];

  // 模拟业绩数据
  const mockPerformance: TeamPerformanceType[] = [
    {
      key: '1',
      member: '张三',
      deals: 15,
      revenue: 500000,
      customers: 20,
      conversion: 75,
      period: '2024-03',
    },
    {
      key: '2',
      member: '李四',
      deals: 12,
      revenue: 420000,
      customers: 18,
      conversion: 65,
      period: '2024-03',
    },
  ];

  // 添加团队目标和公告状态
  const [goals, setGoals] = useState<TeamGoalType[]>([
    {
      key: '1',
      title: '第一季度销售目标',
      target: 1000000,
      current: 750000,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'active',
    },
    {
      key: '2',
      title: '新客户开发目标',
      target: 100,
      current: 65,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
    },
  ]);

  const [announcements, setAnnouncements] = useState<TeamAnnouncementType[]>([
    {
      key: '1',
      title: '三月份销售竞赛开始',
      content: '为促进团队业绩增长，公司决定开展为期一个月的销售竞赛...',
      type: 'important',
      createdBy: '张经理',
      createdAt: '2024-03-01',
      expiredAt: '2024-03-31',
    },
    {
      key: '2',
      title: '新产品培训通知',
      content: '本周五下午2点将在会议室进行新产品培训，请所有销售人员准时参加...',
      type: 'normal',
      createdBy: '李经理',
      createdAt: '2024-03-18',
      expiredAt: '2024-03-22',
    },
  ]);

  const [members, setMembers] = useState<TeamMemberType[]>(mockMembers);
  const [performance, setPerformance] = useState<TeamPerformanceType[]>(mockPerformance);

  // 添加团队排名和奖惩记录状态
  const [rankings] = useState<TeamRankingType[]>([
    {
      key: '1',
      member: '张三',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      sales: 500000,
      deals: 15,
      customers: 20,
      score: 95,
      rank: 1,
      lastRank: 2,
    },
    {
      key: '2',
      member: '李四',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
      sales: 420000,
      deals: 12,
      customers: 18,
      score: 88,
      rank: 2,
      lastRank: 1,
    },
  ]);

  const [rewards] = useState<TeamRewardType[]>([
    {
      key: '1',
      member: '张三',
      type: 'reward',
      title: '月度最佳员工',
      content: '三月份业绩突出，超额完成销售目标',
      points: 100,
      createdAt: '2024-03-20',
      createdBy: '王经理',
    },
    {
      key: '2',
      member: '李四',
      type: 'punishment',
      title: '客户投诉',
      content: '未及时跟进客户需求，造成客户不满',
      points: -20,
      createdAt: '2024-03-19',
      createdBy: '王经理',
    },
  ]);

  // 添加培训和考勤状态
  const [trainings] = useState<TrainingType[]>([
    {
      key: '1',
      title: '新产品培训',
      type: 'product',
      trainer: '王讲师',
      startTime: '2024-03-22 14:00',
      endTime: '2024-03-22 16:00',
      location: '会议室A',
      status: 'upcoming',
      participants: ['张三', '李四', '王五'],
      materials: ['产品手册.pdf', '培训PPT.pptx'],
      description: '新产品功能和销售技巧培训',
    },
    {
      key: '2',
      title: '销售技能提升',
      type: 'skill',
      trainer: '李讲师',
      startTime: '2024-03-25 09:00',
      endTime: '2024-03-25 12:00',
      location: '培训室B',
      status: 'completed',
      participants: ['张三', '李四'],
      materials: ['培训资料.pdf'],
      description: '销售话术和谈判技巧培训',
    },
  ]);

  const [attendance] = useState<AttendanceType[]>([
    {
      key: '1',
      member: '张三',
      date: '2024-03-20',
      checkIn: '08:55',
      checkOut: '18:05',
      status: 'normal',
      remark: '',
    },
    {
      key: '2',
      member: '李四',
      date: '2024-03-20',
      checkIn: '09:15',
      checkOut: '18:00',
      status: 'late',
      remark: '路上堵车',
    },
  ]);

  // 添加文档和KPI状态
  const [documents] = useState<DocumentType[]>([
    {
      key: '1',
      title: '销售手册2024版',
      category: '培训资料',
      size: 2048, // KB
      type: 'pdf',
      uploadedBy: '张经理',
      uploadedAt: '2024-03-01',
      downloads: 25,
    },
    {
      key: '2',
      title: '产品价格表',
      category: '销售资料',
      size: 512,
      type: 'xlsx',
      uploadedBy: '李经理',
      uploadedAt: '2024-03-15',
      downloads: 18,
    },
  ]);

  const [kpis] = useState<KPIType[]>([
    {
      key: '1',
      member: '张三',
      indicator: '销售额',
      target: 1000000,
      actual: 850000,
      unit: '元',
      weight: 40,
      score: 85,
      period: '2024-Q1',
    },
    {
      key: '2',
      member: '李四',
      indicator: '新客户数',
      target: 50,
      actual: 45,
      unit: '个',
      weight: 30,
      score: 90,
      period: '2024-Q1',
    },
  ]);

  // 添加团队活动和经费状态
  const [activities] = useState<TeamActivityType[]>([
    {
      key: '1',
      title: '团队建设活动',
      type: 'team_building',
      startTime: '2024-03-25 09:00',
      endTime: '2024-03-25 17:00',
      location: '欢乐谷',
      participants: ['张三', '李四', '王五'],
      budget: 5000,
      expense: 4500,
      status: 'upcoming',
      organizer: '张经理',
      description: '增进团队凝聚力的户外活动',
    },
    {
      key: '2',
      title: '季度总结会',
      type: 'meeting',
      startTime: '2024-03-30 14:00',
      endTime: '2024-03-30 17:00',
      location: '会议室A',
      participants: ['张三', '李四', '王五', '赵六'],
      budget: 1000,
      expense: 800,
      status: 'planned',
      organizer: '李经理',
      description: '2024年第一季度工作总结',
    },
  ]);

  const [expenses] = useState<TeamExpenseType[]>([
    {
      key: '1',
      title: '团建费用报销',
      type: 'team_building',
      amount: 4500,
      date: '2024-03-25',
      applicant: '张三',
      approver: '李经理',
      status: 'approved',
      category: '团队建设',
      receipt: ['receipt1.jpg'],
      remark: '团队建设活动费用',
    },
    {
      key: '2',
      title: '办公用品采购',
      type: 'office',
      amount: 2000,
      date: '2024-03-20',
      applicant: '李四',
      approver: '张经理',
      status: 'pending',
      category: '办公用品',
      receipt: ['receipt2.jpg'],
      remark: '打印纸、文具等',
    },
  ]);

  // 添加报表数据
  const [reportData] = useState<TeamReportType[]>([
    {
      period: '2024-01',
      sales: 350000,
      deals: 25,
      customers: 30,
      conversion: 75,
    },
    {
      period: '2024-02',
      sales: 420000,
      deals: 28,
      customers: 35,
      conversion: 80,
    },
    {
      period: '2024-03',
      sales: 480000,
      deals: 32,
      customers: 40,
      conversion: 85,
    },
  ]);

  // 添加通讯录数据
  const [contacts] = useState<ContactType[]>([
    {
      key: '1',
      name: '张三',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      department: '销售部',
      position: '销售总监',
      email: 'zhangsan@example.com',
      phone: '010-12345678',
      mobile: '13800138000',
      wechat: 'zhangsan_wx',
      qq: '123456789',
      address: '北京市朝阳区xxx街道xxx号',
      birthday: '1990-01-01',
      joinDate: '2020-01-01',
      emergencyContact: {
        name: '张小三',
        relation: '配偶',
        phone: '13900139000',
      },
    },
    // ... 可以添加更多联系人数据
  ]);

  // 团队成员表格列定义
  const memberColumns: ColumnsType<TeamMemberType> = [
    {
      title: '成员信息',
      key: 'info',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Tag color={record.role === 'leader' ? 'gold' : 'blue'}>
              {record.role === 'leader' ? '团队负责人' : '销售顾问'}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.email}</Text>
          <Text>{record.phone}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
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
              disabled={record.role === 'leader'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 业绩表格列定义
  const performanceColumns: ColumnsType<TeamPerformanceType> = [
    {
      title: '成员',
      dataIndex: 'member',
      key: 'member',
    },
    {
      title: '成交数',
      dataIndex: 'deals',
      key: 'deals',
      sorter: (a, b) => a.deals - b.deals,
    },
    {
      title: '销售额',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `¥${revenue.toLocaleString()}`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: '新增客户',
      dataIndex: 'customers',
      key: 'customers',
      sorter: (a, b) => a.customers - b.customers,
    },
    {
      title: '转化率',
      dataIndex: 'conversion',
      key: 'conversion',
      render: (conversion: number) => (
        <Progress percent={conversion} size="small" />
      ),
      sorter: (a, b) => a.conversion - b.conversion,
    },
    {
      title: '统计周期',
      dataIndex: 'period',
      key: 'period',
    },
  ];

  // 团队排名表格列定义
  const rankingColumns: ColumnsType<TeamRankingType> = [
    {
      title: '排名',
      key: 'rank',
      width: 100,
      render: (_, record) => (
        <Space>
          {record.rank <= 3 ? (
            <TrophyOutlined style={{ 
              color: ['#FFD700', '#C0C0C0', '#CD7F32'][record.rank - 1],
              fontSize: '20px'
            }} />
          ) : null}
          <span>{record.rank}</span>
          {record.rank < record.lastRank ? (
            <Tag color="success">↑{record.lastRank - record.rank}</Tag>
          ) : record.rank > record.lastRank ? (
            <Tag color="error">↓{record.rank - record.lastRank}</Tag>
          ) : (
            <Tag>-</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '成员',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} />
          <span>{record.member}</span>
        </Space>
      ),
    },
    {
      title: '销售额',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales: number) => `¥${sales.toLocaleString()}`,
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: '成交数',
      dataIndex: 'deals',
      key: 'deals',
      sorter: (a, b) => a.deals - b.deals,
    },
    {
      title: '新增客户',
      dataIndex: 'customers',
      key: 'customers',
      sorter: (a, b) => a.customers - b.customers,
    },
    {
      title: '综合评分',
      key: 'score',
      render: (_, record) => (
        <Space>
          <Progress
            percent={record.score}
            size="small"
            style={{ width: 100 }}
          />
          <span>{record.score}分</span>
        </Space>
      ),
      sorter: (a, b) => a.score - b.score,
    },
  ];

  const handleEdit = (record: TeamMemberType) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (record: TeamMemberType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个团队成员吗？',
      onOk() {
        setMembers(members.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey) {
        setMembers(
          members.map(item =>
            item.key === editingKey ? { ...item, ...values } : item
          )
        );
        message.success('更新成功');
      } else {
        const newMember = {
          key: Date.now().toString(),
          ...values,
          avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${Date.now()}`,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setMembers([...members, newMember]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 计算团队统计数据
  const teamStats = {
    totalDeals: performance.reduce((sum, item) => sum + item.deals, 0),
    totalRevenue: performance.reduce((sum, item) => sum + item.revenue, 0),
    totalCustomers: performance.reduce((sum, item) => sum + item.customers, 0),
    avgConversion: performance.reduce((sum, item) => sum + item.conversion, 0) / performance.length,
  };

  // 添加目标相关的处理函数
  const handleAddGoal = () => {
    // 实现添加目标的逻辑
  };

  const handleEditGoal = (goal: TeamGoalType) => {
    // 实现编辑目标的逻辑
  };

  // 添加公告相关的处理函数
  const handleAddAnnouncement = () => {
    // 实现添加公告的逻辑
  };

  const handleEditAnnouncement = (announcement: TeamAnnouncementType) => {
    // 实现编辑公告的逻辑
  };

  // 添加奖惩记录处理函数
  const handleAddReward = () => {
    // 实现添加奖惩记录的逻辑
  };

  // 添加培训相关的处理函数
  const handleAddTraining = () => {
    // 实现添加培训的逻辑
  };

  // 添加考勤相关的处理函数
  const handleAddAttendance = () => {
    // 实现添加考勤的逻辑
  };

  // 培训记录表格列定义
  const trainingColumns: ColumnsType<TrainingType> = [
    {
      title: '培训主题',
      key: 'title',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
          <Tag color={record.type === 'product' ? 'blue' : 'green'}>
            {record.type === 'product' ? '产品培训' : '技能培训'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '培训时间',
      key: 'time',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.startTime}</Text>
          <Text type="secondary">至</Text>
          <Text>{record.endTime}</Text>
        </Space>
      ),
    },
    {
      title: '讲师',
      dataIndex: 'trainer',
      key: 'trainer',
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'upcoming' ? 'processing' : 'success'}>
          {record.status === 'upcoming' ? '即将开始' : '已完成'}
        </Tag>
      ),
    },
    {
      title: '参与人数',
      key: 'participants',
      render: (_, record) => record.participants.length,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">查看详情</Button>
          <Button type="link">下载资料</Button>
        </Space>
      ),
    },
  ];

  // 考勤记录表格列定义
  const attendanceColumns: ColumnsType<AttendanceType> = [
    {
      title: '成员',
      dataIndex: 'member',
      key: 'member',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '签到时间',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (time: string, record) => (
        <Space>
          <Text>{time}</Text>
          {record.status === 'late' && <Tag color="warning">迟到</Tag>}
        </Space>
      ),
    },
    {
      title: '签退时间',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const statusMap = {
          normal: { color: 'success', text: '正常' },
          late: { color: 'warning', text: '迟到' },
          early: { color: 'warning', text: '早退' },
          absent: { color: 'error', text: '缺勤' },
        };
        const status = statusMap[record.status as keyof typeof statusMap];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 文档表格列定义
  const documentColumns: ColumnsType<DocumentType> = [
    {
      title: '文档名称',
      key: 'title',
      render: (_, record) => (
        <Space>
          <FileTextOutlined />
          <span>{record.title}</span>
          <Tag>{record.type.toUpperCase()}</Tag>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '培训资料', value: '培训资料' },
        { text: '销售资料', value: '销售资料' },
      ],
      onFilter: (value: any, record) => record.category === value,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024).toFixed(2)} MB`,
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: '上传信息',
      key: 'upload',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>{record.uploadedBy}</span>
          <Text type="secondary">{record.uploadedAt}</Text>
        </Space>
      ),
    },
    {
      title: '下载次数',
      dataIndex: 'downloads',
      key: 'downloads',
      sorter: (a, b) => a.downloads - b.downloads,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // KPI表格列定义
  const kpiColumns: ColumnsType<KPIType> = [
    {
      title: '成员',
      dataIndex: 'member',
      key: 'member',
    },
    {
      title: '指标',
      dataIndex: 'indicator',
      key: 'indicator',
    },
    {
      title: '目标值',
      key: 'target',
      render: (_, record) => `${record.target.toLocaleString()} ${record.unit}`,
    },
    {
      title: '实际值',
      key: 'actual',
      render: (_, record) => `${record.actual.toLocaleString()} ${record.unit}`,
    },
    {
      title: '完成率',
      key: 'completion',
      render: (_, record) => {
        const percentage = Math.round((record.actual / record.target) * 100);
        return <Progress percent={percentage} size="small" />;
      },
      sorter: (a, b) => (a.actual / a.target) - (b.actual / b.target),
    },
    {
      title: '权重',
      key: 'weight',
      render: (_, record) => `${record.weight}%`,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={score >= 90 ? 'success' : score >= 60 ? 'warning' : 'error'}>
          {score}分
        </Tag>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: '考核周期',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<BarChartOutlined />}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 添加文档相关的处理函数
  const handleUploadDocument = () => {
    // 实现文档上传逻辑
  };

  // 添加KPI相关的处理函数
  const handleAddKPI = () => {
    // 实现添加KPI逻辑
  };

  // 活动类型选项
  const activityTypes = [
    { label: '团队建设', value: 'team_building' },
    { label: '培训会议', value: 'training' },
    { label: '工作会', value: 'meeting' },
    { label: '庆祝活动', value: 'celebration' },
  ];

  // 经费类型选项
  const expenseTypes = [
    { label: '团队建设', value: 'team_building' },
    { label: '办公用品', value: 'office' },
    { label: '差旅费用', value: 'travel' },
    { label: '培训费用', value: 'training' },
  ];

  // 活动表格列定义
  const activityColumns: ColumnsType<TeamActivityType> = [
    {
      title: '活动名称',
      key: 'title',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
          <Tag color={record.type === 'team_building' ? 'green' : 'blue'}>
            {activityTypes.find(t => t.value === record.type)?.label}
          </Tag>
        </Space>
      ),
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.startTime}</Text>
          <Text type="secondary">至</Text>
          <Text>{record.endTime}</Text>
        </Space>
      ),
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '参与人数',
      key: 'participants',
      render: (_, record) => `${record.participants.length}人`,
      sorter: (a, b) => a.participants.length - b.participants.length,
    },
    {
      title: '预算/支出',
      key: 'budget',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>预算: ¥{record.budget.toLocaleString()}</Text>
          <Text type={record.expense > record.budget ? 'danger' : 'success'}>
            支出: ¥{record.expense.toLocaleString()}
          </Text>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const statusMap = {
          planned: { color: 'default', text: '计划中' },
          upcoming: { color: 'processing', text: '即将开始' },
          ongoing: { color: 'warning', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
          cancelled: { color: 'error', text: '已取消' },
        };
        const status = statusMap[record.status as keyof typeof statusMap];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '组织者',
      dataIndex: 'organizer',
      key: 'organizer',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">查看详情</Button>
          <Button type="link">编辑</Button>
          <Button type="link" danger>取消</Button>
        </Space>
      ),
    },
  ];

  // 经费表格列定义
  const expenseColumns: ColumnsType<TeamExpenseType> = [
    {
      title: '支出项目',
      key: 'title',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
          <Tag color={record.type === 'team_building' ? 'green' : 'blue'}>
            {expenseTypes.find(t => t.value === record.type)?.label}
          </Tag>
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text type="danger">¥{amount.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '申请日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const statusMap = {
          pending: { color: 'processing', text: '待审批' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' },
          completed: { color: 'default', text: '已报销' },
        };
        const status = statusMap[record.status as keyof typeof statusMap];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">查看详情</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link">审批</Button>
              <Button type="link" danger>拒绝</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 添加活动相关的处理函数
  const handleAddActivity = () => {
    // 实现添加活动的逻辑
  };

  // 添加经费相关的处理函数
  const handleAddExpense = () => {
    // 实现添加经费的逻辑
  };

  // 销售趋势图配置
  const salesTrendConfig = {
    data: reportData,
    xField: 'period',
    yField: 'sales',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    line: {
      color: '#1890ff',
    },
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '销售额 (¥)',
      },
    },
  };

  // 业绩分布图配置
  const performanceDistConfig = {
    data: members.map(member => ({
      name: member.name,
      value: mockPerformance.find(p => p.member === member.name)?.revenue || 0,
    })),
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
  };

  // 团队活动统计图配置
  const activityStatsConfig = {
    data: activities.map(activity => ({
      type: activityTypes.find(t => t.value === activity.type)?.label || '',
      count: 1,
    })).reduce((acc, curr) => {
      const existing = acc.find(item => item.type === curr.type);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as { type: string; count: number }[]),
    xField: 'type',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: {
        alias: '活动类型',
      },
      count: {
        alias: '次数',
      },
    },
  };

  // 考勤统计数据
  const attendanceStats = {
    normal: attendance.filter(a => a.status === 'normal').length,
    late: attendance.filter(a => a.status === 'late').length,
    early: attendance.filter(a => a.status === 'early').length,
    absent: attendance.filter(a => a.status === 'absent').length,
  };

  return (
    <div>
      <Title level={4}>团队管理</Title>

      {/* 团队概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={members.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月成交"
              value={teamStats.totalDeals}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售额"
              value={teamStats.totalRevenue}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均转化率"
              value={teamStats.avgConversion}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'members',
                  label: '团队成员',
                  children: (
                    <>
                      <Row justify="end" style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<UsergroupAddOutlined />}
                          onClick={() => {
                            form.resetFields();
                            setEditingKey('');
                            setIsModalVisible(true);
                          }}
                        >
                          添加成员
                        </Button>
                      </Row>
                      <Table
                        columns={memberColumns}
                        dataSource={members}
                        loading={loading}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'performance',
                  label: '业绩统计',
                  children: (
                    <Table
                      columns={performanceColumns}
                      dataSource={performance}
                      loading={loading}
                      pagination={false}
                    />
                  ),
                },
                {
                  key: 'goals',
                  label: '团队目标',
                  children: (
                    <>
                      <Row justify="end" style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<FlagOutlined />}
                          onClick={handleAddGoal}
                        >
                          设置目标
                        </Button>
                      </Row>
                      <List
                        dataSource={goals}
                        renderItem={goal => (
                          <List.Item
                            actions={[
                              <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => handleEditGoal(goal)}
                              >
                                编辑
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              title={goal.title}
                              description={`${goal.startDate} 至 ${goal.endDate}`}
                            />
                            <div>
                              <Progress
                                percent={Math.round((goal.current / goal.target) * 100)}
                                format={percent => (
                                  <span>
                                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                                    <br />
                                    {percent}%
                                  </span>
                                )}
                                type="circle"
                                width={80}
                              />
                            </div>
                          </List.Item>
                        )}
                      />
                    </>
                  ),
                },
                {
                  key: 'ranking',
                  label: '团队排名',
                  children: (
                    <Table
                      columns={rankingColumns}
                      dataSource={rankings}
                      pagination={false}
                    />
                  ),
                },
                {
                  key: 'rewards',
                  label: '奖惩记录',
                  children: (
                    <>
                      <Row justify="end" style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<StarOutlined />}
                          onClick={handleAddReward}
                        >
                          添加奖惩
                        </Button>
                      </Row>
                      <Timeline
                        items={rewards.map(reward => ({
                          color: reward.type === 'reward' ? 'green' : 'red',
                          dot: reward.type === 'reward' ? <LikeOutlined /> : <DislikeOutlined />,
                          children: (
                            <Card size="small">
                              <Space direction="vertical">
                                <Space>
                                  <Text strong>{reward.member}</Text>
                                  <Tag color={reward.type === 'reward' ? 'success' : 'error'}>
                                    {reward.type === 'reward' ? '+' : ''}{reward.points}分
                                  </Tag>
                                </Space>
                                <Text strong>{reward.title}</Text>
                                <Text>{reward.content}</Text>
                                <Text type="secondary">
                                  {reward.createdBy} · {reward.createdAt}
                                </Text>
                              </Space>
                            </Card>
                          ),
                        }))}
                      />
                    </>
                  ),
                },
                {
                  key: 'training',
                  label: '培训记录',
                  children: (
                    <>
                      <Row justify="end" style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<BookOutlined />}
                          onClick={handleAddTraining}
                        >
                          安排培训
                        </Button>
                      </Row>
                      <Table
                        columns={trainingColumns}
                        dataSource={trainings}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'attendance',
                  label: '考勤管理',
                  children: (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Space>
                          <DatePicker.RangePicker />
                          <Select
                            placeholder="选择状态"
                            style={{ width: 120 }}
                            allowClear
                          >
                            <Option value="normal">正常</Option>
                            <Option value="late">迟到</Option>
                            <Option value="early">早退</Option>
                            <Option value="absent">缺勤</Option>
                          </Select>
                        </Space>
                        <Button
                          type="primary"
                          icon={<ScheduleOutlined />}
                          onClick={handleAddAttendance}
                        >
                          记录考勤
                        </Button>
                      </Row>
                      <Table
                        columns={attendanceColumns}
                        dataSource={attendance}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'documents',
                  label: '团队文档',
                  children: (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                          <Space>
                            <Input.Search
                              placeholder="搜索文档"
                              style={{ width: 300 }}
                            />
                            <Select
                              placeholder="选择分类"
                              style={{ width: 150 }}
                              allowClear
                            >
                              <Option value="培训资料">培训资料</Option>
                              <Option value="销售资料">销售资料</Option>
                            </Select>
                          </Space>
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={handleUploadDocument}
                          >
                            上传文档
                          </Button>
                        </Col>
                      </Row>
                      <Table
                        columns={documentColumns}
                        dataSource={documents}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'kpi',
                  label: 'KPI设置',
                  children: (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                          <Space>
                            <Select defaultValue="2024-Q1" style={{ width: 120 }}>
                              <Option value="2024-Q1">2024年Q1</Option>
                              <Option value="2024-Q2">2024年Q2</Option>
                            </Select>
                          </Space>
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            icon={<AimOutlined />}
                            onClick={handleAddKPI}
                          >
                            设置KPI
                          </Button>
                        </Col>
                      </Row>
                      <Table
                        columns={kpiColumns}
                        dataSource={kpis}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'activities',
                  label: '团队活动',
                  children: (
                    <>
                      <Row justify="end" style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<CalendarOutlined />}
                          onClick={handleAddActivity}
                        >
                          发起活动
                        </Button>
                      </Row>
                      <Table
                        columns={activityColumns}
                        dataSource={activities}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'expenses',
                  label: '经费管理',
                  children: (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Space>
                          <Statistic
                            title="本月预���"
                            value={10000}
                            prefix={<WalletOutlined />}
                            suffix="¥"
                          />
                          <Statistic
                            title="已使用"
                            value={6500}
                            prefix={<PayCircleOutlined />}
                            suffix="¥"
                          />
                          <Statistic
                            title="剩余"
                            value={3500}
                            prefix={<BankOutlined />}
                            suffix="¥"
                          />
                        </Space>
                        <Button
                          type="primary"
                          icon={<ReconciliationOutlined />}
                          onClick={handleAddExpense}
                        >
                          申请报销
                        </Button>
                      </Row>
                      <Table
                        columns={expenseColumns}
                        dataSource={expenses}
                        pagination={false}
                      />
                    </>
                  ),
                },
                {
                  key: 'reports',
                  label: '团队报表',
                  children: (
                    <div>
                      <Row gutter={[16, 16]}>
                        {/* 销售趋势 */}
                        <Col span={24}>
                          <Card title="销售趋势">
                            <Area {...salesTrendConfig} height={300} />
                          </Card>
                        </Col>

                        {/* 业绩分布 */}
                        <Col span={12}>
                          <Card title="业绩分布">
                            <Pie {...performanceDistConfig} height={300} />
                          </Card>
                        </Col>

                        {/* 活动统计 */}
                        <Col span={12}>
                          <Card title="活动统计">
                            <Column {...activityStatsConfig} height={300} />
                          </Card>
                        </Col>

                        {/* 考勤统计 */}
                        <Col span={12}>
                          <Card title="考勤统计">
                            <Row gutter={16}>
                              <Col span={6}>
                                <Statistic
                                  title="正常"
                                  value={attendanceStats.normal}
                                  valueStyle={{ color: '#3f8600' }}
                                />
                              </Col>
                              <Col span={6}>
                                <Statistic
                                  title="迟到"
                                  value={attendanceStats.late}
                                  valueStyle={{ color: '#faad14' }}
                                />
                              </Col>
                              <Col span={6}>
                                <Statistic
                                  title="早退"
                                  value={attendanceStats.early}
                                  valueStyle={{ color: '#faad14' }}
                                />
                              </Col>
                              <Col span={6}>
                                <Statistic
                                  title="缺勤"
                                  value={attendanceStats.absent}
                                  valueStyle={{ color: '#cf1322' }}
                                />
                              </Col>
                            </Row>
                            <div style={{ marginTop: 24 }}>
                              <Progress
                                percent={Math.round(
                                  (attendanceStats.normal /
                                    Object.values(attendanceStats).reduce((a, b) => a + b, 0)) *
                                    100
                                )}
                                status="active"
                              />
                            </div>
                          </Card>
                        </Col>

                        {/* KPI 完成情况 */}
                        <Col span={12}>
                          <Card title="KPI 完成情况">
                            <List
                              dataSource={kpis}
                              renderItem={item => (
                                <List.Item>
                                  <List.Item.Meta
                                    title={`${item.member} - ${item.indicator}`}
                                    description={
                                      <Progress
                                        percent={Math.round((item.actual / item.target) * 100)}
                                        status={
                                          item.actual >= item.target
                                            ? 'success'
                                            : item.actual >= item.target * 0.8
                                            ? 'active'
                                            : 'exception'
                                        }
                                      />
                                    }
                                  />
                                  <div>
                                    {item.actual.toLocaleString()} / {item.target.toLocaleString()} {item.unit}
                                  </div>
                                </List.Item>
                              )}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: 'contacts',
                  label: '通讯录',
                  children: (
                    <div>
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Card>
                            <Tree
                              defaultExpandAll
                              treeData={[
                                {
                                  title: '销售部',
                                  key: 'sales',
                                  children: [
                                    { title: '销售一组', key: 'sales-1' },
                                    { title: '销售二组', key: 'sales-2' },
                                  ],
                                },
                                {
                                  title: '技术部',
                                  key: 'tech',
                                  children: [
                                    { title: '开发组', key: 'dev' },
                                    { title: '测试组', key: 'qa' },
                                  ],
                                },
                              ]}
                            />
                          </Card>
                        </Col>
                        <Col span={18}>
                          <Card>
                            <Row justify="space-between" style={{ marginBottom: 16 }}>
                              <Space>
                                <Input.Search
                                  placeholder="搜索成员"
                                  style={{ width: 200 }}
                                />
                                <Select
                                  placeholder="选择部门"
                                  style={{ width: 150 }}
                                  allowClear
                                >
                                  <Option value="sales">销售部</Option>
                                  <Option value="tech">技术部</Option>
                                </Select>
                              </Space>
                              <Space>
                                <Button icon={<DownloadOutlined />}>导出</Button>
                                <Button icon={<UploadOutlined />}>导入</Button>
                                <Button type="primary" icon={<PlusOutlined />}>
                                  添加成员
                                </Button>
                              </Space>
                            </Row>
                            <List
                              grid={{ gutter: 16, column: 2 }}
                              dataSource={contacts}
                              renderItem={contact => (
                                <List.Item>
                                  <Card>
                                    <Row gutter={16}>
                                      <Col span={8}>
                                        <Avatar
                                          size={100}
                                          src={contact.avatar}
                                        />
                                      </Col>
                                      <Col span={16}>
                                        <Space direction="vertical" size={0}>
                                          <Space>
                                            <Text strong>{contact.name}</Text>
                                            <Tag color="blue">{contact.position}</Tag>
                                          </Space>
                                          <Text type="secondary">{contact.department}</Text>
                                          <Space>
                                            <PhoneOutlined />
                                            <Text copyable>{contact.mobile}</Text>
                                          </Space>
                                          <Space>
                                            <MailOutlined />
                                            <Text copyable>{contact.email}</Text>
                                          </Space>
                                          <Space>
                                            <WechatOutlined />
                                            <Text copyable>{contact.wechat}</Text>
                                          </Space>
                                        </Space>
                                      </Col>
                                    </Row>
                                    <Divider />
                                    <Row justify="end">
                                      <Space>
                                        <Button type="link" icon={<EditOutlined />}>
                                          编辑
                                        </Button>
                                        <Button type="link" icon={<DeleteOutlined />} danger>
                                          删除
                                        </Button>
                                      </Space>
                                    </Row>
                                  </Card>
                                </List.Item>
                              )}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="团队公告"
            extra={
              <Button
                type="primary"
                icon={<NotificationOutlined />}
                onClick={handleAddAnnouncement}
              >
                发布公告
              </Button>
            }
          >
            <Timeline
              items={announcements.map(announcement => ({
                color: announcement.type === 'important' ? 'red' : 'blue',
                children: (
                  <>
                    <div style={{ fontWeight: 'bold' }}>{announcement.title}</div>
                    <div>{announcement.content}</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>
                      {announcement.createdBy} · {announcement.createdAt}
                    </div>
                  </>
                ),
              }))}
            />
          </Card>
          <Card title="团队日程" style={{ marginTop: 16 }}>
            <Calendar
              fullscreen={false}
              dateCellRender={(date) => {
                const events = [
                  { date: '2024-03-22', content: '团队会议', type: 'warning' },
                  { date: '2024-03-25', content: '产品培训', type: 'success' },
                  // 可以添加更多日程
                ];
                const dateStr = date.format('YYYY-MM-DD');
                const todayEvents = events.filter(e => e.date === dateStr);
                return todayEvents.map(event => (
                  <Badge status={event.type as any} text={event.content} />
                ));
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingKey ? '编辑成员' : '添加成员'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: 'sales', status: 'active' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select>
                  <Option value="leader">团队负责人</Option>
                  <Option value="sales">销售顾问</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[
                  { required: true, message: '请输入电话' },
                  { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="active">在职</Option>
              <Option value="inactive">离职</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamManagement; 