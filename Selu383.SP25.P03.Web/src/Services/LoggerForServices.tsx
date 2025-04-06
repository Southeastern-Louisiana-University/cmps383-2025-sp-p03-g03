import axios from "axios";

type LogData = unknown;

// Create a custom logger with strong typing
export const logger = {
  info: (message: string, data?: LogData) => {
    console.log(
      `%c[INFO] ${message}`,
      "color: blue; font-weight: bold;",
      data || ""
    );
  },
  success: (message: string, data?: LogData) => {
    console.log(
      `%c[SUCCESS] ${message}`,
      "color: green; font-weight: bold;",
      data || ""
    );
  },
  error: (message: string, error: unknown) => {
    console.error(
      `%c[ERROR] ${message}`,
      "color: red; font-weight: bold;",
      error
    );
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `%c[ERROR DETAILS] Status: ${error.response.status}`,
        "color: red;"
      );
      console.error(`%c[ERROR DATA]`, "color: red;", error.response.data);
    }
  },
  warn: (message: string, data?: LogData) => {
    console.warn(
      `%c[WARN] ${message}`,
      "color: orange; font-weight: bold;",
      data || ""
    );
  },
  request: (method: string, url: string, data?: LogData) => {
    console.log(
      `%c[REQUEST] ${method.toUpperCase()} ${url}`,
      "color: purple; font-weight: bold;",
      data || ""
    );
  },
};
