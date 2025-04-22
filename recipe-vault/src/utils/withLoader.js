import { getLoadingFunctions } from '../context/LoadingController';

export const withLoader = async (fn) => {
  const { startLoading, stopLoading } = getLoadingFunctions();

  try {
    startLoading?.();
    return await fn();
  } finally {
    stopLoading?.();
  }
};
