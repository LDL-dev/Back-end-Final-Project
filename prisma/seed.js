import { PrismaClient } from '@prisma/client';
import userData from '../src/data/users.json' assert { type: 'json' };
import hostData from '../src/data/hosts.json' assert { type: 'json' };
import propertyData from '../src/data/properties.json' assert { type: 'json' };
import amenityData from '../src/data/amenities.json' assert { type: 'json' };
import bookingData from '../src/data/bookings.json' assert { type: 'json' };
import reviewData from '../src/data/reviews.json' assert { type: 'json' };

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  const { users } = userData;
  const { hosts } = hostData;
  const { properties } = propertyData;
  const { amenities } = amenityData;
  const { bookings } = bookingData;
  const { reviews } = reviewData;

  console.log('Please wait while the database is being seeded...');

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        id: user.id
      },
      update: {},
      create: user
    });
  }

  for (const host of hosts) {
    await prisma.host.upsert({
      where: {
        id: host.id
      },
      update: {},
      create: host
    });
  }

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: {
        id: amenity.id
      },
      update: {},
      create: amenity
    });
  }

  for (const property of properties) {
    await prisma.property.upsert({
      where: {
        id: property.id
      },
      update: {},
      create: {
        id: property.id,
        host: {
          connect: {
            id: property.hostId
          }
        },
        title: property.title,
        description: property.description,
        location: property.location,
        pricePerNight: property.pricePerNight,
        bedroomCount: property.bedroomCount,
        bathRoomCount: property.bathRoomCount,
        maxGuestCount: property.maxGuestCount,
        rating: property.rating,
        amenities: {
          connect: property.amenityIds.map(id => ({ id }))
        }
      }
    });
  }

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: {
        id: amenity.id
      },
      update: {},
      create: amenity
    });
  }

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: {
        id: booking.id
      },
      update: {},
      create: {
        id: booking.id,
        user: {
          connect: {
            id: booking.userId
          }
        },
        property: {
          connect: {
            id: booking.propertyId
          }
        },
        checkinDate: booking.checkinDate,
        checkoutDate: booking.checkoutDate,
        numberOfGuests: booking.numberOfGuests,
        totalPrice: booking.totalPrice,
        bookingStatus: booking.bookingStatus
      }
    });
  }

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        id: review.id
      },
      update: {},
      create: {
        id: review.id,
        user: {
          connect: {
            id: review.userId
          }
        },
        property: {
          connect: {
            id: review.propertyId
          }
        },
        rating: review.rating,
        comment: review.comment
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
