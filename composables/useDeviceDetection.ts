export const useDeviceDetection = () => {
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const isIOS = () => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const isAndroid = () => {
    if (typeof window === "undefined") return false;
    return /Android/i.test(navigator.userAgent);
  };

  return {
    isMobile,
    isIOS,
    isAndroid,
  };
};
