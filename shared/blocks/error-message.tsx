import { Text } from "react-native";
import { clsx } from "clsx";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const ErrorMessage = ({ className, children }: Props) => {
  return (
    <Text className={clsx("text-red-700 font-semibold text-sm", className)}>
      {children}
    </Text>
  );
};
