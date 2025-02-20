const API_URL = 'http://localhost:11434';

export const getModelResponse = async (
    prompt: string,
    modelName: string,
    onData: (data: string) => void,
    maxRetries = 3
  ) => {
    let attempt = 0;
  
    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${API_URL}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            prompt: prompt,
            stream: true,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        if (!response.body) {
          throw new Error('ReadableStream not supported in this browser.');
        }
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
  
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          const chunk = decoder.decode(value, { stream: true });
          onData(chunk);
        }
  
        console.log('Stream ended.');
        return; // Exit the function successfully
  
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
  
        if (attempt >= maxRetries) {
          console.error('Max retries reached. Throwing error.');
          throw error;
        }
  
        console.log('Retrying...');
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  };