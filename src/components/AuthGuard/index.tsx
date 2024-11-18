import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingPage from '../LoadingPage';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

// 模拟用户权限，实际项目中应该从用户状态或后端获取
const userPermissions = [
  'dashboard',
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'roles.view',
  'roles.manage',
  'permissions.manage',
  'teams',
  'settings',
  // 客户管理权限
  'customers.view',
  'customers.contacts.view',
  'customers.follow.view',
  // 商机管理权限
  'business.opportunities.view',
  'business.contracts.view',
  'business.quotes.view',
  // 营销管理权限
  'marketing.campaigns.view',
  'marketing.leads.view',
  // 产品管理权限
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  'products.categories.view',
  'products.categories.manage',
];

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  // 检查是否登录，这里模拟已登录状态
  const isAuthenticated = true;

  // 检查权限
  const hasPermission = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => userPermissions.includes(permission));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      {children}
    </Suspense>
  );
};

export default AuthGuard; 