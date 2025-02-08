import Thumbnail from '../assets/thumbnail.png';

const ADDRESS = '192.168.1.6:5000';

export const log = (...args) => {
  args.forEach((arg) => {
    if (arg && typeof arg === "object") {
      try {
        arg = JSON.stringify(arg, null, 2);
      } catch (e) {
        arg = "[Unable to stringify object]";
      }
    }
    console.log("LOG:", arg);
  });
};

export const thumbnail = (url) => {
  if (!url) {
    return Thumbnail; // Default image
  }

  if(url.startsWith("file://")) {
    return {
      uri: url
    }
  }
  const hasScheme = url.startsWith("http://") || url.startsWith("https://");
  return {
    uri: hasScheme ? url : `http://${ADDRESS}${url}`,
  };
};

export const formatTime = (date) => {
  if (!date) return "-";
  const now = new Date();
  const sec = Math.abs(now - new Date(date)) / 1000;

  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return "-";
};

// You can keep the default export if needed
export default { log, thumbnail, formatTime };