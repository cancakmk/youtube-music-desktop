function getPlatformIcon() {
    return process.platform === 'darwin' ? 'icon.icns' : 'icon.ico';
  }
  
  module.exports = {
    getPlatformIcon
  };