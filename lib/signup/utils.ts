import * as yup from "yup";

export const handleSignUpError = (err: unknown) => {
  console.log(err);
};

export type FormValues = {
  email: string;
  password: string;
  username: string;
};

export const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email is required!")
    .email("Email is incorrect!"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 symbols!")
    .required("Password is required!"),
  username: yup.string().required("Username is required!"),
});
