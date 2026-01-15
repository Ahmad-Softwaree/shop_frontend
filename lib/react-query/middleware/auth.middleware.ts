import { getLoginSchema, LoginSchema } from "@/validation/login.validation";
import {
  getProfileSchema,
  ProfileSchema,
} from "@/validation/profile.validation";
import {
  getRegisterSchema,
  RegisterSchema,
} from "@/validation/register.validation";
import { i18n } from "i18next";

export const registerMiddleware = async (lang: i18n, data: RegisterSchema) => {
  try {
    let schema = getRegisterSchema(lang);
    let validation = schema.safeParse({
      ...data,
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }
  } catch (error) {
    throw error;
  }
};
export const loginMiddleware = async (lang: i18n, data: LoginSchema) => {
  try {
    let schema = getLoginSchema(lang);
    let validation = schema.safeParse({
      ...data,
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }
  } catch (error) {
    throw error;
  }
};
export const profileMiddleware = async (lang: i18n, data: ProfileSchema) => {
  try {
    let schema = getProfileSchema(lang);
    let validation = schema.safeParse({
      ...data,
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }
  } catch (error) {
    throw error;
  }
};
