const express = require('express');

const environment = require('../environment');
const { database } = require('../database');
const { basicACL } = require('../integrations/basic-acl.integration');

const { HttpException } = require('../common/http-exception');

const {
  registerSchema,
  sendForgottenPasswordEmailSchema
} = require('../schemas/users.schemas');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { body } = req;

  // valido el cuerpo de la peticion http
  try {
    await registerSchema.validateAsync(body);
  } catch (error) {
    const { details } = error;
    return res.status(400).send(details || error);
  }

  try {
    // valido si existe un usuario con el email
    const existingByEmail = await database.getOne('users', { email: body.email });

    if (existingByEmail) {
      throw new HttpException(412, `ya existe un usuario con el email ${body.email}.`);
    }

    // valido si existe un usuario con el telefono
    const existingByPhone = await database.getOne('users', { phone: body.phone });

    if (existingByPhone) {
      throw HttpException(412, `ya existe un usuario con el telefono ${body.phone}.`);
    }

    // creo el usuario en el ACL
    const userInACL = await basicACL.register(
      body.email,
      body.password,
      body.phone,
      environment.BASIC_ACL_USER_ROLE_CODE
    );

    const { authUid } = userInACL;

    const objectToCreate = {
      email: body.email,
      phone: body.phone,
      full_name: body.full_name,
      uuid: authUid
    };

    // creo el usuario en mi base de datos
    const created = await database.createOne('users', objectToCreate);

    return res.status(200).send(created);
  } catch (error) {
    return next(error);
  }
});

router.post('/send-forgotten-password-email', async (req, res, next) => {
  const { body } = req;

  // valido el cuerpo de la peticion http
  try {
    await sendForgottenPasswordEmailSchema.validateAsync(body);
  } catch (error) {
    const { details } = error;
    return res.status(400).send(details || error);
  }

  try {
    // valido si existe un usuario con el email
    const existingByEmail = await database.getOne('users', { email: body.email });

    if (!existingByEmail) {
      throw new HttpException(412, `no existe un usuario con el email ${body.email}.`);
    }

    basicACL.sendForgottenPasswordEmail(body.email)
      .catch(err => console.error(err));

    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  return res.status(200).send('TODO');
});

router.patch('/:id', async (req, res, next) => {
  return res.status(200).send('TODO');
});

module.exports = router;
