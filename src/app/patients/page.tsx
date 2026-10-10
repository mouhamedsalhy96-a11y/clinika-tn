import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PatientsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active, clinic_id")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active || !profile.clinic_id) {
    redirect("/connexion");
  }

  const { data: patients, error } = await supabase
    .from("patients")
    .select("id, first_name, last_name, phone, date_of_birth, city")
    .eq("is_archived", false)
    .order("last_name", { ascending: true });

  if (error) {
    console.error("Erreur de chargement des patients :", error);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/tableau-de-bord"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Tableau de bord
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Patients
            </h1>
          </div>

          <Link
            href="/patients/nouveau"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Nouveau patient
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {!patients || patients.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Aucun patient enregistré
            </h2>

            <p className="mt-2 text-slate-600">
              Commencez par créer le premier dossier patient du cabinet.
            </p>

            <Link
              href="/patients/nouveau"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Ajouter un patient
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Date de naissance
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Téléphone
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Ville
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {patient.last_name} {patient.first_name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {patient.date_of_birth
                          ? new Intl.DateTimeFormat("fr-TN").format(
                              new Date(`${patient.date_of_birth}T00:00:00`)
                            )
                          : "Non renseignée"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {patient.phone || "Non renseigné"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {patient.city || "Non renseignée"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}