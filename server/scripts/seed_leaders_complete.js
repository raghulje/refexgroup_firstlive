require("dotenv").config();
const db = require("../models");
const { Leader, Media } = db;

const leadersData = [
  {
    name: 'Anil Jain',
    title: 'Chairman & Managing Director',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Anil-Jain.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/anil-jain-57864343/',
    description: [
      'Anil Jain is a leading industrialist with a vision to make Refex one of India\'s largest business conglomerates. His entrepreneurial journey began at the age of 19, and since then, he has been leading Refex with passion, dedication, and an unwavering commitment to excellence. As a leader, he believes in empowering his team and fostering a culture of innovation and growth. He is actively involved in the Incubation Centre and Refex Capital, which invests in promising startups, helping to nurture the next generation of entrepreneurs.',
      'Anil Jain has also been instrumental in setting up the angel investment & incubation Center of JITO (Jain International Trade Organization), further demonstrating his commitment to supporting entrepreneurship and innovation. His philanthropic activities extend beyond business, including significant support during the COVID-19 pandemic, where he contributed to various relief efforts to help those in need.',
      'His remarkable growth journey is a testament to his passion, dedication, simplicity, and humility. These core values have not only shaped his leadership style but have also been the foundation of Refex\'s success story, inspiring everyone in the organization to strive for excellence while staying grounded.',
      'Anil Jain has been recognized with several prestigious industrial awards, including the \'Young Entrepreneur by Times Group\', \'The Standard Chartered DUN & BRADSTREET Top 100 SMEs Award\', \'Times of India Trailblazers of Tamil Nadu\', and a Stevie award. These accolades reflect his outstanding contributions to the business world and his commitment to excellence in all endeavors.'
    ]
  },
  {
    name: 'Dinesh Agarwal',
    title: 'Group CEO',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Dinesh-Agarwal.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/dinesh-agarwal-b561a714/',
    description: [
      'Dinesh has over 19 years of experience in Corporate Finance spanning Audit, Financial Accounting and Planning, Tax and Fundraising. He has a natural flair for numbers and his business acumen stands testimony to the phenomenal growth that Refex has experienced under his leadership. He has been associated with Refex Group since 2014 and his contribution to the success of Refex is phenomenal. His experience, expertise and passion for Finance and Accounting functions helped fuel the business and put it on a growth trajectory.',
      'Dinesh has earlier worked in reputed organisations Aircel and Brisk specializing in streamlining internal processes and functions in the finance function. His business acumen in Corporate Finance spanning Audit, Financial Accounting and Planning, Tax and Fundraising has helped raise over 3,000 crores (Equity + Debt) for clients. He also has diverse experience in Solar EPC segments and Utility-scale projects.',
      'He has also consulted for diverse businesses including start-ups, SMEs, established Corporate Houses, and International NGOs. Dinesh has received several industry recognitions for his contribution to management and related areas. Academically he graduated from Sambalpur University and ICAI.'
    ]
  },
  {
    name: 'Purvesh Kapadia',
    title: 'CHRO',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Purvesh-Kapadia.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/purveshkapadia/',
    description: [
      'In a career span of 25+ Years - Purvesh has played multiple strategic pinnacle roles ranging from CHRO-Managing Partner-COO-Director HR etc. Throughout his career he has taken up several challenging assignments and has been instrumental in redefining the HR process for several leading organizations globally. Business process reengineering is his exclusive strength tested and proven in his career span. His innate process-driven approach has helped in achieving double-digit top-line and bottom-line growth for several organizations, he has been associated with. He has worked with several prestigious organizations such as Terex, Intervalve India Ltd, Sheetal Group etc. Purvesh has also spent 10+ years in the IT Education sector.',
      'Academically, he has a Master\'s in Human Resources - Development & Management from Jamnalal Bajaj Institute of Management Studies and a Honours in Systems Management (Information Technology) from National Institute of Information Technology.'
    ]
  },
  {
    name: 'Lalitha Uthayakumar',
    title: 'CEO – Refrigerants',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Lalitha-Uthayakumar.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/lalitha-uthayakumar-79a389122/',
    description: [
      'Lalitha has over 30 years of experience handling accounts and operations. She currently heads the Refrigerants business at Refex. She has been with Refex for 20 years handling several portfolios. She played a major role during the IPO of Refex Industries Limited. An avid accounts professional started with a humble beginning at Refex and climbed the career ladder to the position of CEO to head a business. Her strong analytical skills, penchant for numbers and adept learning of the business domain have fuelled her career ladder and growth in Refex. Right from managing the sales targets, driving her team to perform, ensuring timely delivery of the shipment, and handling the refilling factory, she has managed with ease and demonstrated performance excellence.',
      'Academically, Lalitha has completed her graduation in Commerce and several other certifications pertaining to her domain.'
    ]
  },
  {
    name: 'Srivaths Varadharajan',
    title: 'Group CTO',
    image: 'https://www.refex.group/wp-content/uploads/2025/08/Srivaths.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/srivathsvn/',
    description: [
      'Srivaths Varadharajan is a global CTO|CIO|CDO| COO handling teams across engineering, Information technology, digital products, digital platforms, digital infrastructure, data science, digital marketing and design thinking. He has worked for institutions like Kotak Securities, Reliance, ICICI, Bharti Axa and also created Fintech startups as a founding team. He has over 25 years of experience in the BFSI, telecom, BPO, and airline industries, with a focus on driving Technology, digital, data, design, platforms, digital marketing, information security and PNL targets.',
      'As a global Information technology, Digital products, digital platforms, Data and Design thinking evangelist, he has successfully delivered strategic solutions and innovations using cutting-edge technologies such as ML/AI, blockchain, digital, data and cloud. He has also been recognised as a top CIO 100 honoree and received awards for innovation from CNBC TV18 and Skoch.'
    ]
  },
  {
    name: 'Kalpesh Kumar',
    title: 'CEO – Renewables',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Kalpesh-Kumar.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/kalpesh-kumar-7309917/',
    description: [
      'Kalpesh has 15+ years of experience in the solar and renewables space. A highly knowledgeable and passionate leader who drives a very successful business portfolio. He understands both financial and business metrics very well which helps to lead the business understanding its nuances.  From the initial stages Kalpesh has been responsible for Solar Commercial &Industrial (C&I) business right from strategy to winning the business and to execute and finance. His experience has provided him the expertise to forecast short term and long-term financial needs of the company based on business plan and projects on hand, identify sources and mobilize funds at a low cost. Kalpesh has been the face of RRIL representing in several speaking engagement forums to share this thought leadership. Kalpesh has worked for several leading firms prior to RRIL.',
      'Academically he has completed an Executive Program in Leadership and management, with Indian Institute of Management, Calcutta. He has also completed his Post Graduate Diploma in Business Management from M.S. Ramaiah Institute of Management (MSRIM), Bangalore, specializing in Finance and Marketing.'
    ]
  },
  {
    name: 'Bala M',
    title: 'CEO – 3i Medtech',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Bala-M.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/mbala5/',
    description: [
      'Bala has been in the Medical Devices Industry for 30+ years and been in senior executive positions with global multinational companies such as GE Healthcare and Toshiba.',
      'He is a domain expert in the Diagnostic Imaging business and has held executive positions both in India and APAC region. He was the Region Director APAC region for GE Healthcare based out of Singapore. Bala is the Founder, CEO of Indian Imaging company 3i MedTech and CURA Healthcare. His focus is to expand and grow the business and build a leading Indian brand in Medical Imaging which has a suite of Imaging products from X-ray to MRI including core technologies for the first time in India.',
      'Bala is a thought leader and is part of several healthcare forums and actively participates as a MedTech thought leader in industry forums/ associations like NATHEALTH, AIMED, APMEI and CII. He is an acclaimed leader and has been awarded in multiple Industry forums amongst which the award by Indian Radiology Association for his contribution to Radiology and Imaging over the last 25 years is close to his heart.',
      'Academically Bala is an Electronics engineer from National Institute of Technology.'
    ]
  },
  {
    name: 'Yash Jain',
    title: 'Director – Refex Green Mobility',
    image: 'https://www.refex.group/wp-content/uploads/2025/02/Yash.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/yash-jain-007a8b123/',
    description: [
      'Yash is a sustainability-driven business leader specializing in transitioning from conventional to green energy solutions. As Director at Refex Green Mobility, he leads strategy and business development, focusing on scaling electric mobility solutions for corporates. His expertise lies in accelerating the shift from brown to green energy, ensuring that sustainability is not just an initiative but an operational foundation.',
      'With a background in Marketing Management from Lancaster University, UK, and experience across industries like solar energy, private equity, and F&B, he brings a multidisciplinary approach to business growth. Having worked in both India and the UK, he combines global insights with local execution to drive impact. His approach prioritizes innovation, leveraging AI for problem-solving, and exploring opportunities in new sectors, including sustainable pharmaceuticals.',
      'Beyond business, he contributes to policy advancements, notably playing a role in enabling EV registrations in Tamil Nadu. He frequently speaks at industry forums, advocating for sustainable transformation at scale. His leadership philosophy emphasizes a balance between employee well-being and performance, fostering loyalty-driven growth.',
      'Passionate about creating meaningful change, Yash is committed to building businesses that integrate sustainability from the ground up. His long-term vision is to drive large-scale impact, making sustainability accessible and economically viable, ensuring a better future for both people and the planet.'
    ]
  },
  {
    name: 'Sharat Narasapur',
    title: 'MD & CEO – RLFC',
    image: 'https://www.refex.group/wp-content/uploads/2024/12/Sharath.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/sharat-narasapur/',
    description: [
      'A techno-commercial professional with over 35+ years of experience in the pharma – API/Intermediate & Agrochemical industry in leadership roles. His expertise lies in strategy, operations, and business management, including program management, efficiency enhancement, driving EBITDA growth, business development, and customer interface. Sharat has built sustainable businesses in product and service domains and has been instrumental in forging relationships with big pharma companies across the globe. He leads the RLFC business operations and drives overall operational efficiency and growth plans through business excellence to achieve profitability.  He has worked in companies like Dr. Reddy\'s, Ecologic Chemicals, Aurobindo Pharma, Sequent Scientific etc.',
      'He is a chemical engineer from UDCT Mumbai and has a General Management Leadership certification from IIM Calcutta.'
    ]
  },
  {
    name: 'Meet Goradia',
    title: 'COO – RGML',
    image: 'https://www.refex.group/wp-content/uploads/2024/06/Meet-Goradia.png',
    bio: '',
    linkedinUrl: 'https://www.linkedin.com/in/meetgoradia/',
    description: [
      'Meet has a wealth of extensive experience, progressing from junior levels to leadership positions in diverse fields such as shipping, textile, courier, warehousing, logistics and mobility. His career reflects a strong inclination towards business, consistently managing large, complex operations and P&L responsibilities to ensure financial health and growth.',
      'Meet began his professional journey as a merchant navy sailor, sailing across oceans on large crude oil tankers managing deck side operations. This maritime experience laid a solid foundation for his subsequent career. Driven by a desire to deepen his expertise, Meet pursued a Master of Science in International Logistics and Supply Chain Management from the University of Glamorgan.',
      'His dedication and strategic acumen propelled him up the corporate ladder. Most notably, Meet\'s last role was with a mobility startup, where he served as a consultant COO. Under his leadership, the company achieved remarkable growth, and pivoted its way in the startup EV mobility ecosystem.',
      'Meet\'s dynamic career is a testament to his business acumen, strategic thinking, and ability to drive significant growth across various sectors.'
    ]
  },
  {
    name: 'Tarun Arora',
    title: 'Chief Business Officer',
    image: 'https://www.refex.group/wp-content/uploads/2025/11/Tarun.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Tarun Arora brings nearly two decades of techno-commercial expertise, having advanced from engineering roles to senior leadership positions across industries such as mining, logistics, and heavy industrial operations. His career reflects a deep business acumen—driving large-scale transformations, managing P&L portfolios exceeding ₹2000 crore, and leading cross-functional teams across India.',
      'Tarun began his career as a Graduate Engineer Trainee, gaining hands-on experience in process management and operations. His drive for excellence and strategic insight led him to senior roles at Vedanta Group, including Business Head, Director – Commercial, and Chief Commercial Officer, where he led large-scale initiatives in logistics, procurement, and process optimization to enhance efficiency and profitability. He oversaw large-scale coal logistics operations worth over ₹1000 crore, driving efficiency, growth, and operational excellence across India.',
      'A graduate in Chemical Engineering from Thapar Institute of Engineering & Technology, Tarun further honed his leadership capabilities through an Executive MBA from S.P. Jain Institute of Management and Research (SPJIMR).'
    ]
  },
  {
    name: 'Vishesh Mehta',
    title: 'Head – Business Development',
    image: 'https://www.refex.group/wp-content/uploads/2025/11/Vishesh-group.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Dynamic business leader with 17+ years of cross-industry experience spanning operations, business development, and end-to-end project execution across power markets, real estate, industrial operations, and project management. Well-versed in regulatory engagement, client acquisition, market expansion, and managing large-scale operational workflows, including significant experience in the power sector.',
      'Proven ability to lead diverse portfolios ranging from incubation centre development and residential construction to restaurant setups, film production, and multi-state business development for the fly ash division. Brings a strong blend of strategic thinking and on-ground execution, consistently delivering operational efficiency and business growth.',
      'Holds a Bachelor\'s degree in Mechanical Engineering from Anna University, supported by a strong academic foundation from premier institutions in Chennai. Recognised for a hands-on leadership style, execution-driven mindset, and a sharp ability to convert ideas into scalable, sustainable outcomes.'
    ]
  },
  {
    name: 'Gautam Jain',
    title: 'Head – Investor Relations',
    image: 'https://www.refex.group/wp-content/uploads/2025/11/Gautam_Jain.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Gautam is a strategic thinker with over 20 years of experience in various functions, predominantly in Investor Relations and Strategy roles.',
      'He has rich experience in all the IR-related activities viz. fund raising (IPO, QIPs, Rights, PE, etc), NDRs, managing sell-side analysts, representing to fund managers, analyst meets and concalls, etc.',
      'In addition to the power and infrastructure sector, he has gained valuable exposure in various industries, viz. wood panel, EPC, Agri-warehousing, Coal mining, Real Estate, etc.',
      'Academically, he has done an MBA (Finance) from ICFAI Business School, Bangalore in 2004.'
    ]
  },
  {
    name: 'Kruta Valecha',
    title: 'Head – COE (OD & L&D)',
    image: 'https://www.refex.group/wp-content/uploads/2024/08/Kruta_COE.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Kruta is an HR and learning professional with over a decade of experience in delivering bespoke talent solutions across the employee lifecycle. Throughout her career, she has consciously chosen roles that enable her to create organizational value through codifying talent, leadership aspiration, and competence in alignment organization\'s culture, capability requirement and strategy.',
      'Her functional expertise lies in competency management and integration, high potential and leadership development, curriculum design and delivery of learning experiences, curating new joiner experiences and business immersion for senior leaders, coaching and mentoring, careers management, and culture building.',
      'She holds a Masters in Social Work from Madras School of Social Work and a PG Diploma in Human Resources Management from Symbiosis Centre of Distance Learning. She has also been certified as a Senior Certified Professional from SHRM (January 2018 – April 2024). Her zest for continuous learning has enabled her to secure multiple certifications in the space of Learning and Development and OD which include: Talent Management certification for executive development from XLRI and she has recently been certified as a Certified Learning Professional from Brandon Hall. She is also currently working towards getting her Associate Coach Certification from the International Coaching Federation.',
      'She has worked with multiple organizations to build robust people practices and talent management solutions into the social fabric of the company. She has worked across various industries with some fine brands like TATA Consultancy Services, Accenture, Syntel, AGS Health and Sundaram Finance.'
    ]
  },
  {
    name: 'Srividya.N',
    title: 'Head – Corporate Communications',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Srividya.N.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Srividya is an extremely goal-oriented communication professional with over 20 years of work experience in various leading organizations.  She is highly experienced in internal and external communication, social media, digital marketing and event management. Whether it is an analyst report or a marketing document, she is the go-to person. Srividya has also led diversity and inclusion and CSR initiatives in her career. She is very passionate about D&I, whether strategy or implementation and strives to make a difference to society. She has won several D&I awards and recognition for the various initiatives that she implemented. She has also been the head of the POSH committee. She has been recognized as a \'star performer\' several times and has led award-winning teams. Her strengths include process definition and project management and has been highly acclaimed for the same. She has worked for highly reputed organizations such as Satyam, UST, Accenture, AGS Health etc.',
      'Academically she has completed her Masters in Public Administration and post-graduation in Digital Marketing from Mudra Institute of Communications, Ahmedabad.'
    ]
  },
  {
    name: 'Jagdish Jain',
    title: 'Business Head – Ash & Coal Handling',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Jagdish-Jain.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Jagdish has over 20 years of experience in handling multiple businesses. Starting a business career at a very young age he has honed his business skills through his journey to now head the Ash and Coal business for Refex. His vast experience includes domains such as Steel, Construction, Transport, Refrigerants etc. where he proved his prowess as an entrepreneur. He is fuelled by his passion and drive to achieve his business goals. His key strengths include liaising, negotiation and fleet & transport management. He manages the thermal or power plants to ensure seamless functioning and is always in pursuit of expanding his business.',
      'Academically, a Commerce graduate by education and has been recognized with multiple industry recognitions.'
    ]
  },
  {
    name: 'Gagan Bihari Pattnaik',
    title: 'Head – ESG & Sustainability',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Gagan-Bihari-Pattnaik.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Gagan is a chartered environmentalist and sustainability professional (IEMA, UK, SEP-USGBC, USA) and a certified ESG analyst (CESGA®, EFFAS, Germany) with over 18 years of international experience. His assignments include geographies such as India, USA, and the Middle East in Sustainability and ESG domain in the setting and driving Corporate Sustainability/ESG Strategies leading to performance excellence. In a nutshell, his professional expertise',
      'includes but is not limited to Decarbonization Strategy and Net Zero Goal, Climate Change and Adaptation, Built Sustainability (LEED), Energy Conservation, Audit, Sustainability Assurance & Verification, Circularity of Material, Water Stewardship, ESG Indices, and Matrices, ESG Performance',
      'Disclosure (BRSR, GRI, IIRC, TCFD, and CDP framework), CSR Project Implementation, Stakeholder Engagement, and Biodiversity Conservation program.',
      'Academically Gagan is an M.Tech in Civil-Environmental Engineering, Distinction (UPTU, India, 2004). He also holds a Diploma in ESG Analysis (EFFAS, Germany), Certificate in Corporate Sustainability (NYU Stern, USA) and a Certificate in CSR (IICA, Ministry of Corporate Affairs, India)'
    ]
  },
  {
    name: 'Harini.S',
    title: 'Head – Legal',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Harini.S.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Harini comes with over 17 years of experience in handling and addressing corporate legal and commercial matters and litigations.  She has worked with esteemed organizations like HCL Technologies Limited, Siva Group, Tattva Group (part of India Cements Group) apart from her association with the law office of M/s. Satish Parasaran at Chennai.',
      'At Refex, as a General Counsel, she handles Contracts review and management, IPR Management, Litigation management, Mergers & Acquisitions, Corporate Governance and compliances, Disputes Resolution etc. She also heads the POSH committee. ',
      'Academically Harini is a qualified Commerce and Law graduate.  She is a certified M&A Professional – Legal & Business Strategies from Indian Academy of Law & Management, New Delhi.'
    ]
  },
  {
    name: 'Sahil Singla',
    title: 'Head – Corporate Finance',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Sahil-Singla.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Sahil has over 19 years of experience in fundraising across sectors and has cumulatively raised more than USD 5 BN from Banks/FIs/Private Equity etc.  He has a unique blend of technical, financial and legal domain knowledge which sets him apart.  ',
      'His expertise is Project Structuring/Advisory, Equity Investments & Divestments, Financial Modelling, Business Analysis, Negotiations & Regulatory/Policy Advocacy. He has demonstrated experience in spearheading strategic initiatives and managing large key accounts.',
      'In his earlier stints he has worked for various reputed organisations like JP Morgan, IL&FS Financial Services, SREI Infrastructure, PTC India Limited etc.',
      'Sahil has completed his MBA in Finance from IMT Ghaziabad and his Bachelors in Legal Science from Government law college, Mumbai and a University topper in Law.'
    ]
  },
  {
    name: 'Sonal Jain',
    title: 'Head – Accounts',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Sonal-Jain.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Sonal is an accomplished Chartered Accountant with excellent knowledge of financial reporting and accounting, having over 19 years\' of experience in Manufacturing and service industry including Transmission, Solar and EPC.',
      'He has expertise in disclosure of information in financial reporting of the listed entities and evaluation of the Internal financial controls for the business and design and implementation of the internal controls in order to mitigate the financial risks. He has worked with numerous listed entities and has released quarterly/annual results of listed entity as per the requirement of SEBI/LODR.',
      'In his past, he has led the "Cost Reduction Team" for KEC International Limited, Jabalpur plant and was able to reduce the conversion cost of the plant by 25% over a period of 5 years. He was a member of various Capex/Opex Negotiation committees and was able to make substantial savings.  He is an expert in identifying revenue leakages and ways of fixing the same. ',
      'Academically he graduated from Rani Durgavati University, Jabalpur and is a Fellow Member of ICAI. '
    ]
  },
  {
    name: 'Ankit Poddar',
    title: 'Head – Corporate Secretarial',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Ankit-Poddar.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Ankit has more than twelve years of experience in the Corporate Governance function. He is responsible for ensuring compliance with corporate and securities laws and corporate governance stipulations across Refex Group. His core area of expertise and operations has been statutory compliances, governance, corporate restructuring, corporate codes and policies, compliance management, investor relations, and all aspects of corporate secretarial function.',
      'Prior to Refex, he was associated with Sterlite Power (Vedanta Group Company) and his earlier stint was with Hindusthan Urban Infrastructure Limited and NGP Industries Limited. Academically, he is a Commerce (Hons.) Graduate from the University of Delhi and Law Graduate from Meerut University. He is an Associate Member of the Institute of Company Secretaries of India. Ankit has also completed an executive program in Compliance Management from the Indian School of Business.'
    ]
  },
  {
    name: 'Suhail Shariff',
    title: 'Head – Administration & Facility',
    image: 'https://www.refex.group/wp-content/uploads/2023/10/Suhail_VP.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Suhail has over 23 years of Facility Management experience including Asset Management, Project Management, Security Services, Transitions and Change Management. A very goal-oriented leader, Suhail focuses on creating an enhanced customer experience through effective facility management solutions and has contributed to accomplishing critical FM transitions across India and global clients (APAC, EMEA  & America Regions). He has previously worked for esteemed organizations such as CB Richard Ellis, Cushman & Wakefield, and Jones Lang Lasalle.',
      'Academically, Suhail holds a Commerce degree with a Certification in Leadership Programme issued by the Project Management Institute.'
    ]
  },
  {
    name: 'Sandeep Mishra',
    title: 'VP – Chief of Staff International Business',
    image: 'https://www.refex.group/wp-content/uploads/2024/05/Sandeep_VP_COS.png?t=1764401442',
    bio: '',
    linkedinUrl: '',
    description: [
      'Sandeep Mishra brings 18 years of diverse experience across India, the Middle East, and Africa. He has held senior roles in consulting, corporate strategy, mega capital project management, and new investments within industries such as Oil & Gas, Renewable energy, Metals and Mining, and chemicals.',
      'Previously, he has worked with renowned organizations including Chemaf Resources Ltd DMCC, Reliance Industries (E&P-CBM and KGD-06), Areva (India) Renewable, Larsen & Toubro Ltd, and Velosi (India).',
      'Academically, Sandeep is a B. Tech (Mechanical Engineering), holds a CEPM-Project Management certification from IIT Delhi, an MBA from IIM Indore, and has completed a one-year Business Leadership Program (LEAD) at Stanford Graduate School of Business.',
      'He is a member of the International Association of Engineers (IAEng), The Internet Society (Delhi Chapter), and the Harvard Business Review Advisory Council. Additionally, he serves as an Expert Mentor for both Mahindra University School of Business and Management and the Stanford GSB Startup Accelerator LISA for Cohort 8.'
    ]
  },
  {
    name: 'Susmitha Siripurapu',
    title: 'Chief of Staff – Refrigerant gases & Thermal',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Susmitha-Siripurapu.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Susmitha is an accomplished Strategy and Program Management professional. She holds a Bachelors in Engineering degree from Osmania University with a specialization in Computer science. Post which, she worked in Consulting verticals with the BIG 4\'s and helped large, multinational corporates optimize and digitalize the lease administration and accounting processes in their capital projects, optimize their facilities, and re-size their real estate portfolios. After 3 years of Consulting exposure, she pursued her Master\'s in Business Administration from HEC Paris and Duke University. Ever since, she has been working in strategy roles and gained hands-on experience in developing data-driven strategic and managerial initiatives and ensuring timely and within-budget implementations. She possesses a demonstrated record in building strong leadership networks, collaborating across countries, and enabling high-performance operating models/teams across diversified industry verticals. She has proven to be adept at leveraging analytics for decision-making, formulating strategies for growth, improving efficiency in operations, and developing advanced reporting structures.',
      'Academically completed an MBA from HEC Paris &  Duke University.'
    ]
  },
  {
    name: 'Sachin Navtosh Jha',
    title: 'Chief of Staff – Green Mobility, Power Trading, & VC',
    image: 'https://www.refex.group/wp-content/uploads/2023/02/Sachin-Navtosh-Jha.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Sachin has over 7 years of experience across areas of consulting and general management. His eye for detail, inquisitiveness and delivery excellence are noteworthy. Some of his notable engagements have been while working with the senior bureaucrats of some State Governments and Central Government ministries in their advisory teams where he was involved in drafting strategy roadmaps for their key initiatives, as well as in the capacity of project management consultant in some implementation projects whose project cost were to the tune of several crores. He has also worked in reputed companies such as KPMG and EY India. At Refex Group, he works in the MD\'s office where he works alongside the business team of Medtech, power trading, and venture capital investing apart from driving other industry-agnostic key strategic initiatives including opportunities for mergers & acquisitions. ',
      'Academically, Sachin is an engineer from Kalyani Government Engineering College (West Bengal) and has an MBA from IIM Lucknow. '
    ]
  },
  {
    name: 'Maharshi Maitra',
    title: 'Chief of Staff – Airports & Transportation, Pharma',
    image: 'https://www.refex.group/wp-content/uploads/2023/03/Maharshi-Maitra.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Maharshi brings with him 10 years of multi-functional and cross-geographic experience across Pharma, Oil & Gas and Management Consulting. He is the Chief of Staff for RLFC and Refex Airports & Transportation. In his previous roles, he managed consulting projects to optimize Go-To-Market strategy, led pharmaceutical product development & commercialization and steered business continuity and market opportunity assessment programs. Maharshi excels in people management and creative troubleshooting with excellent business results. He has worked for reputed companies such as Dr.Reddy\'s, Biocon and Bain & Company in various roles. ',
      'Academically, Maharshi holds a postgraduate degree in Chemical Engineering from IIT Madras and an MBA from IIM Calcutta.'
    ]
  },
  {
    name: 'Saravanan Vasanth',
    title: 'Chief of Staff – MedTech & Renewables',
    image: 'https://www.refex.group/wp-content/uploads/2023/08/Saravanan_COS.png',
    bio: '',
    linkedinUrl: '',
    description: [
      'Saravanan has 11 years of experience in corporate development and strategic planning roles across the Sports, Media, Entertainment, and Manufacturing sectors. He is a chief of staff for MedTech. In his previous roles, he has managed auction strategy for an IPL franchise and ran an incubation business end-to-end. Saravanan specializes in shaping new strategic initiatives to unlock value-creation opportunities. He has worked with reputed organizations such as Times Group and Grundfos.',
      'Academically, Saravanan is an engineer from Madras Institute of Technology (MIT) and has an MBA from IIM Rohtak.'
    ]
  }
];

