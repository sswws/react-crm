import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 检查是否登录
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查权限
  const hasPermission = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => user?.permissions?.includes(permission));

  if (!hasPermission) {
    console.log('Required permissions:', requiredPermissions);
    console.log('User permissions:', user?.permissions);
    return <Navigate to="/403" replace />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      {children}
    </Suspense>
  );
};

export default AuthGuard; 