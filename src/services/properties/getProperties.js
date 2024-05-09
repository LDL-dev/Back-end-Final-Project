import { PrismaClient } from '@prisma/client';

const getProperties = async (hostId, location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();
  const properties = await prisma.property.findMany({
    where: {
      hostId,
      location: {
        contains: location
      },
      pricePerNight: {
        equals: pricePerNight
      },
      amenities: {
        some: {
          name: {
            contains: amenities
          }
        }
      }
    },
    include: {
      amenities: true
    }
  });

  return properties;
};

export default getProperties;
