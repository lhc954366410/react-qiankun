import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const NoFoundPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="没找到您需要看的页面！"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
};

export default NoFoundPage;
