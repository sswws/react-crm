import React from 'react';
import { Spin } from 'antd';

const LoadingPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      minHeight: '200px'
    }}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage; 