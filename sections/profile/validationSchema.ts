import * as Yup from "yup";

export const editProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  zip: Yup.string()
    .required("ZIP/Location is required")
    .min(3, "ZIP must be at least 3 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[\d\s\-()]+$/, "Invalid phone number format"),
  bio: Yup.string().max(500, "Bio must not exceed 500 characters"),
  experiences: Yup.array().of(
    Yup.object().shape({
      position: Yup.string().required("Position is required"),
      company: Yup.string().required("Company is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().when("current", {
        is: false,
        then: (schema) => schema.required("End date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ),
  educations: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required("Degree is required"),
      institution: Yup.string().required("Institution is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().required("End date is required"),
    })
  ),
  skills: Yup.array().of(Yup.string()),
});
