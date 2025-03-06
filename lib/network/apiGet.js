import qs from 'qs';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiGet = async (url, params) => {
  const config = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const query = qs.stringify(params);

  return fetch(`${baseUrl}/${url}?${query}`, config)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });
};

export default apiGet;
