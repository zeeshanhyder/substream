module.exports = {
  apps: [
    {
      name: 'temporal-server',
      script: 'npm',
      args: 'run temporal-server',
    },
    {
      name: 'substream-server',
      script: 'npm',
      args: 'run start',
    },
  ],
};
