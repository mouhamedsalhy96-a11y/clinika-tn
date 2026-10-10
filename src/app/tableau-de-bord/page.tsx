import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TableauDeBordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_active, clinic_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || !profile.clinic_id) {
    await supabase.auth.signOut();
    redirect("/connexion");
  }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("name")
    .eq("id", profile.clinic_id)
    .single();

  const roleLabels = {
    admin: "Administrateur",
    docteur: "Docteur",
    secretaire: "Secrétaire",
  } as const;

  const roleLabel =
    roleLabels[profile.role as keyof typeof roleLabels] ?? profile.role;

  return (
    <main className="min-h-screen bg-slate-100">
  <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clinika TN</h1>

        <p className="mt-1 text-sm text-slate-500">
          {clinic?.name ?? "Cabinet médical"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-semibold text-slate-900">
            {profile.full_name ?? "Utilisateur"}
          </p>

          <p className="text-sm text-slate-500">{roleLabel}</p>
        </div>

        <form action="/deconnexion" method="post">
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  </header>

  <section className="mx-auto max-w-7xl px-6 py-10">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">Tableau de bord</h2>

      <p className="mt-2 text-slate-600">
        Bienvenue dans votre espace de gestion du cabinet.
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard title="Patients" value="0" />
      <DashboardCard title="Rendez-vous aujourd’hui" value="0" />
      <DashboardCard title="Consultations" value="0" />
      <DashboardCard title="Documents à traiter" value="0" />
    </div>

    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Activité du cabinet
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Les futurs rendez-vous, patients et tâches importantes apparaîtront ici.
      </p>
    </div>
  </section>
</main>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
};

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </article>
  );
}