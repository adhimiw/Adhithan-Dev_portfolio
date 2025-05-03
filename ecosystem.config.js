module.exports = {
  apps: [
    {
      name: 'adhithan-portfolio-backend',
      script: 'backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: '~/adhithan_Dev_portfolio/.env'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '~/adhithan_Dev_portfolio/logs/backend-error.log',
      out_file: '~/adhithan_Dev_portfolio/logs/backend-out.log'
    },
    {
      name: 'adhithan-portfolio-frontend',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --host 0.0.0.0 --port 5174',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '~/adhithan_Dev_portfolio/logs/frontend-error.log',
      out_file: '~/adhithan_Dev_portfolio/logs/frontend-out.log'
    }
  ]
};
