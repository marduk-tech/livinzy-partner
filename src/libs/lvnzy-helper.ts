function convertInchToFeet(size: number) {
  if (!size) {
    return 0;
  }
  return Math.round(size * 0.08333333333);
}

export { convertInchToFeet };
