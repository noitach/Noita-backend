import { Sequelize } from 'sequelize';
import { Connector } from '@google-cloud/cloud-sql-connector';

const connector = new Connector();

export async function createSequelizeInstance({
  database = process.env.DB_NAME,
  username = process.env.DB_USER,
  password = process.env.DB_PASS,
  host = process.env.DB_HOST || '127.0.0.1',
  port = 5432,
  dialect = 'postgres',
  logging = false,
  ssl = process.env.DB_SSL === 'true',
} = {}) {
  let effectiveHost = host;
  let effectivePort = port;

  if (process.env.USE_CLOUD_SQL_PROXY === 'true') {
    if (!process.env.CLOUDSQL_INSTANCE_CONNECTION_NAME) {
      throw new Error(
        'CLOUDSQL_INSTANCE_CONNECTION_NAME must be set when USE_CLOUD_SQL_PROXY is true'
      );
    }
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.CLOUDSQL_INSTANCE_CONNECTION_NAME,
      ipType: 'PUBLIC', // Or 'PRIVATE', or let it be auto-detected by connector
      authType: 'IAM', // Uncomment if using IAM authentication
    });
    // The connector provides host and port for the proxy
    effectiveHost = clientOpts.host;
    effectivePort = clientOpts.port;
    // SSL is typically handled by the proxy, so it might not be needed at the Sequelize level
    // Or, if the proxy terminates SSL, ssl might be false here.
    // For direct Cloud SQL connections (not proxy), ssl would be true.
    // Consult Cloud SQL proxy documentation for specifics with Sequelize.
    // For now, we'll let the passed `ssl` value or DB_SSL take precedence
    // if not using the proxy, and assume proxy handles SSL if it's used.
  }

  return new Sequelize(database, username, password, {
    host: effectiveHost,
    port: effectivePort,
    dialect,
    dialectOptions: ssl && process.env.USE_CLOUD_SQL_PROXY !== 'true' // Only apply SSL if not using proxy or explicitly set
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
      : {},
    logging,
  });
}

// Note: createSequelizeInstance is now async, so the default export needs to handle this.
// This immediate invocation might not be ideal if the async part needs to run at app startup.
// Consider initializing sequelize asynchronously in your main application file (e.g., index.js or server.js)
let sequelize;

export async function initializeSequelize() {
  if (!sequelize) {
    sequelize = await createSequelizeInstance();
  }
  return sequelize;
}

// For immediate use in modules that import this, you might still want a sync default export
// that gets populated after async initialization, or adapt your app to handle async sequelize init.
// For simplicity, this example assumes you will call initializeSequelize() at app startup.
export default sequelize; // This will be undefined until initializeSequelize is called and completes