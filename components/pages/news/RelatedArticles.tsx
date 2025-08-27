import { type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import { getCollectionItemUrl, getPageUrl } from '@/lib/url-utils';
import routes from '@/content/routes.json';

interface RelatedArticlesProps {
  locale: Locale;
  translations: string[];
}

export default function RelatedArticles({ locale, translations }: RelatedArticlesProps) {
  if (!translations || !Array.isArray(translations) || translations.length === 0) {
    return null;
  }

  const sectionTitle = locale === 'lt' ? 'Susiję Straipsniai' :
                      locale === 'pl' ? 'Powiązane Artykuły' :
                      locale === 'uk' ? 'Пов\'язані Статті' :
                      'Related Articles';


  // Mock related articles for development
  const mockRelatedArticles = [
    {
      title: locale === 'lt' ? 'Kaip Dažnai Reguliuoti Langus?' :
             locale === 'pl' ? 'Jak Często Regulować Okna?' :
             locale === 'uk' ? 'Як Часто Регулювати Вікна?' :
             'How Often Should You Adjust Your Windows?',
      slug: locale === 'lt' ? 'kaip-daznai-reguliuoti-langus' :
            locale === 'pl' ? 'jak-czesto-regulowac-okna' :
            locale === 'uk' ? 'yak-chasto-regulyuvaty-vikna' :
            'how-often-adjust-windows-seasonal-guide',
      category: 'seasonal'
    },
    {
      title: locale === 'lt' ? 'Žiemos Langų Priežiūra' :
             locale === 'pl' ? 'Zimowa Pielęgnacja Okien' :
             locale === 'uk' ? 'Зимовий Догляд за Вікнами' :
             'Winter Window Care Guide',
      slug: locale === 'lt' ? 'ziemos-langu-prieziura' :
            locale === 'pl' ? 'zimowa-pielegnacja-okien' :
            locale === 'uk' ? 'zymovyy-doglyad-za-viknamy' :
            'winter-window-care-cold-weather-protection',
      category: 'seasonal'
    },
    {
      title: locale === 'lt' ? 'Energijos Taupymo Patarimai' :
             locale === 'pl' ? 'Wskazówki Oszczędzania Energii' :
             locale === 'uk' ? 'Поради з Економії Енергії' :
             'Energy Efficient Window Maintenance',
      slug: locale === 'lt' ? 'energijos-taupymo-patarimai' :
            locale === 'pl' ? 'wskazowki-oszczedzania-energii' :
            locale === 'uk' ? 'porady-z-ekonomiyi-energiyi' :
            'energy-efficient-window-maintenance-tips',
      category: 'energy'
    }
  ];

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, Record<Locale, string>> = {
      maintenance: {
        en: 'Maintenance',
        lt: 'Priežiūra',
        pl: 'Pielęgnacja',
        uk: 'Догляд'
      },
      seasonal: {
        en: 'Seasonal',
        lt: 'Sezoninė',
        pl: 'Sezonowa',
        uk: 'Сезонний'
      },
      diy: {
        en: 'DIY',
        lt: 'Pasidaryk Pats',
        pl: 'Zrób to Sam',
        uk: 'Зроби Сам'
      },
      energy: {
        en: 'Energy',
        lt: 'Energija',
        pl: 'Energia',
        uk: 'Енергія'
      }
    };
    return categoryMap[category]?.[locale] || category;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h1 text-secondary text-center mb-12">
            {sectionTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRelatedArticles.slice(0, 3).map((article, index) => (
              <article
                key={index}
                className="bg-neutral-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="mb-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {getCategoryName(article.category)}
                  </span>
                </div>
                
                <h3 className="text-h3 text-secondary mb-3 group-hover:text-primary transition-colors duration-200">
                  {article.title}
                </h3>
                
                <Link href={getCollectionItemUrl('news', article.slug, locale, routes)}>
                  <Button variant="outline-red" size="sm" className="w-full">
                    {locale === 'lt' ? 'Skaityti' :
                     locale === 'pl' ? 'Czytaj' :
                     locale === 'uk' ? 'Читати' :
                     'Read Article'}
                    <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href={getPageUrl('news', locale, routes)}>
              <Button variant="outline" size="lg">
                {locale === 'lt' ? 'Visi Straipsniai' :
                 locale === 'pl' ? 'Wszystkie Artykuły' :
                 locale === 'uk' ? 'Всі Статті' :
                 'View All Articles'}
                <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
