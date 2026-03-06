import { NextApiRequest } from 'next';

export interface AuthedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const handleError = (err: unknown): string => {
  return err instanceof Error ? err.message : String(err);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatData = (data: Record<string, any>): Record<string, any> => {
  // Custom formatting logic
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = data[key] instanceof Date ? data[key].toISOString() : data[key];
    return acc;
  }, {} as Record<string, any>);
};

export const rateLimit = (() => {
  const requests = new Map<string, number>();
  const RATE_LIMIT_TIME = 60000; // 1 minute
  const MAX_REQUESTS = 100;

  return (key: string): boolean => {
    const currentTime = Date.now();
    const requestCount = requests.get(key) || 0;

    if (requestCount >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    requests.set(key, requestCount + 1);

    setTimeout(() => {
      const updatedCount = requests.get(key) || 0;
      requests.set(key, Math.max(updatedCount - 1, 0));
    }, RATE_LIMIT_TIME);

    return true; // Request allowed
  };
})();