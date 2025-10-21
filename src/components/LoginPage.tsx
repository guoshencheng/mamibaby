import { useState } from 'react';
import { Form, Input, Button, Toast } from 'antd-mobile';
import { login, setToken } from '../services/authService';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await login(values);
      
      // 保存 Token
      setToken(response.token);
      
      Toast.show({
        icon: 'success',
        content: '登录成功！',
      });

      // 通知父组件登录成功
      onLoginSuccess();
    } catch (error) {
      console.error('登录失败:', error);
      Toast.show({
        icon: 'fail',
        content: error instanceof Error ? error.message : '登录失败',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🎨 MamiBaby</h1>
          <p>绘本故事生成器</p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={loading}
            >
              登录
            </Button>
          }
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" clearable />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type="password" placeholder="请输入密码" clearable />
          </Form.Item>
        </Form>

        <div className="login-hint">
          <p>默认账号：guest</p>
          <p>默认密码：iamguest123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

