/**
 * Utility function to reorder items in an array based on old and new indices
 */
export function reorderArray(items, activeIndex, overIndex) {
  const newItems = [...items];
  const [movedItem] = newItems.splice(activeIndex, 1);
  newItems.splice(overIndex, 0, movedItem);
  return newItems;
}

/**
 * Get the new index for a reordered item
 */
export function getNewIndexFromDragAndDrop(activeIndex, overIndex) {
  if (activeIndex === overIndex) {
    return activeIndex;
  }
  return overIndex > activeIndex ? overIndex - 1 : overIndex;
}
