import { useState, useRef } from 'react';
import { Button, ProgressBar, Popup, Toast } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import type { StorySummary, StepTwoData, StoryboardDetail } from './types/story';
import StepChat, { StepChatRef } from './components/StepChat';
import DataCard from './components/DataCard';
import LoginPage from './components/LoginPage';
import { isAuthenticated, removeToken } from './services/authService';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [current, setCurrent] = useState(0);
  const [summary, setSummary] = useState<StorySummary | null>(null);
  const [elements, setElements] = useState<StepTwoData | null>(null);
  const [details, setDetails] = useState<StoryboardDetail[] | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const stepChatRef = useRef<StepChatRef>(null);

  // 登录成功处理
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 登出处理
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    // 重置所有状态
    setCurrent(0);
    setSummary(null);
    setElements(null);
    setDetails(null);
    Toast.show({
      icon: 'success',
      content: '已退出登录',
    });
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const steps = [
    {
      title: '故事概要',
      description: '输入提示生成故事概要',
    },
    {
      title: '核心元素',
      description: '生成人物、物品、场景和分镜',
    },
    {
      title: '分镜详情',
      description: '生成详细的分镜描述',
    },
  ];

  const handleNext = () => {
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  // 判断是否可以进入下一步
  const canGoNext = () => {
    switch (current) {
      case 0:
        return summary !== null;
      case 1:
        return elements !== null;
      case 2:
        return false; // 最后一步没有下一步
      default:
        return false;
    }
  };

  return (
    <div className="app-container">
      {/* 顶部栏 */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="progress-indicator">第 {current + 1}/3 步</div>
          <div className="progress-title">{steps[current].title}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            color="primary"
            fill="outline"
            className="view-data-btn"
            onClick={() => setDrawerVisible(true)}
          >
            <RightOutline /> 查看数据
          </Button>
          <Button
            size="small"
            fill="outline"
            onClick={handleLogout}
          >
            退出
          </Button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="progress-bar-wrapper">
        <ProgressBar percent={((current + 1) / 3) * 100} />
      </div>

      {/* 聊天区域 */}
      <div className="chat-area">
        <StepChat
          ref={stepChatRef}
          step={current}
          summary={summary}
          setSummary={setSummary}
          elements={elements}
          setElements={setElements}
          setDetails={setDetails}
        />
      </div>

      {/* 底部固定操作栏 */}
      <div className="bottom-bar">
        <Button
          className="bottom-bar-btn"
          onClick={handlePrev}
          disabled={current === 0}
          size="small"
        >
          上一步
        </Button>
        <Button
          className="bottom-bar-btn"
          color="primary"
          onClick={handleNext}
          disabled={!canGoNext()}
          size="small"
        >
          {current === 2 ? '完成' : '下一步'}
        </Button>
      </div>

      {/* 数据抽屉 */}
      <Popup
        visible={drawerVisible}
        onMaskClick={() => setDrawerVisible(false)}
        position="right"
        bodyStyle={{
          width: '85vw',
          height: '100vh',
        }}
      >
        <DataCard
          currentStep={current}
          summary={summary}
          elements={elements}
          details={details}
          onClose={() => setDrawerVisible(false)}
        />
      </Popup>
    </div>
  );
};

export default App;
