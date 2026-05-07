export const chatAPI = {
  ask: async (question: string) => {
    const response = await fetch("http://localhost:8080/v1/api/chat/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("Failed to get answer from OpenAI");
    const data = await response.json();
    return data.answer;
  },
};
