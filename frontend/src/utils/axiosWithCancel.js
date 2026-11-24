import axios from 'axios';

// Create a custom axios instance with cancellation support (AbortController)
const axiosWithCancel = () => {
  let controller;

  const request = async (config) => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();

    return axios({
      ...config,
      signal: controller.signal,
    });
  };

  const cancelRequest = () => {
    if (controller) {
      controller.abort();
      controller = null;
    }
  };

  return { request, cancelRequest };
};

export default axiosWithCancel;
