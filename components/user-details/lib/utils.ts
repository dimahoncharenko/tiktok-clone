import { supabase } from "@/shared/config/supabase.config";
import { SUPABASE_STORAGE_KEYS } from "@/shared/constants/storage";

type UploadAvatarParams = {
  body: FormData;
  name: string;
  user_id: string;
};

const addAvatarToStorageAndQuery = async ({
  body,
  name,
  user_id,
}: UploadAvatarParams) => {
  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_KEYS.AVATARS + "/" + user_id)
    .upload(name, body, {
      upsert: true,
      cacheControl: "3600000000",
    });

  if (error) throw error;

  return data;
};

const makeFormDataForAvatar = (imageType: string, uri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: `avatar.${imageType}`,
    type: `image/${imageType}`,
  } as unknown as Blob);

  return formData;
};

type AvatarCredentials = {
  user_id: string;
  uri: string;
};

export const saveUserAvatar = async ({ uri, user_id }: AvatarCredentials) => {
  const fileName = uri.split("/").pop();
  const extension = fileName?.split(".").pop();

  const formData = makeFormDataForAvatar(`${extension}`, uri);

  const queryResult = await addAvatarToStorageAndQuery({
    body: formData,
    name: `avatar.${extension}`,
    user_id,
  });

  return queryResult;
};
