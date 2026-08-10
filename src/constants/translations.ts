export type Language = 'en' | 'pl';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Atmosphere',
    appSubtitle: 'Multi-Model Weather Consensus',
    searchPlaceholder: 'Search city (e.g. Tokyo, London, Berlin, New York)...',
    gpsButton: 'GPS',
    matchingCities: 'Matching Cities',
    recentSearches: 'Recent Searches',
    clear: 'clear',
    noMatchingCity: 'No matching city found for "{query}". Try checking the spelling.',
    favorites: 'Favorites:',
    favoritesLabel: 'Favorites:',
    favoriteLocations: 'Favorite Locations',
    addLocation: 'Search city to add',
    pinCity: 'Pin {name}',
    pinLocation: 'Pin {name}',
    aggregatedModels: '8 Models Aggregated',
    modelsAggregated: '8 Models Aggregated',
    modelSpread: 'Model Spread',
    agreement: 'Agreement',
    agreementScore: 'Agreement Score',
    rainChance: 'Rain Chance',
    windSpeed: 'Wind Speed',
    windAndDirection: 'Wind & Direction',
    windDirection: 'Wind Direction',
    viewWind: 'Wind',
    legendWindSpeed: 'Wind Speed',
    avgWindLabel: 'Avg Wind',
    humidity: 'Humidity',
    consensus: 'Consensus',
    consensusLabel: 'Consensus',
    consensusHigh: 'High Model Consensus',
    consensusModerate: 'Moderate Spread',
    consensusDivergent: 'High Divergence',
    feelsLike: 'Feels like',
    individualReadings: 'Individual Model Readings',
    individualModelReadings: 'Individual Model Readings',
    exactConsensus: 'Exact Consensus',
    warmer: 'warmer',
    cooler: 'cooler',
    removeFromFavorites: 'Remove from favorites',
    saveToFavorites: 'Save to favorites',
    refreshData: 'Refresh forecast data',
    
    // Hourly Graph
    graphTitle: 'Hourly Forecast & Multi-Service Aggregation',
    graphSubtitle: 'Hourly temperature trends (°{unit}), rainfall probabilities, and wind vectors aggregated from 8 global weather models.',
    hourlyTitle: 'Hourly Forecast & Multi-Service Aggregation',
    hourlySubtitle: 'Hourly temperature trends ({unit}), rainfall probabilities, and wind vectors aggregated from 8 global weather models.',
    range24h: '24 Hours',
    range48h: '48 Hours',
    range72h: '72 Hours',
    range7d: '7 Days',
    hours24: '24 Hours',
    hours48: '48 Hours',
    hours72: '72 Hours',
    days7: '7 Days',
    viewCombined: 'Combined',
    viewConsensusBand: 'Consensus Band',
    viewAllProviders: 'All Providers',
    viewRainfallPct: 'Rainfall %',
    combined: 'Combined',
    consensusBand: 'Consensus Band',
    allProviders: 'All Providers',
    rainfallPct: 'Rainfall %',
    filterServices: 'Filter Services:',
    legendRainProb: 'Rain Prob (%)',
    legendConsensusTemp: 'Consensus Temp',
    legendModelVariance: 'Model Variance Band (Min-Max)',
    legendAggregatedAvg: 'Aggregated Avg',
    legendRainfallProb: 'Aggregated Rainfall Probability (%)',
    consensusTemp: 'Consensus Temp ({unit})',
    modelVarianceBand: 'Model Variance Band (Min-Max)',
    aggregatedAvg: 'Aggregated Avg ({unit})',
    rainProbPct: 'Rain Prob (%)',
    avgTempLabel: 'Avg Temp',
    rainProbLabel: 'Rain Probability',
    avgRainAmount: 'Avg Rain Amount (mm)',
    rainAmountLabel: 'Rain Amount',
    hourlyDetails: 'Hourly Details',
    hourLabel: 'Hour',
    temperatureLabel: 'Temp',
    weatherLabel: 'Weather',
    expandDetails: 'Expand',
    collapseDetails: 'Collapse',
    providerComparison: 'Provider Comparison',
    tempRainHead: 'Temp / Rain',
    proTip: 'Pro-Tip: Hover over any point on the graph to inspect individual temperature, rainfall, and wind readings from ECMWF, GFS, UKMO, ICON, GEM, JMA, MET Norway, and Météo-France side-by-side.',
    
    // AI Card
    aiCardTitle: 'AI Consensus & Weather Intelligence',
    aiCardSubtitle: 'Synthesized model analysis for {location}',
    aiTitle: 'AI Consensus & Weather Intelligence',
    aiSubtitle: 'Synthesized model analysis for {location}',
    agreementSuffix: 'Agreement',
    highAgreement: 'High Agreement',
    moderateAgreement: 'Moderate Agreement',
    lowDivergence: 'Low Divergence',
    keyTakeaways: 'Key Model Takeaways',
    whatToWear: 'What to Wear',
    
    // Daily Outlook
    dailyOutlookTitle: '7-Day Aggregated Daily Outlook',
    dailyOutlookSubtitle: 'Consensus daily high/low temperatures & rain chances.',
    dailyTitle: '7-Day Aggregated Daily Outlook',
    dailySubtitle: 'Consensus daily high/low temperatures & rain chances.',
    today: 'Today',
    
    // Comparison Cards
    serviceComparisonTitle: 'Service-by-Service Forecast Comparison',
    serviceComparisonSubtitle: 'Compare real-time predictions from 8 major global meteorological organizations.',
    serviceComparison: 'Service-by-Service Forecast Comparison',
    consensusAvg: 'Consensus Avg:',
    
    // Status & System
    errorTitle: 'Forecast Retrieval Error',
    retrievalError: 'Forecast Retrieval Error',
    retry: 'Retry',
    loadingTitle: 'Aggregating Global Forecast Models...',
    loadingSubtitle: 'Synthesizing ECMWF, GFS, UKMO, ICON, GEM, JMA, MET Norway, and Météo-France predictions',
    loadingModels: 'Aggregating Global Forecast Models...',
    dataProvidedBy: 'Data provided by',
    
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  pl: {
    appTitle: 'Atmosphere',
    appSubtitle: 'Agregator Prognoz Wielomodelowych',
    searchPlaceholder: 'Szukaj miasta (np. Warszawa, Londyn, Tokio, Nowy Jork)...',
    gpsButton: 'GPS',
    matchingCities: 'Znalezione Miasta',
    recentSearches: 'Ostatnio Szukane',
    clear: 'wyczyść',
    noMatchingCity: 'Nie znaleziono miasta dla "{query}". Sprawdź pisownię.',
    favorites: 'Ulubione:',
    favoritesLabel: 'Ulubione:',
    favoriteLocations: 'Ulubione Lokalizacje',
    addLocation: 'Szukaj miasta do dodania',
    pinCity: 'Przypnij {name}',
    pinLocation: 'Przypnij {name}',
    aggregatedModels: 'Agregacja 8 Modeli',
    modelsAggregated: 'Agregacja 8 Modeli',
    modelSpread: 'Rozrzut Modeli',
    agreement: 'Zgodność Modeli',
    agreementScore: 'Wskaźnik Zgodności',
    rainChance: 'Szansa na Deszcz',
    windSpeed: 'Prędkość Wiatru',
    windAndDirection: 'Wiatr i Kierunek',
    windDirection: 'Kierunek Wiatru',
    viewWind: 'Wiatr',
    legendWindSpeed: 'Prędkość Wiatru',
    avgWindLabel: 'Śr. Wiatr',
    humidity: 'Wilgotność',
    consensus: 'Konsensus',
    consensusLabel: 'Konsensus',
    consensusHigh: 'Wysoki Konsensus Modeli',
    consensusModerate: 'Umiarkowany Rozrzut',
    consensusDivergent: 'Duża Rozbieżność Modeli',
    feelsLike: 'Odczuwalna',
    individualReadings: 'Odczyty Poszczególnych Modeli',
    individualModelReadings: 'Odczyty Poszczególnych Modeli',
    exactConsensus: 'Pełny Konsensus',
    warmer: 'cieplej',
    cooler: 'chłodniej',
    removeFromFavorites: 'Usuń z ulubionych',
    saveToFavorites: 'Zapisz do ulubionych',
    refreshData: 'Odśwież dane prognozy',
    
    // Hourly Graph
    graphTitle: 'Godzinowa Prognoza i Agregacja Usług',
    graphSubtitle: 'Godzinowe trendy temperatury (°{unit}), opady i wiatr zagregowane z 8 modeli globalnych.',
    hourlyTitle: 'Godzinowa Prognoza i Agregacja Usług',
    hourlySubtitle: 'Godzinowe trendy temperatury ({unit}), opady i wiatr zagregowane z 8 modeli globalnych.',
    range24h: '24 Godziny',
    range48h: '48 Godzin',
    range72h: '72 Godziny',
    range7d: '7 Dni',
    hours24: '24 Godziny',
    hours48: '48 Godzin',
    hours72: '72 Godziny',
    days7: '7 Dni',
    viewCombined: 'Połączony',
    viewConsensusBand: 'Pasmo Konsensusu',
    viewAllProviders: 'Wszyscy Dostawcy',
    viewRainfallPct: 'Opady %',
    combined: 'Połączony',
    consensusBand: 'Pasmo Konsensusu',
    allProviders: 'Wszyscy Dostawcy',
    rainfallPct: 'Opady %',
    filterServices: 'Filtruj Usługi:',
    legendRainProb: 'Szansa Opadów (%)',
    legendConsensusTemp: 'Temp. Konsensusu',
    legendModelVariance: 'Pasmo Wariancji Modeli (Min-Maks)',
    legendAggregatedAvg: 'Średnia Zagregowana',
    legendRainfallProb: 'Zagregowane Prawdopodobieństwo Opadów (%)',
    consensusTemp: 'Temp. Konsensusu ({unit})',
    modelVarianceBand: 'Pasmo Wariancji Modeli (Min-Maks)',
    aggregatedAvg: 'Średnia Zagregowana ({unit})',
    rainProbPct: 'Szansa Opadów (%)',
    avgTempLabel: 'Śr. Temp.',
    rainProbLabel: 'Prawdopodobieństwo Opadów',
    avgRainAmount: 'Śr. Ilość Opadów (mm)',
    rainAmountLabel: 'Ilość Opadów',
    hourlyDetails: 'Szczegóły Godzinowe',
    hourLabel: 'Godzina',
    temperatureLabel: 'Temp.',
    weatherLabel: 'Pogoda',
    expandDetails: 'Rozwiń',
    collapseDetails: 'Zwiń',
    providerComparison: 'Porównanie Dostawców',
    tempRainHead: 'Temp / Opady',
    proTip: 'Wskazówka: Najedź na dowolny punkt wykresu, aby porównać indywidualne odczyty z ECMWF, GFS, UKMO, ICON, GEM, JMA, MET Norway i Météo-France.',
    
    // AI Card
    aiCardTitle: 'Konsensus AI i Inteligencja Pogodowa',
    aiCardSubtitle: 'Synteza analityczna modeli dla lokalizacji {location}',
    aiTitle: 'Konsensus AI i Inteligencja Pogodowa',
    aiSubtitle: 'Synteza analityczna modeli dla lokalizacji {location}',
    agreementSuffix: 'Zgodność',
    highAgreement: 'Wysoka Zgodność',
    moderateAgreement: 'Umiarkowana Zgodność',
    lowDivergence: 'Niska Rozbieżność',
    keyTakeaways: 'Kluczowe Wnioski z Modeli',
    whatToWear: 'Jak się Ubrać',
    
    // Daily Outlook
    dailyOutlookTitle: '7-Dniowa Zagregowana Prognoza',
    dailyOutlookSubtitle: 'Konsensus temperatur maksymalnych/minimalnych oraz szans na opady.',
    dailyTitle: '7-Dniowa Zagregowana Prognoza',
    dailySubtitle: 'Konsensus temperatur maksymalnych/minimalnych oraz szans na opady.',
    today: 'Dzisiaj',
    
    // Comparison Cards
    serviceComparisonTitle: 'Porównanie Prognoz wg Usług',
    serviceComparisonSubtitle: 'Porównaj prognozy w czasie rzeczywistym z 8 głównych organizacji meteorologicznych.',
    serviceComparison: 'Porównanie Prognoz wg Usług',
    consensusAvg: 'Średnia Konsensusu:',
    
    // Status & System
    errorTitle: 'Błąd Pobierania Prognozy',
    retrievalError: 'Błąd Pobierania Prognozy',
    retry: 'Ponów',
    loadingTitle: 'Agregowanie Globalnych Modeli Pogodowych...',
    loadingSubtitle: 'Syntetyzowanie prognoz ECMWF, GFS, UKMO, ICON, GEM, JMA, MET Norway i Météo-France',
    loadingModels: 'Agregowanie Globalnych Modeli Pogodowych...',
    dataProvidedBy: 'Dane dostarczone przez',
    
    days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
    dayNamesShort: ['Nie', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
  },
};

