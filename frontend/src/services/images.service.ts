import { kyApi } from "@/lib/ky";
import { IProduct } from "@/types";

export const imagesService = {
  getFrontImage: (item: IProduct) => {
    return `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}Tel.jpg`;
  },
  getAllSmartPhoneImages: (item: IProduct) => {
    const images = [
      imagesService.getFrontImage(item),
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}Tel2.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}TelFront.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}TelLeftSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}TelRightSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}TelSide.jpg`,
      `http://gered-store-back.lndo.site/smartphones/${item.brand}_${item.nameProduct.split(" ").join("_")}TelUpSide.jpg`,
    ];
    return images;
  },
  updateAllPhotos: async ({ images, id }: { images: FileList; id: string }) => {
    const imagesFormData = new FormData();
    Array.from(images).forEach((file) => {
      imagesFormData.append("images[]", file);
    });
    imagesFormData.append("id", id);
    const response = await kyApi
      .post(`products/update`, {
        body: imagesFormData,
      })
      .text();
    console.log(response);
    return response;
  },
};
