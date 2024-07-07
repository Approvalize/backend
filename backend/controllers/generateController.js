const OpenAI = require('openai');


const generateApplication = async (req, res) => {
    try {
      
      console.log('generateApplication executed');
  
      const { prompt } = req.body;
  
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not defined');
      }
  
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant who generates letters." },
          { role: "user", content: prompt }
        ]      
      });
  
      res.status(201).json({ success: true, message: response.choices[0].message.content });
    } catch (err) {
      console.error("Error generating application:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  
  };

  module.exports = { generateApplication };