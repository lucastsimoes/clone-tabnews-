import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "models/password";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1)",
      values: [email],
    });
    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O e-mail informado já está sendo utilizado",
        action: "Utilize outro e-mail para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: "SELECT email FROM users WHERE LOWER(username) = LOWER($1)",
      values: [username],
    });
    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function hashPasswordInObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
  }
}

async function findOneByUsername(username) {
  const userFound = runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1",
      values: [username],
    });
    if (results.rowCount == 0) {
      throw new NotFoundError({
        message: "O username informado não está cadastrado no sistema.",
        action: "Por favor confira o nome de usuário e tente novamente.",
      });
    }
    return results.rows[0];
  }
}

async function runInsertQuery(userInputValues) {
  const result = await database.query({
    text: "INSERT INTO users (username,email, password) VALUES ($1, $2, $3) RETURNING *",
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });
  return result.rows[0];
}

const user = {
  create,
  findOneByUsername,
};

export default user;
