import { vi } from 'vitest';
import { render, screen } from '@/test-utils';
import { MainFooter } from '../MainFooter';

// The svg assets are the boundary, not the component: happy-dom cannot parse
// their inlined markup (see the layout tests).
vi.mock('@your-org/ui-lib/icons/social/github.svg', () => ({
  default: () => null,
}));

vi.mock('@/public/images/layout/footer-waves.svg', () => ({
  default: () => null,
}));

// next-i18next resolves to a different module instance than react-i18next under
// vitest, so the app test providers never reach this component: feed it a real
// i18next instance built from the shipped locale files instead.
vi.mock('next-i18next', async () => {
  const { createInstance } = await import('i18next');
  const en = await import('@your-org/common-i18n/locales/en/navigation.json');
  const instance = createInstance();
  await instance.init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['navigation'],
    defaultNS: 'navigation',
    resources: { en: { navigation: en.default } },
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return {
    i18n: instance,
    useTranslation: () => ({
      t: instance.getFixedT(null, ['navigation']),
    }),
  };
});

describe('main footer tests', () => {
  it('should render a pricing link', () => {
    render(<MainFooter />);
    const pricingLink = screen.getByRole('link', { name: 'Pricing' });
    expect(pricingLink).toHaveAttribute('href', '#');
  });
});
