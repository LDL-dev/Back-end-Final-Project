import { PrismaClient } from '@prisma/client';
import NotFoundError from '../../errors/NotFoundError.js';
import getAmenities from '../amenities/getAmenities.js';

const updatePropertyById = async (
  id,
  {
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
  }
) => {
  const prisma = new PrismaClient();

  // If no matching property exists for the given id, throw a NotFoundError.
  const propertyFound = await prisma.property.findUnique({
    where: {
      id
    }
  });

  if (!propertyFound) {
    throw new NotFoundError('property', id);
  }

  // If no matching host exists for a given hostId, throw a NotFoundError.
  if (hostId) {
    const hostFound = await prisma.host.findUnique({
      where: {
        id: hostId
      }
    });

    if (!hostFound) {
      throw new NotFoundError('host', hostId);
    }
  }

  // If no matching amenities exist for any given amenityIds, throw a NotFoundError.
  if (amenityIds) {
    const existingAmenities = await prisma.amenity.findMany({
      where: {
        id: {
          in: amenityIds
        }
      }
    });
    const existingAmenityIds = existingAmenities.map(amenity => amenity.id);
    const nonExistingAmenityIds = amenityIds.reduce((result, amenityId) => {
      if (!existingAmenityIds.includes(amenityId)) result.push(amenityId);
      return result;
    }, []);

    if (nonExistingAmenityIds.length > 0) {
      throw new NotFoundError('amenity', nonExistingAmenityIds);
    }
  }

  // Update the property and return it.
  const updatedProperty = await prisma.property.update({
    where: {
      id
    },
    data: {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      host: hostId
        ? {
            connect: {
              id: hostId
            }
          }
        : undefined,
      amenities: amenityIds
        ? {
            set: amenityIds.map(id => ({ id }))
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

  return updatedProperty;
};

export default updatePropertyById;
