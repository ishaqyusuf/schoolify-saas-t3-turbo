import { z } from "zod";

export const getClassRoomAssessmentFormSchema = z.object({
  classRoomId: z.number(),
});
export const addStudentSchema = z.object({
  //   id: z.number().nullable(),
  classRoomId: z.number(),
  firstName: z.string().min(1),
  fathersName: z.string().min(1),
  otherName: z.string().optional(),
  classCode: z.string(),
});
export const getStudentAssessmentFormSchema = z.object({
  //   id: z.number().nullable(),
  classRoomId: z.number(),
  studentId: z.number(),
  subjectId: z.number(),
});
export const deleteSubjectAssessmentSchema = z.object({
  //   id: z.number().nullable(),
  id: z.number(),
});
export const saveStudentAssessmentSchema = z.object({
  subjectOnClassRoomId: z.number(),
  assessmentId: z.number(),
  studentId: z.number(),
  obtained: z.number().nullable(),
});
export const saveJobAssessmentSchema = z.object({
  //   id: z.number().nullable(),
  subjectsOnClassRoomsId: z.number(),
  obtainable: z.string(),
  title: z.string(),
});
export const addSubjecSchema = z.object({
  title: z.string(),
  code: z.string(),
  classGroupCode: z.string(),
  classRoomId: z.number(),
});
