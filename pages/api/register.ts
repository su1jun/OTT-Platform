import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prismadb from '@/libs/prismadb';

// create account
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') { // must post
      return res.status(405).end();
    }

    const { email, name, password } = req.body;

    // exist user?
    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date(),
      }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}