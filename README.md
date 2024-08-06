<div align="center">
  <img src="/welcome.png"/>
</div>

# About
This is a [webhook server](https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook) written with `Next.js` that serves as the backend service of a chatbot made with `DialogFlow`.
The chatbot works on Telegram and provides client assistant and support from a fictional ISP provider.

The bot can answer client questions and problems by using *static* and *custom or dynamic* responses.
- **Static responses** are already loaded on the console and used if no conversation-specific data is needed.
- **Dynamic responses** require [parameters](https://cloud.google.com/dialogflow/es/docs/intents-actions-parameters) provided by the client during a conversation exchange and are handled by the backend server using [Fulfillments](https://cloud.google.com/dialogflow/es/docs/fulfillment-overview). DialogFlow sends a *webhook request* containing the current Intent, active contexts, parameters, etc; and the server sends a response back as a *webhook response*.

What can the bot do to help users?

- List the provider's service packs filtered by clients' location.
- Create custom packs according to clients' needs.
- Describe an users' current service pack.
- Register or delete an user using their *user code*.
- Provide technical and terminology support.
- Submit users' complaints on the provider's database for an employee to resolve them.

A detail explanation of the agent implementation and some real conversation examples can be found on `/Informe.pdf` (Spanish).

This project was made as part of a course on Artificial Intelligence for my undergrad degree on [Ingeniería en Sistemas de Información](https://utn.edu.ar/es/federacion-universitaria-tecnologica/feria-de-carreras/sistemas-de-informacion) (Information Systems Engineering).
