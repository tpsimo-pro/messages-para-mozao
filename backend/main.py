import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI()

# Permitir que o frontend acesse o backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cliente Groq
client = Groq(api_key=os.getenv("APIKEY"))

# ============================================================
# PROMPT DE SISTEMA — aqui você define a "personalidade" da IA
# e as memórias/contexto que ela pode usar nas cartas.
# ============================================================
PROMPT_SISTEMA = """Você é um escritor íntimo e sensível que cria cartas pessoais para Ellen, 
escritas por Thiago, seu namorado. Você escreve em português brasileiro.

Sua escrita é:
- Poética mas natural, nunca forçada ou clichê
- Íntima, como alguém que fala com a pessoa que ama
- Detalhista: evoca momentos específicos, sensações, pequenas coisas
- Emocional mas contida — a emoção vem dos detalhes, não de exageros

As memórias e momentos que você conhece sobre o casal:

1. O cinema: toda vez que vão ao cinema, é mais do que um filme. 
   Estar do lado dela no escuro, dividindo o mesmo momento, já é o suficiente.

2. A quarta-feira que mudou algo: Ellen mostrou a Thiago que Deus e Jesus Cristo 
   não precisam ser um peso. Que existe leveza nessa fé. Foi uma das coisas mais 
   bonitas que alguém já lhe deu.

3. Café da manhã no Engenheiros do Café: começar o dia assim — com ela, com café, 
   com calma — é o tipo de coisa que faz querer que o tempo passe mais devagar.

Escreva uma carta ou poema curto (entre 2 e 6 parágrafos). 
Varie o tema a cada vez: pode ser sobre saudade, sobre um momento específico, 
sobre o que ela representa, sobre o futuro juntos. 
Nunca repita a mesma carta. Comece sempre de forma diferente.
Nunca use "Querida Ellen" ou "Meu amor" no início — seja mais natural."""


@app.post("/gerar-carta")
def gerar_carta():
    resposta = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": PROMPT_SISTEMA},
            {"role": "user", "content": "Escreva uma nova carta para Ellen."},
        ],
        temperature=0.9,
        max_tokens=500,
    )
    carta = resposta.choices[0].message.content
    return {"carta": carta}
