import Toast from 'react-native-toast-message';

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateDate = (
  day: string,
  month: string,
  year: string,
): DateValidationResult => {
  // Check if all fields are filled
  if (!day || !month || !year) {
    return {
      isValid: false,
      error: 'Please fill in all date fields',
    };
  }

  // Convert to numbers
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Check if valid numbers
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    return {
      isValid: false,
      error: 'Please enter valid numbers',
    };
  }

  // Validate day
  if (dayNum < 1 || dayNum > 31) {
    return {
      isValid: false,
      error: 'Day must be between 1 and 31',
    };
  }

  // Validate month
  if (monthNum < 1 || monthNum > 12) {
    return {
      isValid: false,
      error: 'Month must be between 1 and 12',
    };
  }

  // Validate year
  const currentYear = new Date().getFullYear();
  if (yearNum < 1900 || yearNum > currentYear) {
    return {
      isValid: false,
      error: `Year must be between 1900 and ${currentYear}`,
    };
  }

  // Check if the date is valid (e.g., not Feb 30)
  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (
    date.getDate() !== dayNum ||
    date.getMonth() !== monthNum - 1 ||
    date.getFullYear() !== yearNum
  ) {
    return {
      isValid: false,
      error: 'Please enter a valid date',
    };
  }

  // Check if date is not in the future
  if (date > new Date()) {
    return {
      isValid: false,
      error: 'Date of birth cannot be in the future',
    };
  }

  return { isValid: true };
};

export const validateName = (name: string): DateValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please enter your name',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters',
    };
  }

  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: 'Name must be less than 50 characters',
    };
  }

  return { isValid: true };
};
