import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
// 客户管理
const CustomerList = lazy(() => import('@/pages/CustomerManagement/CustomerList'));
const ContactList = lazy(() => import('@/pages/CustomerManagement/ContactList'));
const FollowUpList = lazy(() => import('@/pages/CustomerManagement/FollowUpList'));
// 商机管理
const OpportunityList = lazy(() => import('@/pages/BusinessManagement/OpportunityList'));
const ContractList = lazy(() => import('@/pages/BusinessManagement/ContractList'));
const QuoteList = lazy(() => import('@/pages/BusinessManagement/QuoteList'));
// 营销管理
const CampaignList = lazy(() => import('@/pages/MarketingManagement/CampaignList'));
const LeadList = lazy(() => import('@/pages/MarketingManagement/LeadList'));
// 用户管理
const UserList = lazy(() => import('@/pages/UserManagement/UserList'));
const RoleManagement = lazy(() => import('@/pages/UserManagement/RoleManagement'));
const PermissionSettings = lazy(() => import('@/pages/UserManagement/PermissionSettings'));
// 其他
const TeamManagement = lazy(() => import('@/pages/TeamManagement'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));
// 添加产品管理相关的导入
const ProductList = lazy(() => import('@/pages/ProductManagement/ProductList'));
const CategoryList = lazy(() => import('@/pages/ProductManagement/CategoryList'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Register = lazy(() => import('@/pages/Auth/Register'));

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <AuthGuard requiredPermissions={['dashboard']}>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: 'customers',
    children: [
      {
        path: 'list',
        element: (
          <AuthGuard requiredPermissions={['customers.view']}>
            <CustomerList />
          </AuthGuard>
        ),
      },
      {
        path: 'contacts',
        element: (
          <AuthGuard requiredPermissions={['customers.contacts.view']}>
            <ContactList />
          </AuthGuard>
        ),
      },
      {
        path: 'follow',
        element: (
          <AuthGuard requiredPermissions={['customers.follow.view']}>
            <FollowUpList />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: 'business',
    children: [
      {
        path: 'opportunities',
        element: (
          <AuthGuard requiredPermissions={['business.opportunities.view']}>
            <OpportunityList />
          </AuthGuard>
        ),
      },
      {
        path: 'contracts',
        element: (
          <AuthGuard requiredPermissions={['business.contracts.view']}>
            <ContractList />
          </AuthGuard>
        ),
      },
      {
        path: 'quotes',
        element: (
          <AuthGuard requiredPermissions={['business.quotes.view']}>
            <QuoteList />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: 'marketing',
    children: [
      {
        path: 'campaigns',
        element: (
          <AuthGuard requiredPermissions={['marketing.campaigns.view']}>
            <CampaignList />
          </AuthGuard>
        ),
      },
      {
        path: 'leads',
        element: (
          <AuthGuard requiredPermissions={['marketing.leads.view']}>
            <LeadList />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: 'users',
    children: [
      {
        path: 'list',
        element: (
          <AuthGuard requiredPermissions={['users.view']}>
            <UserList />
          </AuthGuard>
        ),
      },
      {
        path: 'roles',
        element: (
          <AuthGuard requiredPermissions={['roles.view']}>
            <RoleManagement />
          </AuthGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <AuthGuard requiredPermissions={['permissions.manage']}>
            <PermissionSettings />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: 'teams',
    element: (
      <AuthGuard requiredPermissions={['teams']}>
        <TeamManagement />
      </AuthGuard>
    ),
  },
  {
    path: 'settings',
    element: (
      <AuthGuard requiredPermissions={['settings']}>
        <Settings />
      </AuthGuard>
    ),
  },
  {
    path: 'products',
    children: [
      {
        path: 'list',
        element: (
          <AuthGuard requiredPermissions={['products.view']}>
            <ProductList />
          </AuthGuard>
        ),
      },
      {
        path: 'categories',
        element: (
          <AuthGuard requiredPermissions={['products.categories.view']}>
            <CategoryList />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 