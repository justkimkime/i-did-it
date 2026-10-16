import React from 'react';
import { RIBBONS, BIRDS, HEAD_ACCESSORIES } from '../../constants/accessories.js';
import growthStage5 from '../../assets/growth-stages/stage-5.png';
import { ArrowLeft, ArrowRight, LockKeyhole, X } from 'lucide-react';

export default function DecorateModal({
  accessory,
  setDecorateModal,
  accessoryTab,
  setAccessoryTab,
  setPreviewAccessoryId,
  previewPosition,
  setPreviewPosition,
  completedCount,
  availableAccessoryChoices,
  nextAccessoryGoal,
  selectedHeadAccessory,
  previewHeadAccessory,
  previewIsUnlocked,
  previewMatchesApplied,
  visibleAccessories,
  applyPreviewAccessory,
}) {
  return (
        <div className="modal-backdrop" onMouseDown={() => setDecorateModal(false)}>
          <div className="decorate-modal" role="dialog" aria-modal="true" aria-labelledby="decorate-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setDecorateModal(false)} aria-label="닫기"><X size={19} /></button>
            <div className="decorate-header">
              <p className="eyebrow">DUST CLOSET</p>
              <h2 id="decorate-title">먼지 꾸미기</h2>
              <p>리본 또는 새 하나를 고르고 원하는 위치에 올려보세요.</p>
            </div>

            <div className="decorate-preview">
              <div className="preview-glow" />
              <div className="growth-mascot preview-mascot">
                <img className="mascot" src={growthStage5} alt="완전히 성장한 먼지 미리보기" />
                <div className={`head-accessory ${previewHeadAccessory.type} ${previewPosition}`}>
                  <img src={previewHeadAccessory.image} alt={`미리보기 ${previewHeadAccessory.label}`} />
                </div>
              </div>
              <div className="preview-apply-row">
                <span>{previewHeadAccessory.label} · {previewPosition === 'left' ? '왼쪽' : previewPosition === 'center' ? '가운데' : '오른쪽'}</span>
                <button
                  className="preview-apply-button"
                  disabled={previewMatchesApplied || (!previewIsUnlocked && availableAccessoryChoices === 0)}
                  onClick={applyPreviewAccessory}
                >
                  {!previewIsUnlocked && availableAccessoryChoices === 0
                    ? '선택권 필요'
                    : previewMatchesApplied
                      ? '현재 적용 중'
                      : previewIsUnlocked
                        ? '이 장식 적용'
                        : '해금하고 적용'}
                </button>
              </div>
            </div>

            <div className="accessory-status">
              <div>
                <strong>사용 가능한 장식 선택권 <b>{availableAccessoryChoices}개</b></strong>
                <small>{accessory.unlockedItemIds.length} / {HEAD_ACCESSORIES.length} 머리 장식 해금</small>
              </div>
              <span>
                {availableAccessoryChoices > 0
                  ? '여러 장식을 미리 본 뒤 원하는 하나를 적용하세요.'
                  : nextAccessoryGoal
                    ? `완료 ${nextAccessoryGoal - completedCount}개를 더 하면 새 장식을 선택할 수 있어요.`
                    : '모든 머리 장식을 모았어요!'}
              </span>
            </div>

            <div className="accessory-tabs" role="tablist" aria-label="머리 장식 종류">
              <button className={accessoryTab === 'ribbon' ? 'is-selected' : ''} onClick={() => setAccessoryTab('ribbon')} role="tab" aria-selected={accessoryTab === 'ribbon'}>
                리본 <span>{RIBBONS.length}</span>
              </button>
              <button className={accessoryTab === 'bird' ? 'is-selected' : ''} onClick={() => setAccessoryTab('bird')} role="tab" aria-selected={accessoryTab === 'bird'}>
                새 <span>{BIRDS.length}</span>
              </button>
            </div>

            <div className="ribbon-grid" aria-label={`${accessoryTab === 'bird' ? '새' : '리본'} 선택`}>
              {visibleAccessories.map((item) => {
                const unlocked = accessory.unlockedItemIds.includes(item.id);
                const canUnlock = !unlocked && availableAccessoryChoices > 0;
                const selected = previewHeadAccessory.id === item.id;
                const applied = selectedHeadAccessory.id === item.id;
                return (
                  <button
                    className={`${selected ? 'is-selected' : ''} ${!unlocked ? 'is-locked' : ''}`}
                    key={item.id}
                    onClick={() => setPreviewAccessoryId(item.id)}
                    aria-label={`${item.label}${applied ? ', 현재 착용 중' : unlocked ? ', 해금됨' : canUnlock ? ', 해금 후보 미리보기' : ', 잠김 미리보기'}`}
                  >
                    <span className={`ribbon-image ${item.type}`}><img src={item.image} alt="" /></span>
                    <strong>{item.label}</strong>
                    <small>{applied ? '현재 착용' : selected ? '미리보기 중' : unlocked ? '사용 가능' : canUnlock ? '해금 후보' : <><LockKeyhole size={10} /> 미리보기</>}</small>
                  </button>
                );
              })}
            </div>

            <fieldset className="ribbon-side-picker">
              <legend>{previewHeadAccessory.type === 'bird' ? '새' : '리본'} 미리보기 위치</legend>
              <div>
                <button className={previewPosition === 'left' ? 'is-selected' : ''} onClick={() => setPreviewPosition('left')}>
                  <ArrowLeft size={14} /> 왼쪽
                </button>
                <button className={previewPosition === 'center' ? 'is-selected' : ''} onClick={() => setPreviewPosition('center')}>
                  가운데
                </button>
                <button className={previewPosition === 'right' ? 'is-selected' : ''} onClick={() => setPreviewPosition('right')}>
                  오른쪽 <ArrowRight size={14} />
                </button>
              </div>
            </fieldset>
          </div>
        </div>
  );
}
