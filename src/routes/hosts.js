import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRequiredFields from '../middleware/checkRequiredFields.js';
import jsonSchema from '../../prisma/json-schema/json-schema.json' assert { type: 'json' };
import getHosts from '../services/hosts/getHosts.js';
import createHost from '../services/hosts/createHost.js';
import getHostById from '../services/hosts/getHostById.js';
import deleteHostById from '../services/hosts/deleteHostById.js';
import updateHostById from '../services/hosts/updateHostById.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    const hosts = await getHosts(name);

    res.status(200).json(hosts);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  checkRequiredFields(jsonSchema.definitions.Host.required),
  async (req, res, next) => {
    try {
      const {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe
      } = req.body;
      const newHost = await createHost(
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe
      );

      res.status(201).json(newHost);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);

    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id?', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteHostById(id);

      res.status(200).json({
        message: `Host with id ${id} was successfully deleted!`
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
      const {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe
      } = req.body;
      const updatedHost = await updateHostById(id, {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe
      });

      res.status(200).json(updatedHost);
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
