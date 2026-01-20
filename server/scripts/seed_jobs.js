const { Job } = require("../models");

module.exports = async function seedJobs() {
  try {
    console.log("Seeding jobs...");

    const jobs = [
      {
        title: "Senior Software Engineer",
        department: "Technology",
        location: "Chennai",
        jobType: "Full-time",
        description: "We are looking for an experienced software engineer to join our technology team. You will be responsible for developing and maintaining our digital platforms.",
        requirements: JSON.stringify([
          "Bachelor's degree in Computer Science or related field",
          "5+ years of experience in software development",
          "Proficiency in JavaScript, React, and Node.js",
          "Strong problem-solving skills"
        ]),
        responsibilities: JSON.stringify([
          "Design and develop scalable web applications",
          "Collaborate with cross-functional teams",
          "Write clean, maintainable code",
          "Participate in code reviews"
        ]),
        isActive: true
      },
      {
        title: "Business Development Manager",
        department: "Sales",
        location: "Mumbai",
        jobType: "Full-time",
        description: "Join our sales team and help drive business growth across multiple verticals. Ideal candidate should have experience in B2B sales and relationship management.",
        requirements: JSON.stringify([
          "MBA or equivalent degree",
          "3+ years of experience in business development",
          "Excellent communication and negotiation skills",
          "Ability to build and maintain client relationships"
        ]),
        responsibilities: JSON.stringify([
          "Identify and pursue new business opportunities",
          "Build and maintain client relationships",
          "Achieve sales targets",
          "Prepare and present proposals"
        ]),
        isActive: true
      },
      {
        title: "HR Manager",
        department: "Human Resources",
        location: "Chennai",
        jobType: "Full-time",
        description: "We are seeking an experienced HR Manager to oversee our human resources operations and support our growing team.",
        requirements: JSON.stringify([
          "Master's degree in Human Resources or related field",
          "5+ years of HR experience",
          "Strong knowledge of labor laws",
          "Excellent interpersonal skills"
        ]),
        responsibilities: JSON.stringify([
          "Manage recruitment and onboarding processes",
          "Develop and implement HR policies",
          "Handle employee relations",
          "Organize training and development programs"
        ]),
        isActive: true
      }
    ];

    for (const jobData of jobs) {
      await Job.findOrCreate({
        where: {
          title: jobData.title,
          department: jobData.department
        },
        defaults: jobData
      });
    }

    console.log("✅ Jobs seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    throw error;
  }
};

