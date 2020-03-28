import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        nearby: 'Nearby',
        history: 'History',
        riskTest: 'Covid Test',
      },
    },
    gu: {
      translation: {
        nearby: 'તમારા નજીકમાં',
        history: 'ભૂતકાળ',
        riskTest: 'કોરોના તપાસ',
      },
    },
    hi: {
      translation: {
        nearby: 'તમારા નજીકમાં',
        history: 'अतीत',
        riskTest: 'कोरोना जाँच',
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
