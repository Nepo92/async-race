import { APIConfig } from "./types/api";

class API {
  private baseURL = process.env.NODE_API_BASE;

  fetch(url: string, config: Partial<APIConfig> = {}) {
    return new Promise((res, rej) => {
      const request = new XMLHttpRequest();

      if (config.process) {
        request.addEventListener("progress", (e: ProgressEvent) => {
          config.process!(e);
        });
      }

      if (config.headers) {
        config.headers.push(["Content-type", "application/json;charset=UTF-8"]);
      } else {
        config.headers = [];
        config.headers.push(["Content-type", "application/json;charset=UTF-8"]);
      }

      if (config.method) {
        try {
          request.open(config.method, this.baseURL + url, true);
        } catch {
          throw new Error("Error in open request");
        }

        for (const header of config.headers) {
          request.setRequestHeader(header[0], header[1]);
        }

        request.responseType = "json";

        try {
          request.send(JSON.stringify(config.body));
        } catch {
          throw new Error("Error in send request");
        }

        request.onreadystatechange = () => {
          if (request.readyState === 4) {
            const status = request.status;

            if (status >= 400) {
              rej(status);
            } else if (status >= 200) {
              res(request.response);
            }
          }
        };
      }
    });
  }
}

export default API;
