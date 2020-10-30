const express = require('express');

const { database } = require('../database');
const { basicACL } = require('../integrations/basic-acl.integration');
const { HttpException } = require('../common/http-exception');
const { getTokenFromHeaders } = require('../utils');

const { createSchema } = require('../schemas/alerts.schemas');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { headers, originalUrl, method, body } = req;

  try {
    // obtengo el token
    const token = getTokenFromHeaders(headers);

    if (!token) {
      throw new HttpException(401, `can't get the token from headers.`);
    }

    // reviso si el usuario puede acceder al recurso
    const result = await basicACL.checkPermission(token, originalUrl, method);

    if (!result.allowed) {
      throw new HttpException(403, result.reason);
    }
  } catch (error) {
    return next(error);
  }

  // valido la peticon http
  try {
    await createSchema.validateAsync(body);
  } catch (error) {
    const { details } = error;
    return res.status(400).send(details || error);
  }

  try {
    const existingAlert = await database.getOne('alerts', { user_id: body.user_id });

    if (existingAlert) {

    } else {

    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
