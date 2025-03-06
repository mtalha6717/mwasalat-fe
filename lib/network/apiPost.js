const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiPost = async (query, formData) => {
  const isFormData = formData instanceof FormData;

  const config = {
    method: 'POST',
    body: isFormData ? formData : JSON.stringify(formData),
  };

  if (!isFormData) {
    config.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  return fetch(`${baseUrl}/${query}`, config)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });
};

export default apiPost;
