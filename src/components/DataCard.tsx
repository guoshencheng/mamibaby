import { List, Collapse, Empty } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import type { StorySummary, StepTwoData, StoryboardDetail } from '../types/story';
import './DataCard.css';

interface DataCardProps {
  currentStep: number;
  summary: StorySummary | null;
  elements: StepTwoData | null;
  details: StoryboardDetail[] | null;
  onClose: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  currentStep,
  summary,
  elements,
  details,
  onClose,
}) => {
  // 第一步：显示故事概要
  const renderStepOne = () => {
    if (!summary) {
      return (
        <div className="data-empty">
          <Empty description="还未生成故事概要" />
        </div>
      );
    }

    return (
      <div className="summary-section">
        <div className="section-title">故事概要</div>
        <div className="summary-item">
          <div className="summary-label">用户提示</div>
          <div className="summary-value">{summary.prompt}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">生成的概要</div>
          <div className="summary-value">{summary.summary}</div>
        </div>
      </div>
    );
  };

  // 第二步：显示核心元素
  const renderStepTwo = () => {
    if (!elements) {
      return (
        <div className="data-empty">
          <Empty description="还未生成核心元素" />
        </div>
      );
    }

    return (
      <div className="elements-section">
        <Collapse accordion>
          {/* 关键人物 */}
          <Collapse.Panel key="characters" title={`👥 关键人物 (${elements.characters.length})`}>
            <List className="detail-list">
              {elements.characters.map((character) => (
                <List.Item key={character.id}>
                  <div className="list-item-label">
                    <strong>{character.name}</strong>
                  </div>
                  <div className="list-item-value">
                    <div>外貌：{character.appearance}</div>
                    <div>衣物：{character.clothing}</div>
                    <div>性格：{character.personality}</div>
                  </div>
                </List.Item>
              ))}
            </List>
          </Collapse.Panel>

          {/* 关键物品 */}
          <Collapse.Panel key="items" title={`🎁 关键物品 (${elements.keyItems.length})`}>
            <List className="detail-list">
              {elements.keyItems.map((item) => (
                <List.Item key={item.id}>
                  <div className="list-item-label">
                    <strong>{item.name}</strong>
                  </div>
                  <div className="list-item-value">
                    <div>描述：{item.description}</div>
                    <div>特征：{item.features}</div>
                  </div>
                </List.Item>
              ))}
            </List>
          </Collapse.Panel>

          {/* 场景特征 */}
          <Collapse.Panel key="scenes" title={`🌄 场景特征 (${elements.sceneFeatures.length})`}>
            <List className="detail-list">
              {elements.sceneFeatures.map((scene) => (
                <List.Item key={scene.id}>
                  <div className="list-item-label">
                    <strong>{scene.name}</strong>
                  </div>
                  <div className="list-item-value">
                    <div>环境：{scene.environment}</div>
                    <div>时间：{scene.time}</div>
                    <div>氛围：{scene.atmosphere}</div>
                  </div>
                </List.Item>
              ))}
            </List>
          </Collapse.Panel>

          {/* 分镜概要 */}
          <Collapse.Panel
            key="storyboards"
            title={`🎬 分镜概要 (${elements.storyboardSummaries.length})`}
          >
            <List className="detail-list">
              {elements.storyboardSummaries.map((storyboard) => (
                <List.Item key={storyboard.id}>
                  <div className="list-item-label">
                    <strong>分镜 {storyboard.sequence}</strong>
                  </div>
                  <div className="list-item-value">
                    <div>场景：{storyboard.sceneDescription}</div>
                    {storyboard.dialogue && <div>对话：{storyboard.dialogue}</div>}
                  </div>
                </List.Item>
              ))}
            </List>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  // 第三步：显示分镜详情
  const renderStepThree = () => {
    if (!details) {
      return (
        <div className="data-empty">
          <Empty description="还未生成分镜详情" />
        </div>
      );
    }

    return (
      <div className="elements-section">
        <Collapse accordion>
          {details.map((detail, index) => (
            <Collapse.Panel key={detail.id} title={`🎬 分镜详情 ${index + 1}`}>
              <List className="detail-list">
                <List.Item>
                  <div className="list-item-label">关联分镜</div>
                  <div className="list-item-value">{detail.summaryId}</div>
                </List.Item>
                <List.Item>
                  <div className="list-item-label">详细描述</div>
                  <div className="list-item-value">{detail.detailedDescription}</div>
                </List.Item>
                <List.Item>
                  <div className="list-item-label">镜头角度</div>
                  <div className="list-item-value">{detail.cameraAngle}</div>
                </List.Item>
                <List.Item>
                  <div className="list-item-label">人物动作</div>
                  <div className="list-item-value">{detail.characterActions}</div>
                </List.Item>
                <List.Item>
                  <div className="list-item-label">视觉元素</div>
                  <div className="list-item-value">{detail.visualElements}</div>
                </List.Item>
              </List>
            </Collapse.Panel>
          ))}
        </Collapse>
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
        return (
          <div className="data-empty">
            <Empty />
          </div>
        );
    }
  };

  return (
    <div className="data-card-container">
      {/* 头部 */}
      <div className="data-card-header">
        <div className="data-card-title">生成数据</div>
        <div className="close-button" onClick={onClose}>
          <CloseOutline />
        </div>
      </div>

      {/* 内容 */}
      <div className="data-card-content">{renderContent()}</div>
    </div>
  );
};

export default DataCard;
