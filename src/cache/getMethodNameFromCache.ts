import getMethodName from '../stack/getMethodName';
import { combineSkeleton } from '../stack/createSkeleton';

const storage = require('node-persist');
const fs = require('fs');
const path = require('path');

export default async function getMethodNameWithCache(
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  brief
) {
  const wholeSkeleton = combineSkeleton(
    briefSkeleton,
    functionAndOutputSkeleton
  );

  await storage.init({
    dir: path.join(__dirname, '.stack'),
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false, // can also be custom logging function
    ttl: false, // ttl* [NEW], can be used for expiring records
    expiredInterval: 2 * 60 * 60 * 1000, // every 2 hours the process will clean-up the expired cache
    forgiveParseErrors: false,
  });
  // The cache key is a concatenation of `wholeSkeleton` and the name of the method
  const cacheKey =
    wholeSkeleton + (await getMethodName({ wholeSkeleton, brief }));

  // Try to read the cache first
  let methodName = await storage.getItem(cacheKey);

  // If it's not in the cache, call the actual function
  if (!methodName) {
    methodName = await getMethodName({ wholeSkeleton, brief });

    // Then update the cache with the new value
    await storage.setItem(cacheKey, methodName);
  }

  return methodName;
}
