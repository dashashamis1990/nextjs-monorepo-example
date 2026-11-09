import { i18n } from 'next-i18next';
import { vi } from 'vitest';
import { render, screen, within } from '@/test-utils';
import { demoConfig } from '@/features/demo/demo.config';
import { homeConfig } from '@/features/home/home.config';
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
// i18next instance built from the shipped locale files instead. Only the
// namespaces a page loads are available here, as they are in the app under
// strictMode: a component asking for another one gets the raw key back.
vi.mock('next-i18next', async () => {
  const { createInstance } = await import('i18next');
  const [en, fr] = await Promise.all([
    import('@your-org/common-i18n/locales/en/navigation.json'),
    import('@your-org/common-i18n/locales/fr/navigation.json'),
  ]);
  const instance = createInstance();
  await instance.init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['navigation'],
    defaultNS: 'navigation',
    resources: {
      en: { navigation: en.default },
      fr: { navigation: fr.default },
    },
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return {
    i18n: instance,
    useTranslation: (ns: 'navigation' = 'navigation') => ({
      t: instance.getFixedT(null, [ns]),
    }),
  };
});

describe('main footer tests', () => {
  // The locale is shared by the whole file: leave it as the app's default one.
  afterEach(async () => {
    await i18n?.changeLanguage('en');
  });

  it('should render a pricing link beside the github one', () => {
    render(<MainFooter />);

    const links = within(screen.getByRole('navigation')).getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      'href',
      'https://github.com/belgattitude/nextjs-monorepo-example'
    );
    expect(links[1]).toHaveAttribute('href', '#');
    expect(links[1]).toHaveTextContent('Pricing');
  });

  it('should translate the pricing label with the active locale', async () => {
    await i18n?.changeLanguage('fr');

    render(<MainFooter />);

    expect(screen.getByRole('link', { name: 'Tarifs' })).toHaveAttribute(
      'href',
      '#'
    );
  });

  // The label lives in the navigation namespace, so every page rendering this
  // footer has to load it or the link shows its raw key.
  it('should load the navigation namespace on the pages rendering the footer', () => {
    expect(homeConfig.i18nNamespaces).toContain('navigation');
    expect(demoConfig.i18nNamespaces).toContain('navigation');
  });
});
