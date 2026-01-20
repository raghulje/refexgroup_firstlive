import { Link } from 'react-router-dom';
import { trackButtonClick } from '../../../utils/ga4';

interface CTASectionProps {
  sectionData?: any;
  cards?: any[];
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function CTASection({ sectionData: _sectionData, cards = [], getSectionContent: _getSectionContent }: CTASectionProps) {
  // Fallback values matches Homepage fallback but adjusted for Diversity props structure if needed, 
  // though typically we use the passed props.
  const fallbackCards = [
    { title: 'Got a question?', buttonText: 'Get in touch', buttonLink: '/contact' },
    { title: 'See our latest news', buttonText: 'Refex Newsroom', buttonLink: '/newsroom' },
    { title: 'Work at Refex', buttonText: 'Careers', buttonLink: '/careers' }
  ];

  const cardsToShow = cards.length > 0 ? cards : fallbackCards;

  return (
    <section className="py-[27px] md:py-[34px] bg-green-50">
      <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
        <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]" style={{ backgroundColor: '#3b9dd6' }}>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {cardsToShow.map((card: any, index: number) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay={(index + 1) * 100}
                data-aos-easing="ease-out-cubic"
              >
                <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{card.title}</h3>
                <Link
                  to={card.buttonLink || '#'}
                  onClick={() => trackButtonClick(card.buttonText, 'diversity-page-cta', card.buttonLink)}
                  className="inline-block border-2 border-white bg-transparent text-white px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-nowrap cursor-pointer text-sm md:text-base"
                  data-ga-track="button"
                  data-ga-label={card.buttonText}
                  data-ga-location="diversity-page-cta"
                >
                  {card.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
