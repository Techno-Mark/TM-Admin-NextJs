import axios from "axios";
import { toast } from "react-toastify";

export const callAPI = async (
  url: string,
  params: any,
  successCallback: any,
  method: "get" | "post" | "GET" | "POST"
) => {
  try {
    const token = await localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };

    let response;

    if (method.toLowerCase() === "get") {
      response = await axios.get(url, config);
    } else if (method.toLowerCase() === "post") {
      response = await axios.post(url, params, config);
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { ResponseStatus, ResponseData, Message } = response.data;
    if (response.status === 200) {
      if (ResponseStatus.toLowerCase() === "success") {
        successCallback(ResponseData, false, ResponseStatus.toLowerCase());
      } else if (ResponseStatus.toLowerCase() === "warning") {
        successCallback(
          Message !== null && Message.trim().length > 0
            ? Message
            : ResponseData,
          false,
          ResponseStatus.toLowerCase()
        );
      } else {
        if (Message === null || Message.trim().length <= 0) {
          toast.error(!!Message ? Message : "Please try again later.");
        } else {
          toast.error(Message);
        }
        successCallback(null, true, ResponseStatus.toLowerCase());
      }
    } else {
      if (Message === null) {
        toast.error("Please try again later.");
      } else {
        toast.error(Message);
      }
      successCallback(null, true, ResponseStatus.toLowerCase());
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
      localStorage.clear();
    }
  }
};
