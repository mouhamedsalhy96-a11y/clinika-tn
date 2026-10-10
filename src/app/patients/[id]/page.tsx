import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PatientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .select(`
      id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      city,
      cin,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      administrative_notes,
      created_at
    `)
    .eq("id", id)
    .eq("is_archived", false)
    .single();

  if (error || !patient) {
    notFound();
  }

  const birthDate = patient.date_of_birth
    ? new Intl.DateTimeFormat("fr-TN").format(
        new Date(`${patient.date_of_birth}T00:00:00`)
      )
    : "Non renseignée";

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/patients"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Retour aux patients
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {patient.first_name} {patient.last_name}
          </h1>

          <p className="mt-1 text-slate-500">Dossier patient</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InfoSection title="Identité">
            <InfoItem label="Prénom" value={patient.first_name} />
            <InfoItem label="Nom" value={patient.last_name} />
            <InfoItem label="Date de naissance" value={birthDate} />
            <InfoItem label="Sexe" value={patient.gender} />
            <InfoItem label="CIN" value={patient.cin} />
            <InfoItem label="Groupe sanguin" value={patient.blood_group} />
          </InfoSection>

          <InfoSection title="Coordonnées">
            <InfoItem label="Téléphone" value={patient.phone} />
            <InfoItem label="Adresse e-mail" value={patient.email} />
            <InfoItem label="Adresse" value={patient.address} />
            <InfoItem label="Ville" value={patient.city} />
          </InfoSection>

          <InfoSection title="Contact d’urgence">
            <InfoItem
              label="Nom du contact"
              value={patient.emergency_contact_name}
            />
            <InfoItem
              label="Téléphone"
              value={patient.emergency_contact_phone}
            />
          </InfoSection>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Actions</h2>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                disabled
                className="w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white opacity-60"
              >
                Nouvelle consultation
              </button>

              <button
                type="button"
                disabled
                className="w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 opacity-60"
              >
                Ajouter un document
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Ces fonctions seront ajoutées progressivement.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Notes administratives
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
              {patient.administrative_notes || "Aucune note administrative."}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      <dl className="mt-5 grid gap-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

type InfoItemProps = {
  label: string;
  value: string | null;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900">{value || "Non renseigné"}</dd>
    </div>
  );
}