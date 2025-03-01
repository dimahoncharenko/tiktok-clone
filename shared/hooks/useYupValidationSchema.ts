import { useCallback } from "react";
import { AnyObjectSchema, ValidationError } from "yup";
import {
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverResult,
} from "react-hook-form";

export const useYupValidationResolver = <T extends FieldValues>(
  validationSchema: AnyObjectSchema
): Resolver<T> =>
  useCallback(
    async (data: T): Promise<ResolverResult<T>> => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,

          errors: {} as FieldErrors<T>,
        };
      } catch (error) {
        const validationError = error as ValidationError;

        return {
          values: {} as T,
          errors: validationError.inner.reduce((allErrors, currentError) => {
            if (currentError.path) {
              (allErrors as Record<string, { type: string; message: string }>)[
                currentError.path
              ] = {
                type: currentError.type ?? "validation",
                message: currentError.message,
              };
            }
            return allErrors;
          }, {} as ResolverResult<T>["errors"]),
        };
      }
    },
    [validationSchema]
  );
