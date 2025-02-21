import { z } from "zod";

export const getStudentAssessmentFormSchema = z.object({
  //   id: z.number().nullable(),
  id: z.number(),
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