export function getWmoWeatherDescription(code: number, lang: Language = 'en'): string {
  if (lang === 'pl') {
    switch (code) {
      case 0: return 'Bezchmurnie';
      case 1: return 'Prawie bezchmurnie';
      case 2: return 'Częściowe zachmurzenie';
      case 3: return 'Całkowite zachmurzenie';
      case 45:
      case 48: return 'Mgła';
      case 51:
      case 53:
      case 55: return 'Mżawka';
      case 56:
      case 57: return 'Marznąca mżawka';
      case 61: return 'Lekki deszcz';
      case 63: return 'Umiarkowany deszcz';
      case 65: return 'Intensywny deszcz';
      case 66:
      case 67: return 'Marznący deszcz';
      case 71: return 'Słabe opady śniegu';
      case 73: return 'Umiarkowany śnieg';
      case 75: return 'Intensywny śnieg';
      case 77: return 'Ziarna śnieżne';
      case 80:
      case 81:
      case 82: return 'Przelotne opady deszczu';
      case 85:
      case 86: return 'Przelotny śnieg';
      case 95: return 'Burza';
      case 96:
      case 99: return 'Burza z gradem';
      default: return 'Zmienna pogoda';
    }
  }

  switch (code) {
    case 0: return 'Clear sky';
    case 1: return 'Mainly clear';
    case 2: return 'Partly cloudy';
    case 3: return 'Overcast';
    case 45:
    case 48: return 'Foggy';
    case 51:
    case 53:
    case 55: return 'Drizzle';
    case 56:
    case 57: return 'Freezing Drizzle';
    case 61: return 'Slight Rain';
    case 63: return 'Moderate Rain';
    case 65: return 'Heavy Rain';
    case 66:
    case 67: return 'Freezing Rain';
    case 71: return 'Slight Snow';
    case 73: return 'Moderate Snow';
    case 75: return 'Heavy Snow';
    case 77: return 'Snow grains';
    case 80:
    case 81:
    case 82: return 'Rain showers';
    case 85:
    case 86: return 'Snow showers';
    case 95: return 'Thunderstorm';
    case 96:
    case 99: return 'Thunderstorm with hail';
    default: return 'Variable weather';
  }
}
