/* eslint-disable no-await-in-loop */
const { sequelize, Page, Section, SectionContent, ESGPolicy, Media } = require('../models');

async function seedESGPageCMS() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Get or create ESG page
    const [esgPage] = await Page.findOrCreate({
      where: { slug: 'esg' },
      defaults: {
        slug: 'esg',
        title: 'ESG',
        status: 'published',
        templateType: 'esg'
      }
    });
    console.log('ESG page ID:', esgPage.id);

    // Create or find media entries
    const mediaFiles = [
      { fileName: 'ESG-Banner.jpg', filePath: '/wp-content/uploads/2023/02/ESG-Banner.jpg', altText: 'ESG Banner' },
      { fileName: 'ESG-Images-REFEX-9.jpg', filePath: '/wp-content/uploads/2023/02/ESG-Images-REFEX-9.jpg', altText: 'ESG Intro Image' },
      { fileName: 'REFEX-Logo@2x-8-1.png', filePath: '/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png', altText: 'Refex Logo' },
      { fileName: 'dot-pattern.png', filePath: '/assets/esg/dot-pattern.png', altText: 'Dot Pattern' },
      { fileName: 'environment.jpg', filePath: '/assets/esg/environment.jpg', altText: 'Environment' },
      { fileName: 'health-safety.jpg', filePath: '/assets/esg/health-safety.jpg', altText: 'Health & Safety' },
      { fileName: 'csr.jpg', filePath: '/assets/esg/csr.jpg', altText: 'Corporate Social Responsibility' },
      { fileName: 'ESG-Images-REFEX2.jpg', filePath: '/wp-content/uploads/2023/02/ESG-Images-REFEX2.jpg', altText: 'Environment Tab Image' },
      { fileName: 'ESG-Images-REFEX6.jpg', filePath: '/wp-content/uploads/2023/02/ESG-Images-REFEX6.jpg', altText: 'Health & Safety Tab Image' },
      { fileName: 'ESG-Images-REFEX7.jpg', filePath: '/wp-content/uploads/2023/02/ESG-Images-REFEX7.jpg', altText: 'CSR Tab Image' },
      { fileName: 'SDG-Image-Hero-Large1.jpeg', filePath: '/wp-content/uploads/2023/02/SDG-Image-Hero-Large1.jpeg', altText: 'SDG Hero Image' },
      { fileName: 'customercentricapproach.svg', filePath: '/assets/svg/esg/customercentricapproach.svg', altText: 'Customer-centric approach icon' },
      { fileName: 'Exemplaryleadership.svg', filePath: '/assets/svg/esg/Exemplaryleadership.svg', altText: 'Exemplary leadership icon' },
      { fileName: 'EthicalConduct.svg', filePath: '/assets/svg/esg/EthicalConduct.svg', altText: 'Ethical Conduct icon' },
      { fileName: 'Fairness.svg', filePath: '/assets/svg/esg/Fairness.svg', altText: 'Fairness icon' },
      { fileName: 'Excellence.svg', filePath: '/assets/svg/esg/Excellence.svg', altText: 'Excellence icon' }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: mediaFile.fileName.endsWith('.svg') ? 'image' : 'image',
          altText: mediaFile.altText,
          url: mediaFile.filePath
        }
      });
      mediaMap[mediaFile.fileName] = media;
      console.log(`Media created/found: ${mediaFile.fileName} (ID: ${media.id})`);
    }

    // --- HERO SECTION ---
    console.log('Seeding Hero Section...');
    const [heroSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'hero'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'hero',
        sectionKey: 'hero',
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBackgroundMedia = mediaMap['ESG-Banner.jpg'];
    const heroContent = [
      { 
        sectionId: heroSection.id, 
        contentKey: 'title', 
        contentValue: 'ESG', 
        contentType: 'text' 
      },
      { 
        sectionId: heroSection.id, 
        contentKey: 'subtitle', 
        contentValue: 'At Refex, we\'re constantly changing from the inside to change the world outside. Learn how our business strives to make a difference.', 
        contentType: 'text' 
      }
    ];

    if (heroBackgroundMedia) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'backgroundImage',
        contentValue: heroBackgroundMedia.filePath,
        contentType: 'text',
        mediaId: heroBackgroundMedia.id
      });
    }

    for (const content of heroContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Hero Section seeded');

    // --- INTRO SECTION ---
    console.log('Seeding Intro Section...');
    const [introSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'intro'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'intro',
        orderIndex: 1,
        isActive: true
      }
    });

    const introImageMedia = mediaMap['ESG-Images-REFEX-9.jpg'];
    const introLogoMedia = mediaMap['REFEX-Logo@2x-8-1.png'];
    const introContent = [
      {
        sectionId: introSection.id,
        contentKey: 'heading',
        contentValue: 'At Refex Group, we believe in creating a better world through sustainable business practices. We prioritize People, Planet, and Profit equally and are committed to becoming an ESG champion and carbon-neutral company.',
        contentType: 'text'
      },
      {
        sectionId: introSection.id,
        contentKey: 'description',
        contentValue: 'By aligning with the United Nations Sustainable Development Goals, we are taking action towards a brighter future. We invite you to join hands with Refex Group in our efforts towards sustainability and make a positive impact on the world!',
        contentType: 'text'
      }
    ];

    if (introImageMedia) {
      introContent.push({
        sectionId: introSection.id,
        contentKey: 'image',
        contentValue: introImageMedia.filePath,
        contentType: 'text',
        mediaId: introImageMedia.id
      });
    }

    if (introLogoMedia) {
      introContent.push({
        sectionId: introSection.id,
        contentKey: 'logo',
        contentValue: introLogoMedia.filePath,
        contentType: 'text',
        mediaId: introLogoMedia.id
      });
    }

    for (const content of introContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Intro Section seeded');

    // --- CHAMPIONING CHANGE SECTION ---
    console.log('Seeding Championing Change Section...');
    const [championingSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'championing-change'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'championing-change',
        orderIndex: 2,
        isActive: true
      }
    });

    const patternMedia = mediaMap['dot-pattern.png'];
    const championingContent = [
      {
        sectionId: championingSection.id,
        contentKey: 'title',
        contentValue: 'Championing for Change',
        contentType: 'text'
      },
      {
        sectionId: championingSection.id,
        contentKey: 'description',
        contentValue: 'We take our responsibility to the planet and society seriously, and we strive to be a force for good in everything we do. Our commitment to making a positive impact is reflected in our approach to corporate social responsibility, and we work tirelessly to create a better future for generations to come. Join us in our mission to make a meaningful difference in the world.',
        contentType: 'text'
      },
      {
        sectionId: championingSection.id,
        contentKey: 'backgroundColor',
        contentValue: '#7DC144',
        contentType: 'text'
      },
      {
        sectionId: championingSection.id,
        contentKey: 'textColor',
        contentValue: 'white',
        contentType: 'text'
      }
    ];

    if (patternMedia) {
      championingContent.push({
        sectionId: championingSection.id,
        contentKey: 'backgroundPattern',
        contentValue: patternMedia.filePath,
        contentType: 'text',
        mediaId: patternMedia.id
      });
    }

    for (const content of championingContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Championing Change Section seeded');

    // --- THREE PILLARS SECTION ---
    console.log('Seeding Three Pillars Section...');
    const [pillarsSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'three-pillars'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'three-pillars',
        orderIndex: 3,
        isActive: true
      }
    });

    const envImageMedia = mediaMap['environment.jpg'];
    const healthImageMedia = mediaMap['health-safety.jpg'];
    const csrImageMedia = mediaMap['csr.jpg'];

    const pillars = [
      {
        title: 'Environment',
        description: 'At Refex, we\'re deeply committed to protecting the planet. We use eco-friendly technology, conserve precious resources, and restore ecosystems to make a positive impact. Join us in creating a better world for all!',
        image: envImageMedia ? envImageMedia.filePath : '/assets/esg/environment.jpg',
        order: 1
      },
      {
        title: 'Health & Safety',
        description: 'At Refex, safety is our #1 priority with mission zero harm. We\'re committed to providing a safe workplace for all, including employees, visitors, and workers, and we\'re proud of our perfect record with zero fatalities and disabilities!',
        image: healthImageMedia ? healthImageMedia.filePath : '/assets/esg/health-safety.jpg',
        order: 2
      },
      {
        title: 'Corporate Social Responsibility',
        description: 'We\'re committed to creating social value and making a positive impact in the lives of marginalized groups through our CSR activities. Our guiding principles of transparency and accountability ensure that we\'re making a real difference.',
        image: csrImageMedia ? csrImageMedia.filePath : '/assets/esg/csr.jpg',
        order: 3
      }
    ];

    const pillarsContent = {
      sectionId: pillarsSection.id,
      contentKey: 'pillars',
      contentValue: JSON.stringify(pillars),
      contentType: 'json'
    };

    await SectionContent.findOrCreate({
      where: {
        sectionId: pillarsContent.sectionId,
        contentKey: pillarsContent.contentKey
      },
      defaults: pillarsContent
    });
    console.log('✅ Three Pillars Section seeded');

    // --- POLICIES SECTION ---
    console.log('Seeding Policies Section...');
    const [policiesSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'policies'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'policies',
        orderIndex: 4,
        isActive: true
      }
    });

    const policiesContent = [
      {
        sectionId: policiesSection.id,
        contentKey: 'heading',
        contentValue: 'ESG Policies',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'qualityPolicyTitle',
        contentValue: 'Quality Policy',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'qualityPolicyUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2023/03/Quality-Policy.pdf',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'ehsPolicyTitle',
        contentValue: 'EHS Policy',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'ehsPolicyUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2023/03/EHS-Policy.pdf',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'sustainabilityPolicyTitle',
        contentValue: 'Sustainability Policy',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'sustainabilityPolicyUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2023/03/Sustainability-ESG-Policy.pdf',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'otherPoliciesHeading',
        contentValue: 'Other Policies',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'grievancePolicyTitle',
        contentValue: 'Grievance Policy',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'grievancePolicyUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2023/02/Grievance-Policy.pdf',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'abacPolicyTitle',
        contentValue: 'Signed ABAC Policy',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'abacPolicyUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2025/06/Anti-Bribery-Anti-Corruption-ABAC-Policy.pdf',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'vendorCodeTitle',
        contentValue: 'Signed Supplier Vendor Code of Conduct',
        contentType: 'text'
      },
      {
        sectionId: policiesSection.id,
        contentKey: 'vendorCodeUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2025/06/Vendor-Code-of-Conduct.pdf',
        contentType: 'text'
      }
    ];

    for (const content of policiesContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Policies Section seeded');

    // --- TABS SECTION ---
    console.log('Seeding Tabs Section...');
    const [tabsSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'tabs'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'tabs',
        orderIndex: 5,
        isActive: true
      }
    });

    const envTabImageMedia = mediaMap['ESG-Images-REFEX2.jpg'];
    const healthTabImageMedia = mediaMap['ESG-Images-REFEX6.jpg'];
    const csrTabImageMedia = mediaMap['ESG-Images-REFEX7.jpg'];

    const tabs = [
      {
        tabId: 'environment',
        title: 'Environment Policies',
        description: 'At Refex, we\'re committed to safeguarding our planet\'s natural resources through strategic policies and a robust environmental management system. We prioritize eco-friendly technologies in all of our operations, and constantly strive to make our businesses more sustainable. We\'re passionate about conserving resources, reducing carbon emissions, conserving water, and restoring ecosystems to their natural states.',
        image: envTabImageMedia ? envTabImageMedia.filePath : '/wp-content/uploads/2023/02/ESG-Images-REFEX2.jpg',
        items: [
          {
            title: 'Renewable Energy',
            description: 'Our renewable energy business aims to provide affordable solar energy to private and government agencies, and we have established our solar foothold in the Himalayas with our prestigious client BSF.'
          },
          {
            title: 'Waste Management & Material Circularity',
            description: 'Refex provides eco-friendly disposal and management of coal ash for thermal power plants, establishing a robust business network of manufacturers, contractors, and abandoned mine owners to maximize recycling in an environmentally-friendly way.'
          },
          {
            title: 'Ecosystem Restoration and Plantation Drive',
            description: 'We prioritize biodiversity conservation and ecosystem restoration through plantation drives, barren land rehabilitation, and agro-farming practices, initiating a program "Plant for the Future" to plant and nurture 100,000 saplings over the next 10 years.'
          },
          {
            title: 'Water Stewardship',
            description: 'We aim to be water positive by 2030 by reducing freshwater demand through recycling, rainwater harvesting, and ground recharge at our sites and facility offices, prioritizing wise and judicious use of water resources.'
          }
        ]
      },
      {
        tabId: 'health',
        title: 'Health & Safety',
        description: 'We\'re dedicated to achieving mission zero harm, prioritizing a safe workplace and the physical and mental well-being of our entire workforce. Our Occupational Health and Safety Management System (OHSMS) adheres to ISO 45001:2018, and we\'re proud to report zero fatalities or permanent disabilities to date.',
        image: healthTabImageMedia ? healthTabImageMedia.filePath : '/wp-content/uploads/2023/02/ESG-Images-REFEX6.jpg',
        items: [
          {
            title: 'Vamika',
            description: 'Refex has established an internal networking forum called \'Vamika\' to provide physical, mental and career wellness support to women, including safety needs addressed through self-defense workshops and a "Wellness Work-from-Home policy".'
          },
          {
            title: 'Mental Health Awareness',
            description: 'Refex recognizes the importance of mental health and has initiated a program of mental health awareness for its employees through regular sessions with mental wellness experts.'
          },
          {
            title: 'Basic Health Surveillance',
            description: 'Refex has implemented regular basic health screening for its staff and workers engaged in high-risk activities to identify and manage workplace-related incidents caused by poor health conditions.'
          },
          {
            title: 'Safety Training',
            description: 'Regular safety training programs and drills are conducted to ensure all employees are well-prepared to handle emergency situations and maintain a safe working environment.'
          }
        ]
      },
      {
        tabId: 'csr',
        title: 'Corporate Social Responsibility',
        description: 'At Refex, we believe in creating social value by giving back to the community. Our CSR activities are managed with the highest transparency, oversight, and impact assessment, focusing on four thematic areas. We strive for a sustainable business model connected with society to contribute to the underprivileged and marginalized sections.',
        image: csrTabImageMedia ? csrTabImageMedia.filePath : '/wp-content/uploads/2023/02/ESG-Images-REFEX7.jpg',
        items: [
          {
            title: 'Water and Sanitation',
            description: 'Providing potable water through "Nirmal Jal" program and maintaining water supply network to ensure clean water access for communities.'
          },
          {
            title: 'Ecosystem Restoration',
            description: 'Planting 100,000 trees, rehabilitating abandoned mines, and offering land and water for crop cultivation to support sustainable agriculture.'
          },
          {
            title: 'Child Education and Skill Training',
            description: 'Donating refurbished laptops and providing computer literacy to local school children to enhance their educational opportunities.'
          },
          {
            title: 'Primary Healthcare',
            description: '3i MedTech offers affordable medical diagnosis and imaging services using frugal innovation and portable technology for underserved communities.'
          }
        ]
      }
    ];

    const tabsContent = {
      sectionId: tabsSection.id,
      contentKey: 'tabs',
      contentValue: JSON.stringify(tabs),
      contentType: 'json'
    };

    await SectionContent.findOrCreate({
      where: {
        sectionId: tabsContent.sectionId,
        contentKey: tabsContent.contentKey
      },
      defaults: tabsContent
    });
    console.log('✅ Tabs Section seeded');

    // --- SUSTAINABILITY REPORT SECTION ---
    console.log('Seeding Sustainability Report Section...');
    const [sustainabilityReportSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'sustainability-report'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'sustainability-report',
        orderIndex: 6,
        isActive: true
      }
    });

    const reportBackgroundMedia = mediaMap['ESG-Banner.jpg'];
    const sustainabilityReportContent = [
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'sustainabilityReportTitle',
        contentValue: 'Sustainability Report',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'sustainabilityReportButtonText',
        contentValue: 'Refex Sustainability Report FY2023-24',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'sustainabilityReportUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2025/01/Sustainability-Report-2023-24.pdf',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'dashboardTitle',
        contentValue: 'ESG Performance Dashboard',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'dashboardButtonText',
        contentValue: 'ESG Performance Dashboard',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'dashboardUrl',
        contentValue: 'https://www.refex.group/wp-content/uploads/2025/01/ESG-Performance-Dashboard.pdf',
        contentType: 'text'
      },
      {
        sectionId: sustainabilityReportSection.id,
        contentKey: 'overlayColor',
        contentValue: '#2d5234',
        contentType: 'text'
      }
    ];

    if (reportBackgroundMedia) {
      sustainabilityReportContent.push({
        sectionId: sustainabilityReportSection.id,
        contentKey: 'backgroundImage',
        contentValue: reportBackgroundMedia.filePath,
        contentType: 'text',
        mediaId: reportBackgroundMedia.id
      });
    }

    for (const content of sustainabilityReportContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Sustainability Report Section seeded');

    // --- SDG SECTION ---
    console.log('Seeding SDG Section...');
    const [sdgSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'sdg'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'sdg',
        orderIndex: 7,
        isActive: true
      }
    });

    const sdgImageMedia = mediaMap['SDG-Image-Hero-Large1.jpeg'];
    const sdgContent = [
      {
        sectionId: sdgSection.id,
        contentKey: 'heading',
        contentValue: 'Sustainable Development Goals',
        contentType: 'text'
      },
      {
        sectionId: sdgSection.id,
        contentKey: 'description1',
        contentValue: 'We\'re all about making the world a better place! We\'re committed to working with India and the UN to achieve United Nations Sustainable Development Goals, because we know that together we can make a big difference. We\'re not just focused on making our shareholders happy – we\'re all about creating value for everyone involved, including the planet!',
        contentType: 'text'
      },
      {
        sectionId: sdgSection.id,
        contentKey: 'description2',
        contentValue: 'We\'re so proud to be a member of UNGC and to be working with partners around the world to make the world a better place. We\'re all about ethical business practices and doing our part to solve some of the biggest challenges of our time. Let\'s make the world a better place, together!',
        contentType: 'text'
      },
      {
        sectionId: sdgSection.id,
        contentKey: 'backgroundColor',
        contentValue: '#7cb342',
        contentType: 'text'
      }
    ];

    if (sdgImageMedia) {
      sdgContent.push({
        sectionId: sdgSection.id,
        contentKey: 'image',
        contentValue: sdgImageMedia.filePath,
        contentType: 'text',
        mediaId: sdgImageMedia.id
      });
    }

    for (const content of sdgContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ SDG Section seeded');

    // --- GOVERNANCE SECTION ---
    console.log('Seeding Governance Section...');
    const [governanceSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'governance'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'governance',
        orderIndex: 8,
        isActive: true
      }
    });

    const customerCentricIcon = mediaMap['customercentricapproach.svg'];
    const exemplaryLeadershipIcon = mediaMap['Exemplaryleadership.svg'];
    const ethicalConductIcon = mediaMap['EthicalConduct.svg'];
    const fairnessIcon = mediaMap['Fairness.svg'];
    const excellenceIcon = mediaMap['Excellence.svg'];

    const coreValues = [
      {
        title: 'Customer-centric approach',
        description: 'Prioritizing the needs of customers and consistently working towards exceeding their expectations.',
        icon: customerCentricIcon ? customerCentricIcon.filePath : '/assets/svg/esg/customercentricapproach.svg'
      },
      {
        title: 'Exemplary leadership',
        description: 'Leading by example, exhibiting the desired behaviors and setting a positive standard for others to emulate.',
        icon: exemplaryLeadershipIcon ? exemplaryLeadershipIcon.filePath : '/assets/svg/esg/Exemplaryleadership.svg'
      },
      {
        title: 'Ethical Conduct',
        description: 'Upholding the highest standards of honesty and transparency in all business dealings, and adhering to a strict code of ethics.',
        icon: ethicalConductIcon ? ethicalConductIcon.filePath : '/assets/svg/esg/EthicalConduct.svg'
      },
      {
        title: 'Fairness',
        description: 'Practicing equality and treating all individuals and stakeholders with fairness and justice in all business dealings and decision-making processes.',
        icon: fairnessIcon ? fairnessIcon.filePath : '/assets/svg/esg/Fairness.svg'
      },
      {
        title: 'Excellence',
        description: 'A continuous effort to attain the highest level of quality and proficiency in every sphere of business activities.',
        icon: excellenceIcon ? excellenceIcon.filePath : '/assets/svg/esg/Excellence.svg'
      }
    ];

    const governanceContent = [
      {
        sectionId: governanceSection.id,
        contentKey: 'heading',
        contentValue: 'Governance',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'description',
        contentValue: 'Our corporate governance culture is rock solid, with strong risk resilience and a value creation model that can\'t be beat. We\'re all about inclusivity, with policies and procedures that are comprehensive and robust, and we\'ve got a monitoring and grievance mechanism that really works. Join us in our mission to make the world a better place!',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'quote',
        contentValue: 'The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'quoteAuthor',
        contentValue: 'Lady Bird Johnson.',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'missionTitle',
        contentValue: 'Our Mission',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'missionDescription',
        contentValue: 'We will strive to attain our goals by exceeding the needs & expectations of our customers with continuous improvements in quality, productivity, value creation, new product & service offerings and customer satisfaction. Refex Group is dedicated to offering highest quality products & services to our customers while achieving acceptable returns on investments.',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'visionTitle',
        contentValue: 'Our Vision',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'visionDescription',
        contentValue: 'To be the most preferred company; committed to seeking growth and prosperity by achieving a sustainable competitive share – globally; using innovative solutions, technology and a team of good people. It is our intent to develop quality partnerships with our shareholders, employees, suppliers, partners, customers and the community in which we operate.',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'coreValuesHeading',
        contentValue: 'Our Core Values',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'coreValuesSubtitle',
        contentValue: 'Refex\'s core values have always been the foundation of our guiding principles.',
        contentType: 'text'
      },
      {
        sectionId: governanceSection.id,
        contentKey: 'coreValues',
        contentValue: JSON.stringify(coreValues),
        contentType: 'json'
      }
    ];

    for (const content of governanceContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Governance Section seeded');

    // --- CTA SECTION ---
    console.log('Seeding CTA Section...');
    const [ctaSection] = await Section.findOrCreate({
      where: {
        pageId: esgPage.id,
        sectionKey: 'cta'
      },
      defaults: {
        pageId: esgPage.id,
        sectionType: 'content',
        sectionKey: 'cta',
        orderIndex: 9,
        isActive: true
      }
    });

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: 'questionTitle',
        contentValue: 'Got a question?',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'questionButtonText',
        contentValue: 'Get in touch',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'questionButtonLink',
        contentValue: '/contact',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'newsTitle',
        contentValue: 'See our latest news',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'newsButtonText',
        contentValue: 'Refex Newsroom',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'newsButtonLink',
        contentValue: '/newsroom',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'careersTitle',
        contentValue: 'Work at Refex',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'careersButtonText',
        contentValue: 'Careers',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'careersButtonLink',
        contentValue: '/careers',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'backgroundColor',
        contentValue: '#3b9dd6',
        contentType: 'text'
      }
    ];

    for (const content of ctaContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ CTA Section seeded');

    console.log('\n✅ All ESG page sections seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding ESG page:', error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedESGPageCMS();
}

module.exports = seedESGPageCMS;

