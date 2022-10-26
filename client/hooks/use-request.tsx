import axios from "axios";
import React, { ReactNode, useState } from "react";

export const useRequest = ({
  url,
  method,
  onSuccess = () => null,
}: {
  url: string;
  method: "post" | "get" | "put" | "delete";
  onSuccess?: (data: any) => void;
}) => {
  const [errors, setErrors] = useState<ReactNode | null>(null);

  const doRequest = async (body: any) => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);

      onSuccess(response);

      return response.data;
    } catch (err: any) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err?.response?.data?.errors?.map((err: { message: string }) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
