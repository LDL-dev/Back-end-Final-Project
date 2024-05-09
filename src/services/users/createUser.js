import { PrismaClient } from '@prisma/client';

const createUser = async (
  username,
  password,
  name,
  email,
  phoneNumber,
  profilePicture
) => {
  const prisma = new PrismaClient();
  // Create the new user and return it.
  const newUser = await prisma.user.create({
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    }
  });

  return newUser;
};

export default createUser;
