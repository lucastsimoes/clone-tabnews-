import database from "infra/database";

async function cleanDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

beforeAll(cleanDatabase);

test("GET to api/v1/migrations must return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
