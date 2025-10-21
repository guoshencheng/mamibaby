import { List, Collapse, Empty, Button, Toast } from 'antd-mobile';
import { CloseOutline, FileOutline } from 'antd-mobile-icons';
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
  // 将第一步数据转换为 Markdown
  const convertStepOneToMarkdown = (data: StorySummary): string => {
    let markdown = '# 故事概要\n\n';
    markdown += `## 用户提示\n\n${data.prompt}\n\n`;
    markdown += `## 生成的概要\n\n${data.summary}\n`;
    return markdown;
  };

  // 将第二步数据转换为 Markdown
  const convertStepTwoToMarkdown = (data: StepTwoData): string => {
    let markdown = '# 核心元素\n\n';

    // 关键人物
    markdown += `## 👥 关键人物 (${data.characters.length}个)\n\n`;
    data.characters.forEach((character, index) => {
      markdown += `### ${index + 1}. ${character.name}\n\n`;
      markdown += `- **ID**: ${character.id}\n`;
      markdown += `- **外貌**: ${character.appearance}\n`;
      markdown += `- **衣物**: ${character.clothing}\n`;
      markdown += `- **性格**: ${character.personality}\n\n`;
    });

    // 关键物品
    markdown += `## 🎁 关键物品 (${data.keyItems.length}个)\n\n`;
    data.keyItems.forEach((item, index) => {
      markdown += `### ${index + 1}. ${item.name}\n\n`;
      markdown += `- **ID**: ${item.id}\n`;
      markdown += `- **描述**: ${item.description}\n`;
      markdown += `- **特征**: ${item.features}\n\n`;
    });

    // 场景特征
    markdown += `## 🌄 场景特征 (${data.sceneFeatures.length}个)\n\n`;
    data.sceneFeatures.forEach((scene, index) => {
      markdown += `### ${index + 1}. ${scene.name}\n\n`;
      markdown += `- **ID**: ${scene.id}\n`;
      markdown += `- **环境**: ${scene.environment}\n`;
      markdown += `- **时间**: ${scene.time}\n`;
      markdown += `- **氛围**: ${scene.atmosphere}\n\n`;
    });

    // 分镜概要
    markdown += `## 🎬 分镜概要 (${data.storyboardSummaries.length}个)\n\n`;
    data.storyboardSummaries.forEach((storyboard) => {
      markdown += `### 分镜 ${storyboard.sequence}\n\n`;
      markdown += `- **ID**: ${storyboard.id}\n`;
      markdown += `- **场景**: ${storyboard.sceneDescription}\n`;
      if (storyboard.dialogue) {
        markdown += `- **对话**: ${storyboard.dialogue}\n`;
      }
      markdown += `\n`;
    });

    return markdown;
  };

  // 将第三步数据转换为 Markdown
  const convertStepThreeToMarkdown = (data: StoryboardDetail[]): string => {
    let markdown = '# 分镜详情\n\n';

    data.forEach((detail, index) => {
      markdown += `## 🎬 分镜详情 ${index + 1}\n\n`;
      markdown += `- **ID**: ${detail.id}\n`;
      markdown += `- **关联分镜**: ${detail.summaryId}\n\n`;
      markdown += `### 详细描述\n\n${detail.detailedDescription}\n\n`;
      markdown += `### 镜头角度\n\n${detail.cameraAngle}\n\n`;
      markdown += `### 人物动作\n\n${detail.characterActions}\n\n`;
      markdown += `### 视觉元素\n\n${detail.visualElements}\n\n`;
      markdown += `---\n\n`;
    });

    return markdown;
  };

  // 复制当前步骤的数据
  const handleCopy = async () => {
    let markdownText = '';

    switch (currentStep) {
      case 0:
        if (summary) {
          markdownText = convertStepOneToMarkdown(summary);
        }
        break;
      case 1:
        if (elements) {
          markdownText = convertStepTwoToMarkdown(elements);
        }
        break;
      case 2:
        if (details) {
          markdownText = convertStepThreeToMarkdown(details);
        }
        break;
    }

    if (!markdownText) {
      Toast.show({
        icon: 'fail',
        content: '没有可复制的内容',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(markdownText);
      Toast.show({
        icon: 'success',
        content: '已复制到剪贴板',
      });
    } catch (error) {
      console.error('复制失败:', error);
      Toast.show({
        icon: 'fail',
        content: '复制失败，请重试',
      });
    }
  };

  // 判断是否有可复制的内容
  const hasContent = () => {
    switch (currentStep) {
      case 0:
        return summary !== null;
      case 1:
        return elements !== null;
      case 2:
        return details !== null;
      default:
        return false;
    }
  };

  // 复制单个数据项
  const copyItem = async (content: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      Toast.show({
        icon: 'success',
        content: `已复制 ${itemName}`,
      });
    } catch (error) {
      console.error('复制失败:', error);
      Toast.show({
        icon: 'fail',
        content: '复制失败，请重试',
      });
    }
  };

  // 为人物生成 Markdown
  const characterToMarkdown = (character: any) => {
    return `### ${character.name}\n\n- **ID**: ${character.id}\n- **外貌**: ${character.appearance}\n- **衣物**: ${character.clothing}\n- **性格**: ${character.personality}`;
  };

  // 为物品生成 Markdown
  const itemToMarkdown = (item: any) => {
    return `### ${item.name}\n\n- **ID**: ${item.id}\n- **描述**: ${item.description}\n- **特征**: ${item.features}`;
  };

  // 为场景生成 Markdown
  const sceneToMarkdown = (scene: any) => {
    return `### ${scene.name}\n\n- **ID**: ${scene.id}\n- **环境**: ${scene.environment}\n- **时间**: ${scene.time}\n- **氛围**: ${scene.atmosphere}`;
  };

  // 为分镜概要生成 Markdown
  const storyboardSummaryToMarkdown = (storyboard: any) => {
    let md = `### 分镜 ${storyboard.sequence}\n\n- **ID**: ${storyboard.id}\n- **场景**: ${storyboard.sceneDescription}`;
    if (storyboard.dialogue) {
      md += `\n- **对话**: ${storyboard.dialogue}`;
    }
    return md;
  };

  // 为分镜详情生成 Markdown
  const detailToMarkdown = (detail: any, index: number) => {
    return `## 🎬 分镜详情 ${index + 1}\n\n- **ID**: ${detail.id}\n- **关联分镜**: ${detail.summaryId}\n\n### 详细描述\n\n${detail.detailedDescription}\n\n### 镜头角度\n\n${detail.cameraAngle}\n\n### 人物动作\n\n${detail.characterActions}\n\n### 视觉元素\n\n${detail.visualElements}`;
  };

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
          <div className="summary-label-with-copy">
            <span className="summary-label">用户提示</span>
            <Button
              size="mini"
              fill="none"
              onClick={() => copyItem(summary.prompt, '用户提示')}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
              复制
            </Button>
          </div>
          <div className="summary-value">{summary.prompt}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label-with-copy">
            <span className="summary-label">生成的概要</span>
            <Button
              size="mini"
              fill="none"
              onClick={() => copyItem(summary.summary, '概要')}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
              复制
            </Button>
          </div>
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
                  <div className="list-item-header">
                    <strong>{character.name}</strong>
                    <Button
                      size="mini"
                      fill="none"
                      onClick={() => copyItem(characterToMarkdown(character), character.name)}
                      style={{ padding: '2px 8px', fontSize: '12px' }}
                    >
                      复制
                    </Button>
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
                  <div className="list-item-header">
                    <strong>{item.name}</strong>
                    <Button
                      size="mini"
                      fill="none"
                      onClick={() => copyItem(itemToMarkdown(item), item.name)}
                      style={{ padding: '2px 8px', fontSize: '12px' }}
                    >
                      复制
                    </Button>
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
                  <div className="list-item-header">
                    <strong>{scene.name}</strong>
                    <Button
                      size="mini"
                      fill="none"
                      onClick={() => copyItem(sceneToMarkdown(scene), scene.name)}
                      style={{ padding: '2px 8px', fontSize: '12px' }}
                    >
                      复制
                    </Button>
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
                  <div className="list-item-header">
                    <strong>分镜 {storyboard.sequence}</strong>
                    <Button
                      size="mini"
                      fill="none"
                      onClick={() => copyItem(storyboardSummaryToMarkdown(storyboard), `分镜 ${storyboard.sequence}`)}
                      style={{ padding: '2px 8px', fontSize: '12px' }}
                    >
                      复制
                    </Button>
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
            <Collapse.Panel 
              key={detail.id} 
              title={
                <div className="collapse-title-with-copy">
                  <span>🎬 分镜详情 {index + 1}</span>
                  <Button
                    size="mini"
                    fill="none"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyItem(detailToMarkdown(detail, index), `分镜详情 ${index + 1}`);
                    }}
                    style={{ padding: '2px 8px', fontSize: '12px' }}
                  >
                    复制
                  </Button>
                </div>
              }
            >
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button
            size="mini"
            color="primary"
            fill="outline"
            onClick={handleCopy}
            disabled={!hasContent()}
          >
            <FileOutline style={{ marginRight: '4px' }} />
            复制
          </Button>
          <div className="close-button" onClick={onClose}>
            <CloseOutline />
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="data-card-content">{renderContent()}</div>
    </div>
  );
};

export default DataCard;
