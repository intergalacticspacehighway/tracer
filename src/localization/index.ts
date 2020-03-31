import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        nearby: 'Nearby',
        history: 'History',
        riskTest: 'Covid e-Check',
        startTracking: 'Start',
        stopTracking: 'Stop',
        shareThisApp: 'Share this app',
      },
    },
    gu: {
      translation: {
        nearby: 'નજીકમાં',
        history: 'ભૂતકાળની સૂચિ',
        riskTest: 'કોરોના e-તપાસ',
        startTracking: 'શરૂ કરો',
        stopTracking: 'બંધ કરો',
        shareThisApp: 'આ એપ્લિકેશન શેર કરો',
      },
    },
    hi: {
      translation: {
        nearby: 'आपके पास',
        history: 'पिछली सूची',
        riskTest: 'कोरोना e-जाँच',
        startTracking: 'शुरू करो',
        stopTracking: 'बंद करो',
        shareThisApp: 'इस एप को शेयर कीजिए',
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
