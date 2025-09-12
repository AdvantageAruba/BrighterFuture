/**
 * Utility functions for password generation and validation
 */

/**
 * Generate a secure temporary password
 * @param length - Length of the password (default: 12)
 * @returns A secure temporary password
 */
export const generateTemporaryPassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  // Ensure at least one character from each category
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters from all categories
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generate a user-friendly temporary password (easier to type)
 * @param length - Length of the password (default: 10)
 * @returns A user-friendly temporary password
 */
export const generateUserFriendlyPassword = (length: number = 10): string => {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  const numbers = '0123456789';
  
  let password = '';
  
  // Alternate between consonants and vowels for readability
  for (let i = 0; i < length - 2; i++) {
    if (i % 2 === 0) {
      password += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      password += vowels[Math.floor(Math.random() * vowels.length)];
    }
  }
  
  // Add numbers at the end
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  return password;
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = {
    length: password.length >= minLength,
    uppercase: hasUppercase,
    lowercase: hasLowercase,
    numbers: hasNumbers,
    symbols: hasSymbols
  };
  
  const score = Object.values(strength).filter(Boolean).length;
  const isStrong = score >= 4 && password.length >= minLength;
  
  return {
    isValid: isStrong,
    strength,
    score,
    message: isStrong ? 'Strong password' : 'Password needs improvement'
  };
};

/**
 * Generate a secure random token for invitation links
 * @param length - Length of the token (default: 32)
 * @returns A secure random token
 */
export const generateInvitationToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

