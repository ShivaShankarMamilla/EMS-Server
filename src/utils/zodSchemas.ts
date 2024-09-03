import {z} from "zod"

export const educationSchema = z.object({
    degree: z.string(),
    fieldOfStudy: z.string(),
    institution: z.string(),
    yearOfCompletion: z.number(),
  });

  export const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    joiningDate: z.string().transform((val) => new Date(val)),
    address: z.string(),
    skills: z.array(z.string()),
    role: z.string(),
    education: educationSchema,
    bloodGroup: z.string(),
    dateOfBirth: z.string().transform((val) => new Date(val)),
    phoneNumber: z.string(),
    email: z.string().email(), 
    gender: z.enum(['male', 'female', 'others']),
  });

  export const attendanceSchema = z.object({
    userId: z.string(), 
    date: z.string().transform((val) => new Date(val)),
    loginTime: z.date(),
    logoutTime: z.date().optional(),
  });

  export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
  })
  
  export const otpRequestSchema = z.object({
    email: z.string().email(), // Expecting an email for OTP
  });

  export const otpVerifySchema = z.object({
    _id: z.string().nonempty("User ID is required"),
    otp: z.number().min(100000, "OTP must be 6 digits").max(999999, "OTP must be 6 digits"),
  });

  export const passwordResetRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
  });
  
  export const passwordResetSchema = z.object({
    // token: z.string().nonempty("Reset token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  });

  export const logoutSchema = z.object({
    userId: z.string()
  })