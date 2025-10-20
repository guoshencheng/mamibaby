import { Card, Descriptions, List, Empty, Typography, Divider } from 'antd';
import type { StorySummary, StepTwoData, StoryboardDetail } from '../types/story';

const { Title, Paragraph } = Typography;

interface DataCardProps {
  currentStep: number;
  summary: StorySummary | null;
  elements: StepTwoData | null;
  details: StoryboardDetail[] | null;
}

const DataCard: React.FC<DataCardProps> = ({ currentStep, summary, elements, details }) => {
  // 第一步：显示故事概要
  const renderStepOne = () => {
    if (!summary) {
      return <Empty description="还未生成故事概要" />;
    }

    return (
      <div>
        <Title level={4}>故事概要</Title>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="用户提示">{summary.prompt}</Descriptions.Item>
          <Descriptions.Item label="生成的概要">
            <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {summary.summary}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // 第二步：显示核心元素
  const renderStepTwo = () => {
    if (!elements) {
      return <Empty description="还未生成核心元素" />;
    }

    return (
      <div>
        <Title level={4}>核心元素</Title>

        <Divider orientation="left">关键人物</Divider>
        <List
          dataSource={elements.characters}
          renderItem={(character) => (
            <List.Item>
              <Descriptions title={character.name} column={1} bordered size="small" style={{ width: '100%' }}>
                <Descriptions.Item label="外貌">{character.appearance}</Descriptions.Item>
                <Descriptions.Item label="衣物">{character.clothing}</Descriptions.Item>
                <Descriptions.Item label="性格">{character.personality}</Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />

        <Divider orientation="left">关键物品</Divider>
        <List
          dataSource={elements.keyItems}
          renderItem={(item) => (
            <List.Item>
              <Descriptions title={item.name} column={1} bordered size="small" style={{ width: '100%' }}>
                <Descriptions.Item label="描述">{item.description}</Descriptions.Item>
                <Descriptions.Item label="特征">{item.features}</Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />

        <Divider orientation="left">场景特征</Divider>
        <List
          dataSource={elements.sceneFeatures}
          renderItem={(scene) => (
            <List.Item>
              <Descriptions title={scene.name} column={1} bordered size="small" style={{ width: '100%' }}>
                <Descriptions.Item label="环境">{scene.environment}</Descriptions.Item>
                <Descriptions.Item label="时间">{scene.time}</Descriptions.Item>
                <Descriptions.Item label="氛围">{scene.atmosphere}</Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />

        <Divider orientation="left">分镜概要</Divider>
        <List
          dataSource={elements.storyboardSummaries}
          renderItem={(storyboard) => (
            <List.Item>
              <Descriptions
                title={`分镜 ${storyboard.sequence}`}
                column={1}
                bordered
                size="small"
                style={{ width: '100%' }}
              >
                <Descriptions.Item label="场景">{storyboard.sceneDescription}</Descriptions.Item>
                {storyboard.dialogue && (
                  <Descriptions.Item label="对话">{storyboard.dialogue}</Descriptions.Item>
                )}
              </Descriptions>
            </List.Item>
          )}
        />
      </div>
    );
  };

  // 第三步：显示分镜详情
  const renderStepThree = () => {
    if (!details) {
      return <Empty description="还未生成分镜详情" />;
    }

    return (
      <div>
        <Title level={4}>分镜详情</Title>
        <List
          dataSource={details}
          renderItem={(detail, index) => (
            <List.Item>
              <Descriptions
                title={`详情 ${index + 1}`}
                column={1}
                bordered
                size="small"
                style={{ width: '100%' }}
              >
                <Descriptions.Item label="关联分镜">{detail.summaryId}</Descriptions.Item>
                <Descriptions.Item label="详细描述">
                  <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {detail.detailedDescription}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="镜头角度">{detail.cameraAngle}</Descriptions.Item>
                <Descriptions.Item label="人物动作">{detail.characterActions}</Descriptions.Item>
                <Descriptions.Item label="视觉元素">{detail.visualElements}</Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </div>
    );
  };

  // 根据当前步骤渲染对应内容
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return renderStepOne();
      case 1:
        return renderStepTwo();
      case 2:
        return renderStepThree();
      default:
        return <Empty />;
    }
  };

  return (
    <Card
      title="生成数据"
      style={{ height: '100%', overflow: 'auto' }}
      bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
    >
      {renderContent()}
    </Card>
  );
};

export default DataCard;

