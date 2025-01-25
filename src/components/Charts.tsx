import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalize } from "~/lib/utils";
import { useMemo } from "react";
import { useApplicationsQuery } from "~/utils/queries";

export function ApplicationsByStatusChart() {
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  type DataItem = { status: string; count: number };

  const applicationsQuery = useApplicationsQuery();

  const data = useMemo(() => {
    const groupedByStatus = Object.groupBy(
      applicationsQuery.data?.documents ?? [],
      (e) => e.application_status ?? "Unknown",
    );

    return Object.entries(groupedByStatus).map(([status, applications]) => {
      return {
        status: capitalize(status),
        count: applications.length,
        fill:
          status !== "Unknown" ? "var(--color-count)" : "hsl(var(--primary))",
      };
    });
  }, [applicationsQuery.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications grouped by their status</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"status" satisfies keyof DataItem}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={"count" satisfies keyof DataItem} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
