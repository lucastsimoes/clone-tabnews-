import { createRouter } from "next-connect";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const version = await database.query("SHOW server_version;");
  const versionData = parseInt(version.rows[0].server_version);

  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsData = maxConnections.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const openedConnections = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [dbName],
  });
  const openedConnectionsData = openedConnections.rows[0].count;
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionData,
        max_connections: parseInt(maxConnectionsData),
        opened_connections: openedConnectionsData,
      },
    },
  });
}
