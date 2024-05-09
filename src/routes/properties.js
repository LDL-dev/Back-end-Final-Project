import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRequiredFields from '../middleware/checkRequiredFields.js';
import jsonSchema from '../../prisma/json-schema/json-schema.json' assert { type: 'json' };
import getProperties from '../services/properties/getProperties.js';
import createProperty from '../services/properties/createProperty.js';
import getPropertyById from '../services/properties/getPropertyById.js';
import deletePropertyById from '../services/properties/deletePropertyById.js';
import updatePropertyById from '../services/properties/updatePropertyById.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { hostId, location, pricePerNight, amenities } = req.query;
    const properties = await getProperties(
      hostId,
      location,
      pricePerNight,
      amenities
    );

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  checkRequiredFields(jsonSchema.definitions.Property.required),
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
        amenityIds
      } = req.body;
      const newProperty = await createProperty(
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
        amenityIds
      );

      res.status(201).json(newProperty);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id?', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deletePropertyById(id);

      res.status(200).json({
        message: `Property with id ${id} was successfully deleted!`
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
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
        amenityIds
      } = req.body;
      const updatedProperty = await updatePropertyById(id, {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
        amenityIds
      });

      res.status(200).json(updatedProperty);
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
