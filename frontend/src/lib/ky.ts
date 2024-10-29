import ky from "ky";

export const kyApi = ky.create({
  prefixUrl: "http://104.252.127.196/api",
  hooks: {
    beforeError: [
        error => {
            const {response} = error;
            
            response.text().then((data) => console.log(data));

            return error;
        }
    ],
  },
});
