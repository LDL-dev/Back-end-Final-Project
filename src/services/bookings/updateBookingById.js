import { PrismaClient } from '@prisma/client';
import NotFoundError from '../../errors/NotFoundError.js';

const updateBookingById = async (
  id,
  {
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus
  }
) => {
  const prisma = new PrismaClient();

  // If no matching booking exists for the given id, throw a NotFoundError.
  const bookingFound = await prisma.booking.findUnique({
    where: {
      id
    }
  });

  if (!bookingFound) {
    throw new NotFoundError('booking', id);
  }

  // If no matching user exists for a given userId, throw a NotFoundError.
  if (userId) {
    const userFound = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!userFound) {
      throw new NotFoundError('user', userId);
    }
  }

  // If no matching property exists for a given propertyId, throw a NotFoundError.
  if (propertyId) {
    const propertyFound = await prisma.property.findUnique({
      where: {
        id: propertyId
      }
    });

    if (!propertyFound) {
      throw new NotFoundError('property', propertyId);
    }
  }

  // Update the booking and return it.
  const updatedBooking = await prisma.booking.update({
    where: {
      id
    },
    data: {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
      user: userId
        ? {
            connect: { id: userId }
          }
        : undefined,
      property: propertyId
        ? {
            connect: { id: propertyId }
          }
        : undefined
    }
  });

  return updatedBooking;
};

export default updateBookingById;
