import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

// Configuración de OpenAI
const openai = new OpenAI({
	apiKey:
		"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", // Asegúrate de configurar esta variable de entorno
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint para manejar las solicitudes del chatbot
app.post("/chat", async (req, res) => {
	const { message } = req.body;

	if (!message) {
		return res.status(400).send({ error: "Mensaje no proporcionado" });
	}

	try {
		// Realiza la solicitud a OpenAI
		const response = await openai.chat.completions.create({
			model: "gpt-4-turbo",
			messages: [
				{
					role: "system",
					content: [
						{
							type: "text",
							text: `Read a website and summarize the most important information for the user.

# Steps

1. Access the provided website URL and read the content thoroughly.
2. Identify key sections and notable details within the content, including headings, subheadings, and any highlighted information.
3. Extract essential points, focusing on the main topics, arguments, or facts presented.
4. Condense the extracted information into a concise summary that captures the gist of the webpage.

# Output Format

- Provide a brief paragraph highlighting the main points extracted from the website.
- Ensure clarity and coherence in presenting the summarized information.

# Notes

- Remain objective and avoid inserting personal interpretations or opinions.
- If the website includes multimedia elements, only focus on textual information.`,
						},
					],
				},
				{ role: "user", content: message },
			],
			response_format: {
				type: "text",
			},
			temperature: 1,
			max_tokens: 2048,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		// Envía la respuesta del modelo al cliente
		res.send({ response: response.choices[0].message.content });
	} catch (error) {
		console.error("Error al procesar la solicitud:", error);
		res.status(500).send({ error: "Error interno del servidor." });
	}
});

// Inicia el servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
