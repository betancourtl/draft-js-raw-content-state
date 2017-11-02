export const findStyleRanges = (block, style) => {
  let range = [];
  block.findStyleRanges(
    (char) => char.hasStyle(style),
    (start, end) => range.push({ start, end })
  );

  return range;
};
