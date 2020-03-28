import {useTranslation} from 'react-i18next';

export function useTranslatedText(text: string) {
  const {t} = useTranslation();
  return t(text) || text;
}
