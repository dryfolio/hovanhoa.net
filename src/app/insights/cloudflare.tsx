import { AreaChart, Flex, Metric, Text } from '@tremor/react'
import { TextDataSource } from '../../components/text-data-source'
import {CloudflareAnalyticsByDate} from "../../../packages/interface/cloudflare";
import {CloudflareGraph} from "@/lib/cloudflare";


export interface CloudflareProps {
  data: CloudflareAnalyticsByDate
  totalRequests: number
  totalPageviews: number
  generatedAt: string
}

async function dataFormatter(number: number) {
  return Intl.NumberFormat('us').format(number).toString()
}

export async function Cloudflare() {
  const { data, generatedAt, totalRequests, totalPageviews } = await CloudflareGraph.GetStatistic()

  const chartData = data.viewer.zones[0]?.httpRequests1dGroups?.map((item: { date: { date: any; }; sum: { pageViews: any; requests: any; }; uniq: { uniques: any; }; }) => {
    return {
      date: item.date.date,
      'Page Views': item.sum.pageViews,
      Requests: item.sum.requests,
      'Unique Visitors': item.uniq.uniques,
    }
  })

  const cards = [
    {
      title: 'Total Requests',
      value: await dataFormatter(totalRequests || 0),
      valueDesc: 'in 30 days',
    },
    {
      title: 'Total Pageviews',
      value: await dataFormatter(totalPageviews || 0),
      valueDesc: 'in 30 days',
    },
  ]

  return (
      <div className="mx-auto">
        <Flex className="mb-5">
          {cards.map((card) => (
              <div key={card.title}>
                <Text className="dark:text-white">{card.title}</Text>
                <Flex
                    alignItems="baseline"
                    className="space-x-3"
                    justifyContent="start"
                >
                  <Metric className="dark:text-black">{card.value}</Metric>
                  <Text className="truncate dark:text-white">{card.valueDesc}</Text>
                </Flex>
              </div>
          ))}
        </Flex>
        <div className="flex flex-col gap-16">
          <AreaChart
              className="hidden h-72 sm:block"
              data={chartData}
              index="date"
              categories={['Requests', 'Page Views', 'Unique Visitors']}
              colors={["blue", "cyan", "violet"]}
              yAxisWidth={35}
              showLegend={false}
          />
          </div>
          <AreaChart
              categories={['Requests', 'Page Views', 'Unique Visitors']}
              data={chartData}
              index="date"
              showGridLines={false}
              showYAxis={false}
          />

          {/*<TextDataSource>Cloudflare | Generated at {generatedAt}</TextDataSource>*/}
        </div>
        )
        }
