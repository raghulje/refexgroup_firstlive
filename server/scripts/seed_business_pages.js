const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedBusinessPages() {
  try {
    console.log("Seeding business pages...");

    // ============================================
    // 1. REFEX REFRIGERANTS PAGE
    // ============================================
    const refrigerantsPage = await Page.findOrCreate({
      where: { slug: "refex-refrigerants" },
      defaults: {
        slug: "refex-refrigerants",
        title: "Refex Refrigerants",
        status: "published",
        templateType: "business"
      }
    });
    const refrigPage = refrigerantsPage[0];

    // Hero Section
    const refrigHero = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "hero" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigHero[0].id, contentKey: "label", contentValue: "Refex Refrigerants", contentType: "text" },
      { sectionId: refrigHero[0].id, contentKey: "title", contentValue: "Pioneers and Conscious Innovators in the Refrigerant gas Industry.", contentType: "text" },
      { sectionId: refrigHero[0].id, contentKey: "description", contentValue: "Since the inception in 2002, Refex has established itself as a formidable leader and competitor in the refrigerant gas industry. In the last twenty years of our quest towards climate-friendly alternatives, we have successfully developed and expanded our product lines to include innovative and environmental-friendly options. We are also proactively addressing and tackling sourcing and environmental policy changes. Our focus is on sustainability and we are dedicated to creating a better future!", contentType: "text" },
      { sectionId: refrigHero[0].id, contentKey: "backgroundImage", contentValue: "/uploads/general/Businesses-BG.jpg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Why Choose Us Section
    const refrigWhyUs = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "why-choose-us" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "features",
        sectionKey: "why-choose-us",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigWhyUs[0].id, contentKey: "title", contentValue: "Why Choose Us", contentType: "text" },
      { sectionId: refrigWhyUs[0].id, contentKey: "features", contentValue: JSON.stringify([
        {
          icon: "ri-flask-line",
          title: "State of the Art Automated Filling Equipment",
          description: "Experience unparalleled convenience and precision at our refilling factory, featuring automated and dedicated filling lines suitable for all products and sizes of cylinders, tonners, and cans."
        },
        {
          icon: "ri-truck-line",
          title: "Well Networked Logistics",
          description: "Our expert logistics network guarantees prompt and reliable shipping, backed by our extensive experience in streamlining orders and ensuring timely supply."
        },
        {
          icon: "ri-hand-heart-line",
          title: "Highest Quality Standards",
          description: "Our comprehensive product testing capabilities uphold the highest quality standards in each and every process to ensure maximum efficiency, precision and quality control.."
        },
        {
          icon: "ri-ship-line",
          title: "Reliable Shipping",
          description: "Exclusive partnerships with trusted forwarders to guarantee secure and expedited shipping."
        },
        {
          icon: "ri-team-line",
          title: "Skilled Employees",
          description: "Dedicated employees with excellent engineering expertise providing exceptional service and high-quality products to our valued business partners and consumers."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Breaking New Grounds Section
    const refrigBreaking = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "breaking-grounds" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "content",
        sectionKey: "breaking-grounds",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigBreaking[0].id, contentKey: "title", contentValue: "Breaking new grounds with innovative and sustainable solutions in Refrigerant gas refilling.", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Products Section
    const refrigProducts = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "products" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "products",
        sectionKey: "products",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigProducts[0].id, contentKey: "title", contentValue: "Our Products", contentType: "text" },
      { sectionId: refrigProducts[0].id, contentKey: "description", contentValue: "Discover our innovative and eco-friendly products that are produced to meet your needs while making a positive impact on the environment.", contentType: "text" },
      { sectionId: refrigProducts[0].id, contentKey: "products", contentValue: JSON.stringify([
        { name: "R-32", image: "/uploads/general/R32-1024x1024.jpg" },
        { name: "R-134a", image: "/uploads/general/R134a-Background-Removed-Medium.png" },
        { name: "R-404a", image: "/uploads/general/R404a-Background-Removed-Medium.png" },
        { name: "R-407c", image: "/uploads/general/R407c-Background-Removed-Medium.png" },
        { name: "R-410a", image: "/uploads/general/R410a-Background-Removed-Medium.png" },
        { name: "R-22", image: "/uploads/general/R22-can-Background-Removed-Medium-1.png" },
        { name: "R-22 Cylinder", image: "/uploads/general/R22-cylinder-Background-Removed-1024x1024.png" },
        { name: "R-152a", image: "/uploads/general/R152a-cylinder-Medium.png" },
        { name: "R600a", image: "/uploads/general/600a-Background-Removed-Medium.png" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Quality Assurance Section
    const refrigQuality = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "quality-assurance" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "content",
        sectionKey: "quality-assurance",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigQuality[0].id, contentKey: "title", contentValue: "Quality Assurance & Safety", contentType: "text" },
      { sectionId: refrigQuality[0].id, contentKey: "description", contentValue: "Our commitment to excellence and attention to detail has established our products as a benchmark in the industry. You can trust Refex to provide you with the highest quality and safest products for all your refrigerant gas needs.", contentType: "text" },
      { sectionId: refrigQuality[0].id, contentKey: "productQuality", contentValue: JSON.stringify([
        "We provide each customer with a Certificate of Analysis that conforms to the highest quality standards, we test and analyze all products before and after filling in our state-of-the-art laboratory to ensure consistency.",
        "Keeping in pace with the market revolution, we have fully committed ourselves to continuous improvement, innovation, and implementation in all our processes , right from filling to customer service. Our focus on quality, timely delivery, and customer satisfaction is reflected in our success.",
        "Our dedication to quality is ingrained in every aspect of our business. We pride ourselves on building long-lasting relationships with our customers by providing quality products and services that exceed expectations."
      ]), contentType: "json" },
      { sectionId: refrigQuality[0].id, contentKey: "productSafety", contentValue: JSON.stringify([
        "At Refex, we take the security and safety of our products very seriously. Each product is provided with a dedicated storage facility, approved and licensed by PESO, PCB, and other relevant authorities. We ensure 100% compliance with all regulations and use the best fabricators in the industry.",
        "Quality and safety are our top priorities at Refex. We are certified with ISO 14001:2015, and our in-house laboratory tests and analyzes every product for purity of gas and moisture content before and after filling. We take great care to ensure the quality of all cylinders before filling with gases."
      ]), contentType: "json" },
      { sectionId: refrigQuality[0].id, contentKey: "qualityImage", contentValue: "/uploads/general/Quality-check-1-1024x538.jpg", contentType: "text" },
      { sectionId: refrigQuality[0].id, contentKey: "safetyImage", contentValue: "/uploads/general/Safety-Check-Large-1024x682.jpeg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Refex Industries Limited Section
    const refrigRIL = await Section.findOrCreate({
      where: { pageId: refrigPage.id, sectionKey: "refex-industries" },
      defaults: {
        pageId: refrigPage.id,
        sectionType: "cta",
        sectionKey: "refex-industries",
        orderIndex: 5,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: refrigRIL[0].id, contentKey: "title", contentValue: "Refex Industries Limited", contentType: "text" },
      { sectionId: refrigRIL[0].id, contentKey: "description", contentValue: "A market leader in the refrigerant gas industry. Discover our eco-friendly alternatives and pave your way towards a greener tomorrow.", contentType: "text" },
      { sectionId: refrigRIL[0].id, contentKey: "buttonText", contentValue: "Visit Website", contentType: "text" },
      { sectionId: refrigRIL[0].id, contentKey: "buttonLink", contentValue: "https://www.refex.co.in/", contentType: "text" }
    ], { ignoreDuplicates: true });

    // ============================================
    // 2. REFEX RENEWABLES PAGE
    // ============================================
    const renewablesPage = await Page.findOrCreate({
      where: { slug: "refex-renewables" },
      defaults: {
        slug: "refex-renewables",
        title: "Refex Renewables",
        status: "published",
        templateType: "business"
      }
    });
    const renewPage = renewablesPage[0];

    // Hero Section
    const renewHero = await Section.findOrCreate({
      where: { pageId: renewPage.id, sectionKey: "hero" },
      defaults: {
        pageId: renewPage.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: renewHero[0].id, contentKey: "label", contentValue: "Refex Renewables", contentType: "text" },
      { sectionId: renewHero[0].id, contentKey: "title", contentValue: "Brightening the future with renewables", contentType: "text" },
      { sectionId: renewHero[0].id, contentKey: "description", contentValue: "Your trusted partner in renewable energy. With 10 years of experience in the solar PV industry, we specialize in designing, executing, installing, and maintaining efficient solar power systems.", contentType: "text" },
      { sectionId: renewHero[0].id, contentKey: "backgroundImage", contentValue: "/uploads/business/refex-renewables/hero/Renewables-Hero-BG.jpg", contentType: "text" },
      { sectionId: renewHero[0].id, contentKey: "stats", contentValue: JSON.stringify([
        { value: "10+", label: "YEARS OF EXPERIENCE" },
        { value: "41+", label: "LOCATIONS" },
        { value: "12+", label: "ACROSS STATES" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Category Cards Section
    const renewCategories = await Section.findOrCreate({
      where: { pageId: renewPage.id, sectionKey: "categories" },
      defaults: {
        pageId: renewPage.id,
        sectionType: "content",
        sectionKey: "categories",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: renewCategories[0].id, contentKey: "categories", contentValue: JSON.stringify([
        {
          title: "Commercial & Industrial",
          image: "/uploads/business/refex-renewables/categories/Renewables-Commercial-Industrial.jpg"
        },
        {
          title: "Utility",
          image: "/uploads/business/refex-renewables/categories/Renewables-Utility.jpg"
        },
        {
          title: "Battery storage",
          image: "/uploads/business/refex-renewables/categories/Renewables-Battery-Storage.jpg"
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Benefits Section
    const renewBenefits = await Section.findOrCreate({
      where: { pageId: renewPage.id, sectionKey: "benefits" },
      defaults: {
        pageId: renewPage.id,
        sectionType: "features",
        sectionKey: "benefits",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: renewBenefits[0].id, contentKey: "title", contentValue: "Discover the numerous benefits that set us apart from the competition", contentType: "text" },
      { sectionId: renewBenefits[0].id, contentKey: "benefits", contentValue: JSON.stringify([
        {
          icon: "ri-team-line",
          title: "Expert Team",
          description: "Our expert team excels in the solar industry, with proven success and unparalleled knowledge. We offer clients tailored, efficient solutions."
        },
        {
          icon: "ri-lightbulb-line",
          title: "Holistic Solutions",
          description: "We provide a holistic approach to our services, including design, installation, and maintenance, making the process simple and straightforward for our clients."
        },
        {
          icon: "ri-leaf-line",
          title: "Sustainable Energy",
          description: "Refex Renewables provides eco-friendly energy solutions for a better future. Our goal is to promote renewable sources of energy for a cleaner planet."
        },
        {
          icon: "ri-global-line",
          title: "Extensive Coverage",
          description: "Refex Renewables has successfully executed projects across multiple regions, showcasing our capacity to serve a diverse population."
        },
        {
          icon: "ri-trophy-line",
          title: "Record of Excellence",
          description: "Our reputation precedes us, thanks to a portfolio that includes prestigious government agencies and top-notch private organizations"
        },
        {
          icon: "ri-rocket-line",
          title: "Innovative Strategies",
          description: "Refex Renewables is renowned for our groundbreaking methods in solar power systems, such as the canal top solar venture, making us stand out among the competition."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Featured Projects Section
    const renewProjects = await Section.findOrCreate({
      where: { pageId: renewPage.id, sectionKey: "featured-projects" },
      defaults: {
        pageId: renewPage.id,
        sectionType: "projects",
        sectionKey: "featured-projects",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: renewProjects[0].id, contentKey: "title", contentValue: "Featured Projects", contentType: "text" },
      { sectionId: renewProjects[0].id, contentKey: "description", contentValue: "Explore our featured projects and discover how Refex is leading the way in sustainable innovation and excellence.", contentType: "text" },
      { sectionId: renewProjects[0].id, contentKey: "projects", contentValue: JSON.stringify([
        {
          name: "Bhilai Project",
          location: "Bhilai, Chattisgarh",
          capacity: "68MWp",
          status: "Ongoing Project.",
          offTaker: "Indian Railways – AAA rated 1st solar project.",
          images: [
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Bhilai-1.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Bhilai-2.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Bhilai-3.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Bhilai-4.jpg"
          ]
        },
        {
          name: "Indian Army 2 MW Project",
          location: "Leh, Ladakh (Partapur & Siachen Base Camps)",
          capacity: "2 MWp with 4 MWhr of BSES",
          status: "Solar project at the highest altitude in India",
          offTaker: "Project Completed in July 2022. Name of off-taker – Indian Army",
          images: [
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Leh-Ladak-1.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Leh-Ladak-2.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Leh-Ladak-3.jpg",
            "/uploads/business/refex-renewables/projects/Renewables-Projects-Leh-Ladak-6.jpg"
          ]
        },
        {
          name: "Diwana Project",
          location: "Panipat, Haryana",
          capacity: "2.938 MWp",
          status: "1st solar project alongside the railway track",
          offTaker: "Project Completed in September 2020. Name of off-taker – Indian Railways – AAA rated",
          images: [
            "/uploads/general/Diwana_1-Medium.jpeg",
            "/uploads/general/Diwana_2-Medium.jpeg",
            "/uploads/general/Diwana_3-Medium.jpeg",
            "/uploads/general/Diwana_4-Medium.jpeg"
          ]
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // ============================================
    // 3. REFEX ASH & COAL HANDLING PAGE
    // ============================================
    const ashCoalPage = await Page.findOrCreate({
      where: { slug: "refex-ash-coal-handling" },
      defaults: {
        slug: "refex-ash-coal-handling",
        title: "Refex Ash & Coal Handling",
        status: "published",
        templateType: "business"
      }
    });
    const ashCoal = ashCoalPage[0];

    // Hero Section
    const ashCoalHero = await Section.findOrCreate({
      where: { pageId: ashCoal.id, sectionKey: "hero" },
      defaults: {
        pageId: ashCoal.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: ashCoalHero[0].id, contentKey: "label", contentValue: "Refex Ash & Coal Handling", contentType: "text" },
      { sectionId: ashCoalHero[0].id, contentKey: "title", contentValue: "Refex – One-stop solution for all your Ash and Coal Requirements", contentType: "text" },
      { sectionId: ashCoalHero[0].id, contentKey: "description", contentValue: "Refex is the leading provider of specialized solutions for the seamless supply and transportation of coal, management of the coal yard, efficient transportation and disposal of ash generated from the incineration of coal in thermal power plants. Operational since 2018, we have built a reputation for providing out of the box and reliable solutions and high-quality services to our clients. We have come to known as the most dependable and competent service provider for a multitude of services in the thermal business spectrum.", contentType: "text" },
      { sectionId: ashCoalHero[0].id, contentKey: "backgroundImage", contentValue: "/uploads/business/refex-ash-coal/hero/Coal-Ash-Hero-1024x684.jpg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Why Us Section
    const ashCoalWhyUs = await Section.findOrCreate({
      where: { pageId: ashCoal.id, sectionKey: "why-us" },
      defaults: {
        pageId: ashCoal.id,
        sectionType: "features",
        sectionKey: "why-us",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: ashCoalWhyUs[0].id, contentKey: "title", contentValue: "Why us", contentType: "text" },
      { sectionId: ashCoalWhyUs[0].id, contentKey: "description", contentValue: "At Refex, we take immense pride in our commitment to excellence, sustainability and environmental responsibility. We work closely with each individual client to understand their specific needs and deliver customized solutions. Whether you're looking for a reliable source of high-quality coal or need a partner to handle your ash transportation and disposal needs, we have the expertise and experience to deliver results as per the standards set by MoEF (Ministry of Environment, Forest and Climate Change of India) and the pollution control boards.", contentType: "text" },
      { sectionId: ashCoalWhyUs[0].id, contentKey: "image", contentValue: "/uploads/general/pushing-at-th2.jpeg", contentType: "text" },
      { sectionId: ashCoalWhyUs[0].id, contentKey: "features", contentValue: JSON.stringify([
        {
          icon: "ri-lightbulb-line",
          title: "Innovative Solutions",
          description: "Refex is at the forefront in adopting innovative technologies in the utilization of ash in various environmental friendly and new generation building materials. Constantly on the lookout for opportunities for recycling and reuse in relation and reduce our clients' environmental footprint."
        },
        {
          icon: "ri-team-line",
          title: "Synergy with Cement Companies",
          description: "Cordial relationships with all leading cement plants across the country, catering fly ash to them via multiple modes of transport, namely bulkers, rakes etc."
        },
        {
          icon: "ri-shield-check-line",
          title: "100% Compliance to environmental norms",
          description: "Refex adheres to statutory guidelines from all relevant organizations (MoEF (Ministry of Environment, Forest & Climate Change), CPCB, and SPCB), with a commitment to create sustainable and compliant utilization or disposal methods."
        },
        {
          icon: "ri-user-star-line",
          title: "Experienced and Agile team",
          description: "Refex has a team of expert engineers, project managers, and technicians who work closely with clients to understand their specific needs and deliver customized solutions that meet their requirements. This enables data-driven decision making and adoption of immediate corrective actions."
        },
        {
          icon: "ri-building-line",
          title: "Large Scale Operations",
          description: "Refex handles all aspects of the ash dyke, right from loading at the pond to the appropriate disposal and closure at landfills with complete documentation and compliance to statutory norms, while prioritizing safety on all accounts. Expertise in handling large scale MW projects and high ash volumes on a daily basis, with the extensive fleet of hyvas and trailers owned by Refex."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // What We Do Section
    const ashCoalWhatWeDo = await Section.findOrCreate({
      where: { pageId: ashCoal.id, sectionKey: "what-we-do" },
      defaults: {
        pageId: ashCoal.id,
        sectionType: "content",
        sectionKey: "what-we-do",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: ashCoalWhatWeDo[0].id, contentKey: "title", contentValue: "What We do", contentType: "text" },
      { sectionId: ashCoalWhatWeDo[0].id, contentKey: "services", contentValue: JSON.stringify([
        {
          title: "Handling & Disposal of Fly Ash",
          description: "We specialize in ash handling services, including ash collection, transportation, and disposal, as well as recycling and reuse options. Our experienced team uses state-of-the-art equipment and techniques to ensure that ash is handled safely and responsibly, in compliance with all relevant regulations.\n\nOur team of experts are highly trained in complete gamut of operations and our equipment is outfitted with latest trends in technology to carry out all our processes effectively, thereby ensuring high quality services provided to all our clients – thermal plants, cement companies, brick manufacturers, mine owners etc.",
          image: "/uploads/general/Heap-Making-5293.jpeg"
        },
        {
          title: "Coal Yard Management",
          description: "We provide round the clock, cost effective and sustainable services for management of coal yards in thermal power plants, that includes CHP room operations, Housekeeping, Segregation of coal & stone, management of heavy machineries, Rake unloading, shifting and crushing of coal etc., thereby offering comprehensive support from procurement of coal to feeding it into boilers.",
          image: "/uploads/general/Heap-making-at-Yard-Trough-PC-_-Loader.jpeg"
        },
        {
          title: "Coal Trading",
          description: "Our coal trading services includes sourcing, procurement, and transportation of various types of coal. We work with a network of trusted suppliers to ensure that our clients receive only the highest quality coal products, delivered on time and within budget. Our strategic partnerships, efficient supply chain management, and ability to navigate market fluctuations play a significant role in our success.",
          image: "/uploads/business/refex-ash-coal/what-we-do/Water-Sprinkling-in-smoke-coal-and-shifting.jpeg"
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    console.log("✅ Business pages (Refrigerants, Renewables, Ash & Coal) seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding business pages:", error);
    throw error;
  }
};

