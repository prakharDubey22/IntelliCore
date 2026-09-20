require("dotenv").config();

const { analyzeResume } = require("./src/services/aiService");

const test = async () => {
  try {
    const result = await analyzeResume({
      summary: "B.Tech student interested in backend development and AI",
      skills: [
        "JavaScript",
        "Node.js",
        "Express",
        "MongoDB",
        "React"
      ],
      education: [
        {
          degree: "B.Tech",
          fieldOfStudy: "Computer Science"
        }
      ]
    });

    console.log("AI RESPONSE:");
    console.log(result);
  } catch (error) {
    console.error("AI ERROR:");
    console.error(error.message);
  }
};

test();