import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsByStatusChart } from "~/components/Charts";
import { requireAuth } from "~/stores/session";

export const Route = createFileRoute("/stats")({
  component: StatsComponent,
  beforeLoad() {
    requireAuth();
  },
});

function StatsComponent() {
  return (
    <div className="w-full p-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pt-10">
      <div>
        <ApplicationsByStatusChart />
      </div>
    </div>
  );
}
