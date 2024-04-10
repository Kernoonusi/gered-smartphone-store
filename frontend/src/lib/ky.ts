import ky from "ky";

export const kyApi = ky.create({
  prefixUrl: "http://gered-store-back.lndo.site",
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
