test("GET to api/v1/status must return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  process.env.POSTGRES_DATABASE === "local_db"
    ? expect(responseBody.dependencies.database.version).toEqual("16.0")
    : expect(responseBody.dependencies.database.version).toEqual("16.8");
  process.env.POSTGRES_DATABASE === "local_db"
    ? expect(responseBody.dependencies.database.max_connections).toEqual(100)
    : expect(responseBody.dependencies.database.max_connections).toEqual(901);

  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
