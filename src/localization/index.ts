import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        nearby: 'Nearby',
        history: 'History',
        riskTest: 'Covid e-Check',
        startTracking: 'Start Tracking',
        stopTracking: 'Stop Tracking',
      },
    },
    gu: {
      translation: {
        nearby: 'નજીકમાં',
        history: 'ભૂતકાળની સૂચિ',
        riskTest: 'કોરોના e-તપાસ',
        startTracking: 'નજીકમાં શોધ કરો',
        stopTracking: 'શોધવાનું બંધ કરો',
      },
    },
    hi: {
      translation: {
        nearby: 'आपके पास',
        history: 'पिछली सूची',
        riskTest: 'कोरोना e-जाँच',
        startTracking: 'खोज शुरू करो',
        stopTracking: 'खोज बंद करो',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
