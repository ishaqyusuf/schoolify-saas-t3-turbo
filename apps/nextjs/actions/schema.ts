import { z } from "zod";

export const getClassRoomAssessmentFormSchema = z.object({
  classRoomId: z.number(),
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
export const saveJobAssessmentSchema = z.object({
  //   id: z.number().nullable(),
  subjectsOnClassRoomsId: z.number(),
  obtainable: z.string(),
  title: z.string(),
});
