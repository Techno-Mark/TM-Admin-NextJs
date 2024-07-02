import axios from "axios";

export const callAPIwithoutHeaders = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    ResponseStatus: string,
    Message: string,
    ResponseData: any
  ) => void,
  params: Object
) => {
  let response;

  try {
    if (method === "get") {
      response = await axios.get(
        `${process.env.baseURL}${pathName}`.toString(),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else if (method === "post") {
      response = await axios.post(
        `${process.env.baseURL}${pathName}`.toString(),
        params,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }
    const { ResponseStatus, ResponseData, Message } = response.data;
    successCallback(ResponseStatus, Message, ResponseData);
  } catch (error: any) {
    if (response?.status === 401) {
      const token = localStorage.get("token");
      // response = await axios.post(`${url}${signoutAPIUrl}`, {
      //   userId: Number(userId),
      // });
      if (response.data.ResponseStatus === "success") {
        localStorage.clear();
        window.location.href = "/login";
      } else if (
        response.data.ResponseStatus === "failure" &&
        response.data.Message === "Token not found"
      ) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    successCallback(
      "failure",
      "Something went wrong, please refer console for more details.",
      undefined
    );
    console.error(error.message);
  }
};

export const callAPIwithHeaders = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    ResponseStatus: string,
    Message: string,
    ResponseData: any
  ) => void,
  params: Object
  // headerIfAny?: any
) => {
  let response;
  const token = localStorage.getItem("token");

  try {
    if (method === "get") {
      response = await axios.get(
        `${process.env.baseURL}${pathName}`.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",

            // ...headerIfAny,
          },
        }
      );
    } else if (method === "post") {
      response = await axios.post(
        `${process.env.baseURL}${pathName}`.toString(),
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            // ...headerIfAny,
          },
        }
      );
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { ResponseStatus, ResponseData, Message } = response.data;
    successCallback(ResponseStatus, Message, ResponseData);
  } catch (error: any) {
    if (!!error.response) {
      switch (error.response.status) {
        case 400:
          return;
        case 401:
          localStorage.clear();
          window.location.href = "/login";
          return;
      }
    }

    successCallback(
      "failure",
      `Something went wrong, please refer console for more details.`,
      undefined
    );
    console.error(error.message);
  }
};
