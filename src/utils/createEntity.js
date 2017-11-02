import { DEFAULT_TYPE } from './types';
import {
  IMMUTABLE,
  MUTABLE,
  SEGMENTED
} from './mutability';

export const createEntity = (entity = {}) => ({
  data: entity.data || {},
  type: entity.type || DEFAULT_TYPE,
  mutability: [MUTABLE, IMMUTABLE, SEGMENTED].find(
    x => x === entity.mutability) || MUTABLE,
});
