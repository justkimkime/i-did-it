import React from 'react';
import { GROWTH_IMAGES } from '../constants/accessories.js';
import { Palette } from 'lucide-react';

export default function GrowthHero({
  accessory,
  completedCount,
  growthStage,
  growthMilestones,
  nextGrowthGoal,
  growthProgress,
  growthMessage,
  isFullyGrown,
  availableAccessoryChoices,
  nextAccessoryGoal,
  selectedHeadAccessory,
  openDecorateModal,
}) {
  return (
        <div className="growth-hero" aria-label={`지금까지 완료한 일 ${completedCount}개, 성장 ${growthStage + 1}단계`}>
          <div className={`growth-glow growth-stage-${growthStage}`} />
            <div className={`growth-mascot ${completedCount < 3 ? 'is-prebirth' : ''}`}>
              <img
                className='mascot'
                src={GROWTH_IMAGES[growthStage]}
                alt={growthMessage}
              />
              {isFullyGrown && (
                <div className={`head-accessory ${selectedHeadAccessory.type} ${accessory.positions.head}`}>
                  <img src={selectedHeadAccessory.image} alt={`착용 중인 ${selectedHeadAccessory.label}`} />
                </div>
              )}
            </div>
          <div className="growth-copy">
            <strong>{growthMessage}</strong>
            <span>
              {completedCount}개의 일을 해냈어요
              {nextGrowthGoal
                ? ` · 다음 성장까지 ${nextGrowthGoal - completedCount}개`
                : availableAccessoryChoices > 0
                  ? ` · 장식 선택권 ${availableAccessoryChoices}개`
                  : nextAccessoryGoal
                    ? ` · 다음 장식까지 ${nextAccessoryGoal - completedCount}개`
                    : ' · 모든 장식 해금 완료'}
            </span>
          </div>
          <div className="growth-progress" aria-hidden="true">
            <span style={{ width: `${growthProgress}%` }} />
          </div>
          <div className="growth-steps" aria-hidden="true">
            {growthMilestones.map((goal, stage) => <i className={completedCount >= goal ? 'is-grown' : ''} key={stage} />)}
          </div>
          {isFullyGrown && (
            <button className="decorate-button" onClick={openDecorateModal}>
              <Palette size={14} /> 먼지 꾸미기
              {availableAccessoryChoices > 0 && <span>선택권 {availableAccessoryChoices}</span>}
            </button>
          )}
        </div>
  );
}
