const API_URL = 'http://localhost:11434';
export const getModelResponse = async (
  prompt: string,
  modelName: string,
  onData: (data: string) => void
) => {
  console.log("Lo que llega",prompt, modelName);
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
      return; 
    } catch (error) {
      console.error(`Failed:`, error);
    }
  
};
