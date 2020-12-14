import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors(
          <div className="alert alert-danger">
            <ul className="my-0">
              {error.response.data.map((err, i) => {
                return <li key={i}> {err.message}</li>;
              })}
            </ul>
          </div>
        );
      } else {
        setErrors(error.message);
      }
    }
  };
  return { doRequest, errors };
};

export default useRequest;
