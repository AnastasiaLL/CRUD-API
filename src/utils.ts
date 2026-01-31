import { UserWithoutId } from "./types/user";


export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const validateUserData = (data: any): { isValid: boolean; userData?: UserWithoutId; error?: string } => {
      if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const { username, age, hobbies } = data;

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { isValid: false, error: 'Username is required and must be a non-empty string' };
  }

  if (typeof age !== 'number' || !Number.isInteger(age) || age < 0) {
    return { isValid: false, error: 'Age is required and must be a non-negative integer' };
  }

  if (!Array.isArray(hobbies)) {
    return { isValid: false, error: 'Hobbies must be an array' };
  }

  if (!hobbies.every(hobby => typeof hobby === 'string')) {
    return { isValid: false, error: 'All hobbies must be strings' };
  }

  return {
    isValid: true,
    userData: {
      username: username.trim(),
      age,
      hobbies
    }
  };

}