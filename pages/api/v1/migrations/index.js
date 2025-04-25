import database from "infra/database";
import migrationRunnner from "node-pg-migrate";
import { join } from "node:path";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationsOptions = {
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunnner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunnner({
      ...defaultMigrationsOptions,
      dryRun: false,
      dbClient,
    });
    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    } else {
      response.status(200).json(migratedMigrations);
    }
  } finally {
    await dbClient.end();
  }
}
