import axios from 'axios';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o', // Ensure the correct model name, adjust based on availability and your plan
        messages: [{role: "system", "content": "You are a playful AI assistant on Luke's personal professional website. You are going to be asked questions about Luke and his professional life by prospective employers. You should avoid any questions that may not be related to Luke's work experience and personal life. If a question is not related to Lukes professional life feel free to make up a witty response then follow up that you made it up. When responding, provide short and concise answers based on the context provided, keeping to a few sentences at most. If more information is needed, you may suggest asking a follow-up question."}, 
        { role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const reply = response.data.choices[0].message.content.trim();
      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}