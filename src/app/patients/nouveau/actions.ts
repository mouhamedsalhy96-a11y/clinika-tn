"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().or(z.literal(""));

const patientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date de naissance invalide.")
    .optional()
    .or(z.literal("")),

  gender: z.enum(["homme", "femme", "autre"]).optional().or(z.literal("")),

  phone: optionalText(30),

  email: z
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .max(150)
    .optional()
    .or(z.literal("")),

  address: optionalText(250),
  city: optionalText(100),
  cin: optionalText(30),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional()
    .or(z.literal("")),

  emergencyContactName: optionalText(150),
  emergencyContactPhone: optionalText(30),
  administrativeNotes: optionalText(2000),
});

export type PatientActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createPatient(
  _previousState: PatientActionState,
  formData: FormData
): Promise<PatientActionState> {
  const validation = patientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    city: formData.get("city"),
    cin: formData.get("cin"),
    bloodGroup: formData.get("bloodGroup"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
    administrativeNotes: formData.get("administrativeNotes"),
  });

  if (!validation.success) {
    return {
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("clinic_id, is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active || !profile.clinic_id) {
    return {
      error: "Votre compte ne permet pas de créer un patient.",
    };
  }

  const patient = validation.data;

  const { error } = await supabase.from("patients").insert({
    clinic_id: profile.clinic_id,
    created_by: user.id,
    first_name: patient.firstName,
    last_name: patient.lastName,
    date_of_birth: patient.dateOfBirth || null,
    gender: patient.gender || null,
    phone: patient.phone || null,
    email: patient.email || null,
    address: patient.address || null,
    city: patient.city || null,
    cin: patient.cin || null,
    blood_group: patient.bloodGroup || null,
    emergency_contact_name: patient.emergencyContactName || null,
    emergency_contact_phone: patient.emergencyContactPhone || null,
    administrative_notes: patient.administrativeNotes || null,
  });

  if (error) {
    console.error("Erreur de création du patient :", error);

    if (error.code === "23505") {
      return {
        error: "Un patient avec ce numéro CIN existe déjà dans ce cabinet.",
      };
    }

    return {
      error: "Impossible d’enregistrer le patient. Veuillez réessayer.",
    };
  }

  redirect("/patients");
}