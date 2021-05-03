<template>
  <div>
    <noscript>
      Diese Webseite benötigt JavaScript, um ein Diagramm anzuzeigen.
    </noscript>
    <link
      rel="stylesheet"
      href="https://unpkg.com/charts.css/dist/charts.min.css"
    />
    <table
      class="covid-chart charts-css area show-4-secondary-axes show-heading show-labels"
    >
      <caption>
        Neuinfektionen nach Datum<br />
        Höchstwert in dieser Darstellung:
        {{
          getAbsHighCases()
        }}
      </caption>
      <tbody>
        <tr v-for="(datapoint, index) in data" :key="index">
          <th scope="row">
            <span
              data-type="day"
              :class="
                data.length > 30 && data.length < 356 && index % 10 !== 0
                  ? ' visually-hidden'
                  : ''
              "
              >{{ datapoint.date }}</span
            >
          </th>
          <td :style="getChartStyle(datapoint, index)">
            <span class="tooltip label-y">
              {{ datapoint.date }}<br />{{ datapoint.cases }}
            </span>
            <span
              :class="
                'label label-y' + (data.length > 30 ? ' visually-hidden' : '')
              "
              >{{ datapoint.cases }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

interface Datapoint {
  date: string
  cases: number
}

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<Datapoint[]>,
      required: true,
    },
  },
  setup(props) {
    const getAbsHighCases = () =>
      Array.from(props.data).sort((x, y) => y.cases - x.cases)[0].cases
    const getPercentile = (value: number): number => value / getAbsHighCases()
    const getChartStyle = (datapoint: Datapoint, index: number): string => {
      const inPoint = getPercentile(
        index === 0 ? datapoint.cases : props.data[index - 1].cases
      )
      // const inPoint = getPercentile(datapoint.cases)
      const outPoint = getPercentile(datapoint.cases)
      return `--start: ${inPoint}; --size: ${outPoint}`
    }

    return {
      getAbsHighCases,
      getPercentile,
      getChartStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.covid-chart {
  height: 50vw;
  width: 90vw;
  min-width: 31.25rem;
  min-height: 18.75rem;
}

.tooltip {
  z-index: 100;
}

.label-y {
  width: 100%;
  text-align: center;
}

.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: auto;
  margin: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
}

[scope='row'] {
  transform: rotate(90deg);
  white-space: nowrap;
  padding-left: 6ch;
}

tr {
  background-size: 100% 10% !important;
}
</style>
