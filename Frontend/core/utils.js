const utils = {
    log: (...args) => {
      for (let i = 0; i < args.length; i++) {
        let arg = args[i];
  
        if (typeof arg === 'object') {
          // Using console.table for better object visualization
          try {
            console.table(arg);
          } catch (e) {
            console.log('[Error displaying object as table]', e);
          }
        } else {
          console.log(arg);  // Logging non-object values
        }
      }
    },
  };
  
export default utils;
  