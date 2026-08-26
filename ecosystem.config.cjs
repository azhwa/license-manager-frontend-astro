// @ts-nocheck
module.exports = {
  apps: [{
    name: 'license-manager-frontend',
    cwd: __dirname,
    script: 'server.mjs',
    interpreter: 'node',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    restart_delay: 3000,
    max_memory_restart: '200M',
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: '4321',
      STATIC_DIR: './dist',
    },
  }],
};
