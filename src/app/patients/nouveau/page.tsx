"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createPatient,
  type PatientActionState,
} from "./actions";

const initialState: PatientActionState = {};

export default function NouveauPatientPage() {
  const [state, formAction, isPending] = useActionState(
    createPatient,
    initialState
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link
            href="/patients"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Retour aux patients
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Nouveau patient
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <form action={formAction}>
          {state.error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <h2 className="text-lg font-semibold text-slate-900">
            Identité
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Prénom"
              name="firstName"
              required
              error={state.fieldErrors?.firstName?.[0]}
            />

            <FormField
              label="Nom"
              name="lastName"
              required
              error={state.fieldErrors?.lastName?.[0]}
            />

            <FormField
              label="Date de naissance"
              name="dateOfBirth"
              type="date"
              error={state.fieldErrors?.dateOfBirth?.[0]}
            />

            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Sexe
              </label>

              <select
                id="gender"
                name="gender"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Non renseigné</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <FormField
              label="Numéro CIN"
              name="cin"
              error={state.fieldErrors?.cin?.[0]}
            />

            <div>
              <label
                htmlFor="bloodGroup"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Groupe sanguin
              </label>

              <select
                id="bloodGroup"
                name="bloodGroup"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Non renseigné</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <h2 className="mt-10 text-lg font-semibold text-slate-900">
            Coordonnées
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Téléphone"
              name="phone"
              type="tel"
              error={state.fieldErrors?.phone?.[0]}
            />

            <FormField
              label="Adresse e-mail"
              name="email"
              type="email"
              error={state.fieldErrors?.email?.[0]}
            />

            <FormField
              label="Adresse"
              name="address"
              error={state.fieldErrors?.address?.[0]}
            />

            <FormField
              label="Ville"
              name="city"
              error={state.fieldErrors?.city?.[0]}
            />
          </div>

          <h2 className="mt-10 text-lg font-semibold text-slate-900">
            Contact d’urgence
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Nom du contact"
              name="emergencyContactName"
              error={state.fieldErrors?.emergencyContactName?.[0]}
            />

            <FormField
              label="Téléphone du contact"
              name="emergencyContactPhone"
              type="tel"
              error={state.fieldErrors?.emergencyContactPhone?.[0]}
            />
          </div>

          <div className="mt-10">
            <label
              htmlFor="administrativeNotes"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Notes administratives
            </label>

            <textarea
              id="administrativeNotes"
              name="administrativeNotes"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Informations administratives uniquement"
            />

            {state.fieldErrors?.administrativeNotes?.[0] && (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.administrativeNotes[0]}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/patients"
              className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Enregistrement..." : "Enregistrer le patient"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
};

function FormField({
  label,
  name,
  type = "text",
  required = false,
  error,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}