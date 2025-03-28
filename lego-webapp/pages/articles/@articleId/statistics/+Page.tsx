import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import Analytics from '~/components/Analytics';
import { useParams } from '~/utils/useParams';

const ArticleStatistics = () => {
  const { articleId } = useParams<{ articleId: string }>();

  return (
    <Page
      title="Statistikk"
      back={{
        href: `/articles/${articleId}`,
      }}
    >
      <Helmet title={'Artikkel statistikk'} />
      <Analytics entity="article" id={articleId} />
    </Page>
  );
};

export default ArticleStatistics;
