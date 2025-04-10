import database from "infra/database";
import migrationRunnner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (request.method !== "GET" || request.method !== "POST") {
    response.status(405).json({
      error: "Method Not Allowed",
    });
  }
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const pendingMigrations = await migrationRunnner(defaultMigrationsOptions);
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  } else if (request.method === "POST") {
    const migratedMigrations = await migrationRunnner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    } else {
      response.status(200).json(migratedMigrations);
    }
  }
  return response.status(405);
}
