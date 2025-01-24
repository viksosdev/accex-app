const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = 3000;

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey:
    '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', // Asegúrate de configurar esta variable de entorno
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint para manejar las solicitudes del chatbot
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: 'Mensaje no proporcionado' });
  }

  try {
    // Realiza la solicitud a OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: `Leer un sitio web y resumir la información más importante para el usuario.

# Pasos

1. Accede a la URL del sitio web proporcionado y lee el contenido a fondo.
2. Identifica secciones clave y detalles notables dentro del contenido, incluyendo encabezados, subtítulos y cualquier información destacada.
3. Extrae puntos esenciales, enfocándote en los temas principales, argumentos o hechos presentados.
4. Condensa la información extraída en un resumen conciso que capture la esencia de la página web.

# Formato de salida

- Proporciona un breve párrafo destacando los puntos principales extraídos del sitio web.
- Asegúrate de que la información resumida sea clara y coherente.

# Notas

- Mantén la objetividad y evita insertar interpretaciones u opiniones personales.
- Si el sitio web incluye elementos multimedia, enfócate solo en la información textual.`,
            },
          ],
        },
        { role: 'user', content: message },
      ],
      response_format: {
        type: 'text',
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
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send({ error: 'Error interno del servidor.' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
