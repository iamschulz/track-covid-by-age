<template>
  <div class="container">
    <div class="controls">
      <p>
        <label for="state">Bundesland</label>
        <select id="state" v-model="stateId" name="state" @change="getData">
          <option v-for="state in states" :key="state.id" :value="state.id">
            {{ state.name }}
          </option>
        </select>
      </p>

      <p>
        <label for="cohort">Altersgruppe</label>
        <select id="cohort" v-model="cohort" name="cohort" @change="getData">
          <option value="A00-A04">0 bis 4 Jahre</option>
          <option value="A05-A14">5 bis 14 Jahre</option>
          <option value="A15-A34">15 bis 34 Jahre</option>
          <option value="A35-A59">35 bis 59 Jahre</option>
          <option value="A60-A79">60 bis 79 Jahre</option>
          <option value="A80%2B">80 und älter</option>
        </select>
      </p>

      <p>
        Startdatum:
        <label for="startDay">Tag</label>
        <input
          id="startDay"
          v-model="startDay"
          type="number"
          name="startDay"
          min="1"
          max="31"
          @change="getData"
        />
        <label for="startMonth">Monat</label>
        <select
          id="startMonth"
          v-model="startMonth"
          name="startMonth"
          @change="getData"
        >
          <option value="1">Januar</option>
          <option value="2">Februar</option>
          <option value="3">März</option>
          <option value="4">April</option>
          <option value="5">Mai</option>
          <option value="6">Juni</option>
          <option value="7">Juli</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">Oktober</option>
          <option value="11">November</option>
          <option value="12">Dezember</option>
        </select>
        <label for="startYear">Jahr</label>
        <select
          id="startYear"
          v-model="startYear"
          name="startYear"
          @change="getData"
        >
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
      </p>

      <p>
        Enddatum:
        <label for="endDay">Tag</label>
        <input
          id="startDay"
          v-model="endDay"
          type="number"
          name="endDay"
          min="1"
          max="31"
          @change="getData"
        />
        <label for="endMonth">Monat</label>
        <select
          id="endMonth"
          v-model="endMonth"
          name="endMonth"
          @change="getData"
        >
          <option value="1">Januar</option>
          <option value="2">Februar</option>
          <option value="3">März</option>
          <option value="4">April</option>
          <option value="5">Mai</option>
          <option value="6">Juni</option>
          <option value="7">Juli</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">Oktober</option>
          <option value="11">November</option>
          <option value="12">Dezember</option>
        </select>
        <label for="endYear">Jahr</label>
        <select id="endYear" v-model="endYear" name="endYear" @change="getData">
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
      </p>
    </div>

    <Chart v-if="dataByDate" :data="dataByDate" />

    <footer>
      <p>
        Datenstand vom
        <a
          href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0"
          >RKI Covid-19 Datenhub</a
        >
      </p>
      <p>
        Code zu dieser Darstellung auf
        <a href="https://github.com/iamschulz/track-covid-by-age">GitHub</a>
      </p>
      <p>
        Tech: <a href="https://nuxtjs.org/">Nuxt</a>,
        <a href="https://chartscss.org/">Charts.css</a>
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { getRkiData } from '@/static/rkiApiClient'
import states from '@/static/states.json'
import Chart from '@/components/Chart.vue'

interface Datapoint {
  date: string
  cases: number
}

export default defineComponent({
  components: {
    Chart,
  },
  setup() {
    const stateId = ref(2)
    const cohort = ref('A00-A04')
    const lastWeekDate = new Date(Date.now() - 2629800000)
    const startDay = ref(lastWeekDate.getDate())
    const startMonth = ref(lastWeekDate.getMonth() + 1)
    const startYear = ref(lastWeekDate.getFullYear())
    const endDay = ref(new Date().getDate())
    const endMonth = ref(new Date().getMonth() + 1)
    const endYear = ref(new Date().getFullYear())
    const dataByDate = ref<Datapoint[] | null>(null)

    const getData = () => {
      if (!cohort.value || !stateId.value) {
        return
      }

      getRkiData(
        stateId.value,
        cohort.value,
        `${startYear.value}-${startMonth.value}-${startDay.value}`,
        `${endYear.value}-${endMonth.value}-${endDay.value}`
      ).then((data: any) => {
        dataByDate.value = data!.byDate as Datapoint[]
      })
    }

    getData()

    return {
      stateId,
      cohort,
      getData,
      startDay,
      startMonth,
      startYear,
      endDay,
      endMonth,
      endYear,
      states,
      dataByDate,
    }
  },
})
</script>

<style lang="scss">
.container {
  display: grid;
  gap: 3rem;
}

.controls {
  padding: 1rem;

  > * + * {
    margin-top: 1rem;
  }
}

footer {
  padding: 8rem 1rem 1rem;
}
</style>
