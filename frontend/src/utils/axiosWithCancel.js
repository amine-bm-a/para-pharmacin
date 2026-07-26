import axios from 'axios';

// Create a custom axios instance with cancellation support
const axiosWithCancel = () => {
  const CancelToken = axios.CancelToken;
  let cancel;

  const request = async (config) => {
    if (cancel) {
      cancel('Request canceled due to new request');
    }

    return axios({
      ...config,
      cancelToken: new CancelToken((c) => {
        cancel = c;
      })
    });
  };

  const cancelRequest = () => {
    if (cancel) {
      cancel('Request canceled');
      cancel = null;
    }
  };

  return { request, cancelRequest };
};

export default axiosWithCancel;
