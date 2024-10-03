// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
