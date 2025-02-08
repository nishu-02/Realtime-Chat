import Thumbnail from '../assets/thumbnail.png';

const ADDRESS = '192.168.1.6:5000';

function log(...args) {
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
}


function thumbnail(url) {
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
}

export default {log, thumbnail};