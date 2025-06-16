import z from "zod";

const speaker = z.object({
  id: z
    .string({
      required_error: "O ID do membro é obrigatório",
      invalid_type_error: "O ID do membro deve ser uma string válida",
    })
    .min(1, "O ID do membro é obrigatório"),
  type: z.enum(["internal", "external"], {
    required_error: "O tipo do discursante é obrigatório",
    invalid_type_error: "O tipo do discursante deve ser uma string válida",
  }),
  speaker_position: z
    .number({
      required_error: "A ordem do discursante é obrigatória",
      invalid_type_error: "A ordem do discursante deve ser um número válido",
    })
    .min(1, "A ordem do discursante é obrigatória"),
});

export const createSpeakersSchema = z.object({
  sacrament_meeting_date: z
    .string({ required_error: "A data é obrigatória" })
    .datetime({ message: "A data fornecida não é válida" }),
  ward_id: z.number({
    required_error: "O ID da ala é obrigatório",
    invalid_type_error: "O ID da ala deve ser um número válido",
  }),
  speakers: z.array(speaker),
});
