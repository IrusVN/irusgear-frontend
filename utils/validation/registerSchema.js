import * as yup from 'yup'
import { useNuxtApp } from '#app'

const noXSS = /^[^<>{};]+$/
const emailRegex = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/

export const registerSchema = (isStudent, isBusiness) => {
  const t = useNuxtApp().$i18n.t

  return yup.object({
    firstName: yup
      .string()
      .required(t('validate.required'))
      .matches(noXSS, t('validate.xss_invalid')),

    lastName: yup
      .string()
      .required(t('validate.required'))
      .matches(noXSS, t('validate.xss_invalid')),

    dob: yup
      .date()
      .typeError(t('validate.invalid_date'))
      .required(t('validate.required')),

    phoneNumber: yup
      .string()
      .required(t('validate.required'))
      .matches(/^[0-9]+$/, t('validate.numeric_only'))
      .min(10, t('validate.phone_min'))
      .max(12, t('validate.phone_max')),

    email: yup
      .string()
      .required(t('validate.required'))
      .matches(emailRegex, t('validate.email_invalid')),

    password: yup
      .string()
      .min(6, t('validate.password_min'))
      .required(t('validate.required')),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('validate.password_not_match'))
      .required(t('validate.required')),

    // --- Student Validation ---
    schoolLevel: isStudent
      ? yup.string().required(t('validate.required'))
      : yup.string().nullable(),

    schoolName: isStudent
      ? yup.string()
          .required(t('validate.required'))
          .matches(noXSS, t('validate.xss_invalid'))
      : yup.string().nullable(),

    // --- Business Validation ---
    taxCode: isBusiness
      ? yup.string()
          .required(t('validate.required'))
          .matches(noXSS, t('validate.xss_invalid'))
      : yup.string().nullable(),

    companyName: isBusiness
      ? yup.string()
          .required(t('validate.required'))
          .matches(noXSS, t('validate.xss_invalid'))
      : yup.string().nullable(),

    companyAddress: isBusiness
      ? yup.string()
          .required(t('validate.required'))
          .matches(noXSS, t('validate.xss_invalid'))
      : yup.string().nullable(),

    companyEmail: isBusiness
      ? yup.string()
          .required(t('validate.required'))
          .matches(emailRegex, t('validate.email_invalid'))
      : yup.string().nullable(),

    authorizedCCCD: isBusiness
      ? yup.string()
          .required(t('validate.required'))
          .matches(noXSS, t('validate.xss_invalid'))
      : yup.string().nullable(),

    note: yup
      .string()
      .nullable()
      .test('xss-check', t('validate.xss_invalid'), (value) => {
        if (!value || value === '') return true;
        return noXSS.test(value);
      })
      .max(500, t('validate.max_length', { max: 500 })),
  })
}
