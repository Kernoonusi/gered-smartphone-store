import { kyApi } from "@/lib/ky";
import { IProduct } from "@/types";

export const imagesService = {
  getFrontImage: (item: IProduct) => {
    return `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}Tel.jpg`;
  },
  getAllSmartPhoneImages: (item: IProduct) => {
    const images = [
      imagesService.getFrontImage(item),
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}Tel2.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}TelFront.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}TelLeftSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}TelRightSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}TelSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ")[0]}${item.nameProduct.split(" ")[1] ? "_" + item.nameProduct.split(" ")[1] : ""}TelUpSide.jpg`,
    ];
    return images;
  },
  updateAllPhotos: async ({ images, id }: { images: FileList; id: string }) => {
    const imagesFormData = new FormData();
    Array.from(images).forEach((file) => {
      imagesFormData.append("images[]", file);
    });
    const response = await kyApi
      .post(`products/update?id=${id}`, {
        body: imagesFormData,
      })
      .text();
    console.log(response);
    return response;
  },
};
