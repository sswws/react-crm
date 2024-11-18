import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';
import './styles/layout.css';
import { registerMap } from './utils/registerMap';

// 判断是否需要主布局的路由
const noLayoutRoutes = ['/login', '/register', '/404', '/403'];

function App() {
  useEffect(() => {
    registerMap();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            // 确保路由路径存在
            if (!route.path) return null;

            // 登录和注册页面不使用主布局
            if (noLayoutRoutes.includes(route.path)) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            }

            // 其他页面使用主布局
            if (route.children) {
              return (
                <Route key={route.path} path={route.path}>
                  <Route
                    index
                    element={
                      <MainLayout>
                        {route.element}
                      </MainLayout>
                    }
                  />
                  {route.children.map((child) => {
                    // 确保子路由路径存在
                    if (!child.path) return null;
                    
                    return (
                      <Route
                        key={child.path}
                        path={child.path}
                        element={
                          <MainLayout>
                            {child.element}
                          </MainLayout>
                        }
                      />
                    );
                  })}
                </Route>
              );
            }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <MainLayout>
                    {route.element}
                  </MainLayout>
                }
              />
            );
          })}
          {/* 默认重定向到登录页 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
