import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRequiredFields from '../middleware/checkRequiredFields.js';
import jsonSchema from '../../prisma/json-schema/json-schema.json' assert { type: 'json' };
import getUsers from '../services/users/getUsers.js';
import createUser from '../services/users/createUser.js';
import getUserById from '../services/users/getUserById.js';
import deleteUserById from '../services/users/deleteUserById.js';
import updateUserById from '../services/users/updateUserById.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const users = await getUsers(username, email);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  checkRequiredFields(jsonSchema.definitions.User.required),
  async (req, res, next) => {
    try {
      const { username, password, name, email, phoneNumber, profilePicture } =
        req.body;
      const newUser = await createUser(
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture
      );

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id?', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteUserById(id);

      res.status(200).json({
        message: `User with id ${id} was successfully deleted!`
      });
    } else {
      res.status(400).json({
        message: 'No id has been given!'
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id?', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const { username, password, name, email, phoneNumber, profilePicture } =
        req.body;
      const updatedUser = await updateUserById(id, {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture
      });

      res.status(200).json(updatedUser);
    } else {
      res.status(400).json({
        message: 'No id has been given!'
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
