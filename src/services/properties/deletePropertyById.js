import { PrismaClient } from '@prisma/client';
import NotFoundError from '../../errors/NotFoundError.js';

// If no matching property exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deletePropertyById = async id => {
  const prisma = new PrismaClient();
  const propertyFound = await prisma.property.findUnique({
    where: {
      id
    }
  });

  if (!propertyFound) {
    throw new NotFoundError('property', id);
  }

  await prisma.property.delete({
    where: {
      id
    }
  });
};

export default deletePropertyById;
