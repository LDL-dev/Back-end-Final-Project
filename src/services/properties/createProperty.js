import { PrismaClient } from '@prisma/client';
import NotFoundError from '../../errors/NotFoundError.js';
import getAmenities from '../amenities/getAmenities.js';

const createProperty = async (
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
) => {
  const prisma = new PrismaClient();

  // If no matching host exists for the given hostId, throw a NotFoundError.
  const hostFound = await prisma.host.findUnique({
    where: {
      id: hostId
    }
  });

  if (!hostFound) {
    throw new NotFoundError('host', hostId);
  }

  // For any given amenityIds, if no matching amenities exist, throw a NotFoundError.
  if (amenityIds) {
    const existingAmenities = await getAmenities();
    const existingAmenityIds = existingAmenities.map(amenity => amenity.id);
    const nonExistingAmenityIds = amenityIds.reduce((result, amenityId) => {
      if (!existingAmenityIds.includes(amenityId)) result.push(amenityId);
      return result;
    }, []);

    if (nonExistingAmenityIds.length > 0) {
      throw new NotFoundError('amenity', nonExistingAmenityIds);
    }
  }

  // Create the new property and return it.
  const newProperty = await prisma.property.create({
    data: {
      host: {
        connect: {
          id: hostId
        }
      },
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenities: amenityIds
        ? {
            connect: amenityIds.map(id => ({ id }))
          }
        : undefined
    },
    include: amenityIds
      ? {
          amenities: true
        }
      : {
          amenities: false
        }
  });

  return newProperty;
};

export default createProperty;
