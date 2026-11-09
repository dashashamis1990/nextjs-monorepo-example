import styled from '@emotion/styled';
import GithubIcon from '@your-org/ui-lib/icons/social/github.svg';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';
import FooterWaves from '@/public/images/layout/footer-waves.svg';

const BgWaved = styled(FooterWaves)`
  //background-size: cover;
  object-fit: cover;
  position: absolute;
  width: 100%;
  object-position: center;
  display: block;
`;

const FooterCtn = styled.footer`
  display: grid;
  .content,
  .bgImage {
    grid-area: 1 / 1;
  }
  .bgImage {
    z-index: -1;
  }
`;

export const MainFooter: FC = () => {
  const { t } = useTranslation('navigation');

  return (
    <FooterCtn>
      <div className={'bgImage'}>
        <BgWaved />
      </div>
      <nav className={'content flex items-start gap-6'}>
        <a
          href={'https://github.com/belgattitude/nextjs-monorepo-example'}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          <GithubIcon />
        </a>
        <a
          href={'#'}
          className={
            'text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline'
          }
        >
          {t('footer.pricing')}
        </a>
      </nav>
    </FooterCtn>
  );
};
