'use server';

import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  const message = await stack(userRequest);
  return message;
};

export const parseFormData = async (prevState: any, formData: FormData) => {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const profilePicture = formData.get('profilePicture');
  const bio = formData.get('bio');

  return await loginUser(username, email, password, profilePicture, bio);
};

interface OutputType {
  image: image;
  email: string;
}

/**
 * Brief: a login form with username, email, password, profilePicture, and a bio, and show the image and email chosen
 */
async function loginUser(
  username: string,
  email: string,
  password: string,
  profilePicture: image,
  bio: string
): Promise<OutputType> {
  // Add logic here to validate the user's credentials
  // If valid, return the user's profile picture and email
  console.log(
    `username: ${username}, email: ${email}, password: ${password}, profilePicture: ${profilePicture}, bio: ${bio}`
  );
  return { image: profilePicture, email: email };
}
