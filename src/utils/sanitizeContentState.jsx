import { ContentState, convertFromRaw, convertToRaw } from 'draft-js';

const sanitizeContentState = (rawContent) => {
  const contentState = convertFromRaw(rawContent);
  const entityMap = contentState.getEntityMap();

  const sanitizedEntityMap = Object.keys(entityMap).reduce((acc, key) => {
    const entity = entityMap[key];
    if (entity && entity.type !== null) {
      acc[key] = entity;
    }
    return acc;
  }, {});

  const sanitizedContent = {
    ...convertToRaw(contentState),
    entityMap: sanitizedEntityMap,
  };

  return ContentState.createFromBlockArray(
    convertFromRaw(sanitizedContent).getBlocksAsArray(),
    convertFromRaw(sanitizedContent).getEntityMap(),
  );
};

export default sanitizeContentState;
