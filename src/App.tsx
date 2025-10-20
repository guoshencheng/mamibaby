import { useState } from 'react';
import { Steps, Card, Button, Space, Typography, Row, Col, Alert } from 'antd';
import type { StorySummary, StepTwoData, StoryboardDetail } from './types/story';
import StepChat from './components/StepChat';
import DataCard from './components/DataCard';
import { validateAIConfig } from './config/ai';

const { Title } = Typography;

const App = () => {
  const [current, setCurrent] = useState(0);
  const [summary, setSummary] = useState<StorySummary | null>(null);
  const [elements, setElements] = useState<StepTwoData | null>(null);
  const [details, setDetails] = useState<StoryboardDetail[] | null>(null);

  // 验证配置
  const configCheck = validateAIConfig();

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
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        绘本故事生成器 🎨
      </Title>

      {/* 配置验证提示 */}
      {!configCheck.valid && (
        <Alert
          message="配置提醒"
          description={
            <div>
              {configCheck.error}
              <br />
              请在项目根目录创建 <code>.env.local</code> 文件并配置：
              <pre style={{ marginTop: '8px', backgroundColor: '#f5f5f5', padding: '8px' }}>
                VITE_ALICLOUD_API_KEY=your-api-key
                <br />
                VITE_ALICLOUD_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
                <br />
                VITE_ALICLOUD_MODEL=qwen-turbo
              </pre>
              配置完成后请重启开发服务器。
            </div>
          }
          type="warning"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* 步骤条 */}
      <Card style={{ marginBottom: '16px' }}>
        <Steps current={current} items={steps} />
      </Card>

      {/* 主内容区域：左侧聊天 + 右侧数据卡片 */}
      <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
        {/* 左侧：聊天框 */}
        <Col span={14} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Card
            title={`第 ${current + 1} 步：${steps[current].title}`}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}
            bodyStyle={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
          >
            <StepChat
              step={current}
              summary={summary}
              setSummary={setSummary}
              elements={elements}
              setElements={setElements}
              setDetails={setDetails}
            />
          </Card>
        </Col>

        {/* 右侧：数据展示卡片 */}
        <Col span={10} style={{ height: '100%' }}>
          <DataCard
            currentStep={current}
            summary={summary}
            elements={elements}
            details={details}
          />
        </Col>
      </Row>

      {/* 底部：步骤控制按钮 */}
      <Card style={{ marginTop: '16px' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handlePrev} disabled={current === 0}>
            上一步
          </Button>
          <div style={{ color: '#999' }}>
            {current === 0 && '💡 输入故事提示开始创作'}
            {current === 1 && '💡 发送消息生成核心元素'}
            {current === 2 && '💡 发送消息生成分镜详情'}
          </div>
          <Button type="primary" onClick={handleNext} disabled={!canGoNext()}>
            {current === 2 ? '完成' : '下一步'}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default App;
