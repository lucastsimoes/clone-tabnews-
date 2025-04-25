import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(req, res) {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
  console.error(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
};

export default controller;
