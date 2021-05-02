const getData = (stateId, cohort, minDate, maxDate) => {
  const stateModifier = `%20AND%20IdBundesland%20%3D%20${stateId}`
  const dateModifier = `Meldedatum%20%3E%3D%20TIMESTAMP%20'${minDate}%2000%3A00%3A00'%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20'${maxDate}%2000%3A00%3A00'`
  const cohortsModifier = `%20AND%20Altersgruppe%20%3D%20'${cohort}'`
  const url = `
	https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?
		where=
			${dateModifier}
			${stateModifier}
			${cohortsModifier}&
		objectIds=&
		time=&
		resultType=standard&
		outFields=AnzahlFall,MeldeDatum,IdBundesland,Altersgruppe&
		returnIdsOnly=false&
		returnUniqueIdsOnly=false&
		returnCountOnly=false&
		returnDistinctValues=false&
		cacheHint=false&
		orderByFields=IdBundesland&
		groupByFieldsForStatistics=IdBundesland&
		outStatistics=&
		having=&
		resultOffset=&
		resultRecordCount=&
		sqlFormat=none&
		f=json&
		token=
	`.replaceAll(/[\s\n]/g, '')

  console.log('fetching data from', url)

  return fetch(url)
}

const processData = (data) => {
  const culmulativeCases = data.features
    .map((x) => x.attributes.AnzahlFall)
    .reduce((x, y) => x + y)

  const casesByDate = []

  data.features.forEach((x) => {
    const date = new Date(x.attributes.Meldedatum)
      .toLocaleString()
      .split(',')
      .shift()

    if (casesByDate.some((x) => x.date === date)) {
      const key = Object.keys(casesByDate).find(
        (key) => casesByDate[key].date === date
      )
      casesByDate[key].cases = casesByDate[key].cases + x.attributes.AnzahlFall
    } else {
      casesByDate.push({
        date,
        cases: x.attributes.AnzahlFall,
      })
    }
  })

  return {
    sum: culmulativeCases,
    byDate: casesByDate,
  }
}

export const getRkiData = async (stateId, cohort, minDate, maxDate) => {
  let chartData = {}

  await getData(stateId, cohort, minDate, maxDate)
    .then((response) => response.json())
    .then((data) => {
      chartData = processData(data)
    })

  return chartData
}
