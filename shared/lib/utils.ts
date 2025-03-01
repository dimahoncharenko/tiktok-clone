import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

import { supabase } from "../config/supabase.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export abstract class InitService {
  protected client: typeof supabase;

  constructor() {
    this.client = supabase;
  }
}
