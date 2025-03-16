import os from 'node:os';
export function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];

    if (networkInterface) {
      for (const iface of networkInterface) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address; // Returns the local IP address
        }
      }
    } else {
      return '::1';
    }
  }

  return 'Unable to determine local IP address';
}
