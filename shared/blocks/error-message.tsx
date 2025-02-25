import { Text } from "react-native";

import { cn } from "../lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const ErrorMessage = ({ className, children }: Props) => {
  return (
    <Text className={cn("text-red-700 font-semibold text-sm", className)}>
      {children}
    </Text>
  );
};
