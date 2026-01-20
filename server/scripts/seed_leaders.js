const { Leader, Media } = require("../models");

module.exports = async function seedLeaders() {
  try {
    console.log("Seeding leaders...");

    const leaders = [
      {
        name: "Anil Jain",
        position: "Chairman & Managing Director",
        bio: "Anil Jain is a leading industrialist with a vision to make Refex one of India's largest business conglomerates. His entrepreneurial journey began at the age of 19, and since then, he has been leading Refex with passion, dedication, and an unwavering commitment to excellence. As a leader, he believes in empowering his team and fostering a culture of innovation and growth. He is actively involved in the Incubation Centre and Refex Capital, which invests in promising startups, helping to nurture the next generation of entrepreneurs. Anil Jain has also been instrumental in setting up the angel investment & incubation Center of JITO (Jain International Trade Organization), further demonstrating his commitment to supporting entrepreneurship and innovation. His philanthropic activities extend beyond business, including significant support during the COVID-19 pandemic, where he contributed to various relief efforts to help those in need. His remarkable growth journey is a testament to his passion, dedication, simplicity, and humility. These core values have not only shaped his leadership style but have also been the foundation of Refex's success story, inspiring everyone in the organization to strive for excellence while staying grounded. Anil Jain has been recognized with several prestigious industrial awards, including the 'Young Entrepreneur by Times Group', 'The Standard Chartered DUN & BRADSTREET Top 100 SMEs Award', 'Times of India Trailblazers of Tamil Nadu', and a Stevie award. These accolades reflect his outstanding contributions to the business world and his commitment to excellence in all endeavors.",
        imageId: null,
        linkedinUrl: "https://www.linkedin.com/in/anil-jain-57864343/",
        category: "executive",
        orderIndex: 0,
        isActive: true
      },
      {
        name: "Dinesh Agarwal",
        position: "Group CEO",
        bio: "Dinesh has over 19 years of experience in Corporate Finance spanning Audit, Financial Accounting and Planning, Tax and Fundraising. He has a natural flair for numbers and his business acumen stands testimony to the phenomenal growth that Refex has experienced under his leadership. He has been associated with Refex Group since 2014 and his contribution to the success of Refex is phenomenal. His experience, expertise and passion for Finance and Accounting functions helped fuel the business and put it on a growth trajectory. Dinesh has earlier worked in reputed organisations Aircel and Brisk specializing in streamlining internal processes and functions in the finance function. His business acumen in Corporate Finance spanning Audit, Financial Accounting and Planning, Tax and Fundraising has helped raise over 3,000 crores (Equity + Debt) for clients. He also has diverse experience in Solar EPC segments and Utility-scale projects. He has also consulted for diverse businesses including start-ups, SMEs, established Corporate Houses, and International NGOs. Dinesh has received several industry recognitions for his contribution to management and related areas. Academically he graduated from Sambalpur University and ICAI.",
        imageId: null,
        linkedinUrl: "https://www.linkedin.com/in/dinesh-agarwal-b561a714/",
        category: "executive",
        orderIndex: 1,
        isActive: true
      },
      {
        name: "Purvesh Kapadia",
        position: "CHRO",
        bio: "In a career span of 25+ Years - Purvesh has played multiple strategic pinnacle roles ranging from CHRO-Managing Partner-COO-Director HR etc. Throughout his career he has taken up several challenging assignments and has been instrumental in redefining the HR process for several leading organizations globally. Business process reengineering is his exclusive strength tested and proven in his career span. His innate process-driven approach has helped in achieving double-digit top-line and bottom-line growth for several organizations, he has been associated with. He has worked with several prestigious organizations such as Terex, Intervalve India Ltd, Sheetal Group etc. Purvesh has also spent 10+ years in the IT Education sector. Academically, he has a Master's in Human Resources - Development & Management from Jamnalal Bajaj Institute of Management Studies and a Honours in Systems Management (Information Technology) from National Institute of Information Technology.",
        imageId: null,
        linkedinUrl: "https://www.linkedin.com/in/purveshkapadia/",
        category: "executive",
        orderIndex: 2,
        isActive: true
      },
      {
        name: "Lalitha Uthayakumar",
        position: "CEO – Refrigerants",
        bio: "Lalitha has over 30 years of experience handling accounts and operations. She currently heads the Refrigerants business at Refex. She has been with Refex for 20 years handling several portfolios. She played a major role during the IPO of Refex Industries Limited. An avid accounts professional started with a humble beginning at Refex and climbed the career ladder to the position of CEO to head a business. Her strong analytical skills, penchant for numbers and adept learning of the business domain have fuelled her career ladder and growth in Refex. Right from managing the sales targets, driving her team to perform, ensuring timely delivery of the shipment, and handling the refilling factory, she has managed with ease and demonstrated performance excellence. Academically, Lalitha has completed her graduation in Commerce and several other certifications pertaining to her domain.",
        imageId: null,
        linkedinUrl: "https://www.linkedin.com/in/lalitha-uthayakumar-79a389122/",
        category: "business",
        orderIndex: 3,
        isActive: true
      },
      {
        name: "Srivaths Varadharajan",
        position: "Group CTO",
        bio: "Leading technology strategy and digital transformation initiatives.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 4,
        isActive: true
      },
      {
        name: "Kalpesh Kumar",
        position: "CEO – Renewables",
        bio: "Driving renewable energy initiatives and sustainable power solutions.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 5,
        isActive: true
      },
      {
        name: "Bala M",
        position: "CEO – 3i Medtech",
        bio: "Revolutionizing healthcare technology with innovative medical solutions.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 6,
        isActive: true
      },
      {
        name: "Yash Jain",
        position: "Director – Refex Green Mobility",
        bio: "Leading sustainable mobility solutions and green transportation initiatives.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 7,
        isActive: true
      },
      {
        name: "Sharat Narasapur",
        position: "MD & CEO – RLFC",
        bio: "Managing and driving growth for RLFC business vertical.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 8,
        isActive: true
      },
      {
        name: "Meet Goradia",
        position: "COO – RGML",
        bio: "Overseeing operations and ensuring operational excellence for RGML.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 9,
        isActive: true
      },
      {
        name: "Tarun Arora",
        position: "Chief Business Officer",
        bio: "Leading business strategy and growth initiatives across the organization.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 10,
        isActive: true
      },
      {
        name: "Vishesh Mehta",
        position: "Head – Business Development",
        bio: "Driving business expansion and strategic partnerships.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 11,
        isActive: true
      },
      {
        name: "Gautam Jain",
        position: "Head – Investor Relations",
        bio: "Managing investor communications and stakeholder relations.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 12,
        isActive: true
      },
      {
        name: "Kruta Valecha",
        position: "Head – COE (OD & L&D)",
        bio: "Leading organizational development and learning & development initiatives.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 13,
        isActive: true
      },
      {
        name: "Srividya.N",
        position: "Head – Corporate Communications",
        bio: "Managing corporate communications and brand reputation.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 14,
        isActive: true
      },
      {
        name: "Jagdish Jain",
        position: "Business Head – Ash & Coal Handling",
        bio: "Ensuring environmental compliance and operational efficiency in ash handling.",
        imageId: null,
        linkedinUrl: "",
        category: "business",
        orderIndex: 15,
        isActive: true
      },
      {
        name: "Gagan Bihari Pattnaik",
        position: "Head – ESG & Sustainability",
        bio: "Driving sustainability initiatives and ESG compliance.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 16,
        isActive: true
      },
      {
        name: "Harini.S",
        position: "Head – Legal",
        bio: "Leading legal affairs and ensuring regulatory compliance.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 17,
        isActive: true
      },
      {
        name: "Sahil Singla",
        position: "Head – Corporate Finance",
        bio: "Managing corporate finance and financial strategy.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 18,
        isActive: true
      },
      {
        name: "Sonal Jain",
        position: "Head – Accounts",
        bio: "Overseeing accounting operations and financial reporting.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 19,
        isActive: true
      },
      {
        name: "Ankit Poddar",
        position: "Head – Corporate Secretarial",
        bio: "Managing corporate secretarial functions and governance.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 20,
        isActive: true
      },
      {
        name: "Suhail Shariff",
        position: "Head – Administration & Facility",
        bio: "Overseeing administrative operations and facility management.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 21,
        isActive: true
      },
      {
        name: "Sandeep Mishra",
        position: "VP – Chief of Staff International Business",
        bio: "Leading strategic initiatives and operations for international business.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 22,
        isActive: true
      },
      {
        name: "Susmitha Siripurapu",
        position: "Chief of Staff – Refrigerant gases & Thermal",
        bio: "Supporting strategic initiatives for refrigerant gases and thermal business.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 23,
        isActive: true
      },
      {
        name: "Sachin Navtosh Jha",
        position: "Chief of Staff – Green Mobility, Power Trading, & VC",
        bio: "Leading strategic initiatives for green mobility, power trading, and venture capital.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 24,
        isActive: true
      },
      {
        name: "Maharshi Maitra",
        position: "Chief of Staff – Airports & Transportation, Pharma",
        bio: "Supporting strategic initiatives for airports, transportation, and pharma businesses.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 25,
        isActive: true
      },
      {
        name: "Saravanan Vasanth",
        position: "Chief of Staff – MedTech & Renewables",
        bio: "Leading strategic initiatives for MedTech and renewables divisions.",
        imageId: null,
        linkedinUrl: "",
        category: "executive",
        orderIndex: 26,
        isActive: true
      }
    ];

    for (const leaderData of leaders) {
      await Leader.findOrCreate({
        where: {
          name: leaderData.name,
          position: leaderData.position
        },
        defaults: leaderData
      });
    }

    console.log("✅ Leaders seeded successfully");
    console.log(`✅ Total leaders seeded: ${leaders.length}`);
  } catch (error) {
    console.error("❌ Error seeding leaders:", error);
    throw error;
  }
};
