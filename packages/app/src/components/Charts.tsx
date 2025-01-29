import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { capitalize } from '~/lib/utils'
import { useMemo } from 'react'
import { trpc } from '~/utils/trpc.client'

export function ApplicationsByStatusChart() {
  const chartConfig = {
    count: {
      label: 'Count',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  type DataItem = { status: string; count: number }

  const applicationsQuery = trpc.applications.read.useQuery()

  const data = useMemo(() => {
    const groupedByStatus = Object.groupBy(
      applicationsQuery.data ?? [],
      (e) => e.applicationStatus ?? 'Unknown',
    )

    return Object.entries(groupedByStatus).map(([status, applications]) => {
      return {
        status: capitalize(status),
        count: applications?.length ?? 0,
        fill:
          status !== 'Unknown' ? 'var(--color-count)' : 'hsl(var(--primary))',
      }
    })
  }, [applicationsQuery.data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications grouped by their status</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={'status' satisfies keyof DataItem}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={'count' satisfies keyof DataItem}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
