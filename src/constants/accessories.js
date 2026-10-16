import growthStage1 from '../assets/growth-stages/stage-1.png';
import growthStage2 from '../assets/growth-stages/stage-2.png';
import growthStage3 from '../assets/growth-stages/stage-3.png';
import growthStage4 from '../assets/growth-stages/stage-4.png';
import growthStage5 from '../assets/growth-stages/stage-5.png';
import ribbon1 from '../assets/ribbons/ribbon-1.png';
import ribbon2 from '../assets/ribbons/ribbon-2.png';
import ribbon3 from '../assets/ribbons/ribbon-3.png';
import ribbon4 from '../assets/ribbons/ribbon-4.png';
import ribbon5 from '../assets/ribbons/ribbon-5.png';
import ribbon6 from '../assets/ribbons/ribbon-6.png';

export const GROWTH_IMAGES = [growthStage1, growthStage2, growthStage3, growthStage4, growthStage5];
export const RIBBONS = [ribbon1, ribbon2, ribbon3, ribbon4, ribbon5, ribbon6].map((image, index) => ({
  id: `ribbon-${index + 1}`,
  label: `리본 ${index + 1}`,
  image,
  type: 'ribbon',
}));
export const birdModules = import.meta.glob('../assets/birds/bird-*.png', { eager: true, import: 'default' });
export const BIRDS = Object.entries(birdModules)
  .map(([path, image]) => {
    const number = Number(path.match(/bird-(\d+)\.png$/)?.[1]);
    return { id: `bird-${number}`, label: `새 ${number}`, image, type: 'bird', number };
  })
  .sort((a, b) => a.number - b.number);
export const HEAD_ACCESSORIES = [...RIBBONS, ...BIRDS];
export const FREE_HEAD_ACCESSORY_IDS = ['ribbon-1'];
export const ACCESSORY_GROUPS = [{
  id: 'head',
  label: '머리 장식',
  items: HEAD_ACCESSORIES,
  positions: ['left', 'center', 'right'],
  defaultItemId: 'ribbon-1',
  defaultPosition: 'right',
}];
export const HEAD_ACCESSORY_GROUP = ACCESSORY_GROUPS[0];
export const DEFAULT_ACCESSORY = {
  version: 2,
  unlockedItemIds: FREE_HEAD_ACCESSORY_IDS,
  selectedItems: { head: 'ribbon-1' },
  positions: { head: 'right' },
};
