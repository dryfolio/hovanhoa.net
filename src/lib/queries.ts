import { gql } from '@apollo/client'

export const GET_STATISTIC = gql`
    query viewer($zoneTag: string, $date_start: string, $date_end: string) {
        viewer {
            zones(filter: { zoneTag: $zoneTag }) {
                httpRequests1dGroups(
                    orderBy: [date_ASC]
                    limit: 1000
                    filter: { date_geq: $date_start, date_lt: $date_end }
                ) {
                    date: dimensions {
                        date
                    }
                    sum {
                        requests
                        pageViews
                        cachedBytes
                        bytes
                    }
                    uniq {
                        uniques
                    }
                }
            }
        }
    }
`
