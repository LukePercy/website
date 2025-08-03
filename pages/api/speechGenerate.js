import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, voice = 'onyx', provider = 'openai' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      // OpenAI Text-to-Speech
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1', // Use faster model instead of tts-1-hd
          input: text,
          voice: voice, // Use the selected voice: alloy, echo, fable, onyx, nova, shimmer
          response_format: 'mp3',
          speed: 1.0
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      return res.status(200).json({ 
        audioData: base64Audio,
        mimeType: 'audio/mpeg',
        provider: 'openai'
      });
    } 
    else if (provider === 'google' && process.env.GOOGLE_CLOUD_API_KEY) {
      // Google Cloud Text-to-Speech
      // Parse voice name to extract language code and gender
      const voiceName = voice || 'en-US-Neural2-D';
      const languageCode = voiceName.substring(0, 5); // Extract 'en-US', 'en-GB', etc.
      
      // Determine gender from voice name (A, C, E, F, G, H are typically female; B, D, I, J are typically male)
      const femaleVoices = ['A', 'C', 'E', 'F', 'G', 'H'];
      const lastChar = voiceName.slice(-1);
      const ssmlGender = femaleVoices.includes(lastChar) ? 'FEMALE' : 'MALE';

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: languageCode,
              name: voiceName, // Use the selected voice
              ssmlGender: ssmlGender
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 1.0,
              pitch: 0.0,
              volumeGainDb: 0.0
            }
          }),
        }
      );

      if (!response.ok) {
        // If Google Cloud TTS fails, try to fallback to OpenAI
        if (process.env.OPENAI_API_KEY) {
          console.log(`Google TTS failed (${response.status}), falling back to OpenAI...`);
          
          const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'tts-1',
              input: text,
              voice: 'onyx', // Default to onyx for fallback
              response_format: 'mp3',
              speed: 1.15
            }),
          });

          if (openaiResponse.ok) {
            const audioBuffer = await openaiResponse.arrayBuffer();
            const base64Audio = Buffer.from(audioBuffer).toString('base64');
            
            return res.status(200).json({ 
              audioData: base64Audio,
              mimeType: 'audio/mpeg',
              provider: 'openai',
              fallbackUsed: true,
              message: 'Google TTS unavailable, used OpenAI TTS'
            });
          }
        }
        
        throw new Error(`Google TTS API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // Log usage for monitoring (character count for billing estimation)
      const characterCount = text.length;
      const estimatedCost = voiceName.includes('Neural2') || voiceName.includes('WaveNet') 
        ? (characterCount / 1000000) * 16.00  // Neural2/WaveNet: $16 per 1M chars
        : (characterCount / 1000000) * 4.00;  // Standard: $4 per 1M chars
      
      console.log(`Google TTS Usage - Characters: ${characterCount}, Voice: ${voiceName}, Estimated cost: $${estimatedCost.toFixed(6)}`);
      
      return res.status(200).json({
        audioData: data.audioContent,
        mimeType: 'audio/mpeg',
        provider: 'google'
      });
    }
    else {
      // Fallback to browser speech synthesis
      return res.status(200).json({
        fallback: true,
        message: 'AI speech not configured, use browser synthesis'
      });
    }
  } catch (error) {
    console.error('Speech generation error:', error);
    
    // If we haven't tried OpenAI yet and it's available, try it as a last resort
    if (provider === 'google' && process.env.OPENAI_API_KEY) {
      try {
        console.log('Attempting OpenAI TTS as final fallback...');
        
        const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: 'onyx',
            response_format: 'mp3',
            speed: 1.15
          }),
        });

        if (openaiResponse.ok) {
          const audioBuffer = await openaiResponse.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString('base64');
          
          return res.status(200).json({ 
            audioData: base64Audio,
            mimeType: 'audio/mpeg',
            provider: 'openai',
            fallbackUsed: true,
            message: 'Used OpenAI TTS as fallback'
          });
        }
      } catch (fallbackError) {
        console.error('OpenAI fallback also failed:', fallbackError);
      }
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message,
      fallback: true,
      message: 'All AI speech providers failed, use browser synthesis'
    });
  }
}
