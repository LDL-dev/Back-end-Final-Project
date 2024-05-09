import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRequiredFields from '../middleware/checkRequiredFields.js';
import jsonSchema from '../../prisma/json-schema/json-schema.json' assert { type: 'json' };
import getAmenities from '../services/amenities/getAmenities.js';
import createAmenity from '../services/amenities/createAmenity.js';
import getAmenityById from '../services/amenities/getAmenityById.js';
import deleteAmenityById from '../services/amenities/deleteAmenityById.js';
import updateAmenityById from '../services/amenities/updateAmenityById.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const amenities = await getAmenities();

    res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  checkRequiredFields(jsonSchema.definitions.Amenity.required),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const newAmenity = await createAmenity(name);

      res.status(201).json(newAmenity);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);

    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id?', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteAmenityById(id);

      res.status(200).json({
        message: `Amenity with id ${id} was successfully deleted!`
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
      const { name } = req.body;
      const updatedAmenity = await updateAmenityById(id, {
        name
      });

      res.status(200).json(updatedAmenity);
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