async function seedLeaders() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established.');

    console.log('Starting to seed leaders...');

    for (let i = 0; i < leadersData.length; i++) {
      const leaderData = leadersData[i];
      
      // Convert description array to bio string
      const bio = leaderData.description && leaderData.description.length > 0
        ? leaderData.description.join(' ')
        : leaderData.bio || '';

      // Prepare leader data
      const leaderPayload = {
        name: leaderData.name,
        position: leaderData.title,
        bio: bio,
        linkedinUrl: leaderData.linkedinUrl || '',
        orderIndex: i,
        isActive: true,
        category: leaderData.title.toLowerCase().includes('ceo') || leaderData.title.toLowerCase().includes('cto') || leaderData.title.toLowerCase().includes('chro') || leaderData.title.toLowerCase().includes('cbo') || leaderData.title.toLowerCase().includes('md') || leaderData.title.toLowerCase().includes('director') ? 'executive' : 'business'
      };

      // Find or create leader
      const [leader, created] = await Leader.findOrCreate({
        where: {
          name: leaderData.name,
          position: leaderData.title
        },
        defaults: leaderPayload
      });

      // If leader exists, update it
      if (!created) {
        await leader.update(leaderPayload);
        console.log(`✅ Updated leader: ${leaderData.name}`);
      } else {
        console.log(`✅ Created leader: ${leaderData.name}`);
      }

      // Handle image - create or find Media record with external URL
      if (leaderData.image) {
        const [media, mediaCreated] = await Media.findOrCreate({
          where: {
            filePath: leaderData.image
          },
          defaults: {
            fileName: leaderData.image.split('/').pop() || `${leaderData.name.replace(/\s+/g, '-')}.png`,
            filePath: leaderData.image,
            fileType: 'image',
            mimeType: 'image/png',
            fileSize: 0,
            url: leaderData.image
          }
        });

        // Update leader with imageId
        await leader.update({ imageId: media.id });
        
        if (mediaCreated) {
          console.log(`  📷 Created media record for: ${leaderData.name}`);
        }
      }
    }

    console.log(`\n✅ Successfully seeded ${leadersData.length} leaders!`);
  } catch (error) {
    console.error('❌ Error seeding leaders:', error);
    throw error;
  } finally {
    await db.sequelize.close();
  }
}

// Run the seeder
seedLeaders();

