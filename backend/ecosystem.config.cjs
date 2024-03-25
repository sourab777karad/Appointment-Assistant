module.exports = {
  apps: [
    {
      name: "appointment-backend",
      script: "index.js",
      instances: "2",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
