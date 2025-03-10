import { usePathname } from "expo-router";
import { useEffect, useState } from "react";

export const useIsCurrentTab = (target: string) => {
  const pathname = usePathname();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (pathname === target) setIsValid(true);
    else setIsValid(false);
  }, [pathname, target]);

  return isValid;
};
