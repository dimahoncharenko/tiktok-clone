import { storageService } from "@/shared/lib/utils";

export const makeFormDataForVideo = (
  name: string,
  videoType: string,
  uri: string
) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: `${name}`,
    type: `video/${videoType}`,
  } as unknown as Blob);

  return formData;
};

export const saveUserVideo = async (user_id: string, uri: string) => {
  const fileName = uri.split("/").pop();
  const formData = makeFormDataForVideo(
    `${fileName}`,
    `${fileName?.split(".").pop()}`,
    uri
  );

  const queryResult = await storageService.addVideoToStorageAndQuery({
    body: formData,
    name: `${fileName}`,
  });

  storageService.addToVideoTable({
    uri: `${queryResult?.path}`,
    user_id,
    title: "Test title added.",
  });
};
