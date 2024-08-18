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