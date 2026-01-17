import string
from flask import Flask, json,jsonify,request
from google import genai
from flask_cors import CORS
import spacy
import os
from dotenv import load_dotenv
from pypdf import PdfReader

#inicialização de variáveis e do backend
load_dotenv()
app = Flask(__name__)
CORS(app)
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
nlp = spacy.load("pt_core_news_sm")

#função para extrair o texto do arquivo enviado, ou do pdf/txt ou do texto enviado como FormData
def extrair_texto(req):
    texto_final = ''

    if 'file' in req.files:
        file = req.files['file']

        if file.filename != '':
            filename = file.filename.lower()

            if filename.endswith('.pdf'):       
                try:
                    paginas = PdfReader(file)
                    for page in paginas.pages:
                        texto_final += page.extract_text() + "\n"
                except Exception as e:
                    return None, f"Erro ao ler PDF: {str(e)}"
                
            elif filename.endswith('.txt'):
                try:
                    texto_final += file.read().decode('utf-8')
                except Exception as e:
                    return None, f"Erro ao ler Txt: {str(e)}"
            return texto_final,None
    
    if 'texto' in req.form:
        return req.form['texto'], None

    return None, "Nenhum texto ou arquivo válido encontrado."


#função para processar o email para o modelo
def preprocessartexto(texto):
    texto = texto.lower()
    texto = texto.translate(str.maketrans('', '', string.punctuation))

    palavras = nlp(texto)
    texto_filtrado = [token.lemma_ for token in palavras if not token.is_stop and not token.is_punct and not token.is_space]
    return " ".join(texto_filtrado)

#Exemplos para dar uma tunada na IA
exemplos_treinamento = """
Exemplo 1:
Entrada: "Bom dia, gostaria de saber o status da chamada do suporte que abri hoje."
Classificação: PRODUTIVO
Justificativa: O cliente solicita atualização de um processo específico.
Resposta Sugerida: "Prezado cliente, informamos que a chamada ainda está em análise pela equipe de suporte. O prazo é de 24h."

Exemplo 2:
Entrada: "Feliz natal para vocês do banco, obrigado por tudo!"
Classificação: IMPRODUTIVO
Justificativa: Mensagem de cortesia sem solicitação de serviço.
Resposta Sugerida: "Agradecemos o carinho! Desejamos um excelente Natal para você também."

Exemplo 3:
Entrada: "Segue em anexo o comprovante de renda."
Classificação: PRODUTIVO
Justificativa: Envio de documento necessário para processos bancários.
Resposta Sugerida: "Recebemos seu comprovante. Ele será anexado ao seu cadastro para validação."
"""


#rota HTTP POST para realizar as requisicoes para o modelo
@app.route('/email',methods=['POST'])
def gerarResposta():

    texto_original, erro = extrair_texto(request)

    if erro:
        return jsonify({"erro": erro}), 400
    
    if not texto_original:
        return jsonify({"erro": "O conteúdo do email está vazio."}), 400
    
    email_tokenizado = preprocessartexto(texto_original)

    prompt = f"""
    Analise o email financeiro e responda em formato JSON.
    
    Categorias:
    - PRODUTIVO: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema).
    - IMPRODUTIVO: Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos).

    Texto: {email_tokenizado}

    PARA "TREINA" SEU COMPORTAMENTO, USE OS SEGUINTES EXEMPLOS DE REFERÊNCIA:
    ---
    {exemplos_treinamento}
    ---

    Formato de saída estrito:
    {{
        "categoria": "PRODUTIVO ou IMPRODUTIVO",
        "justificativa": "por que você escolheu essa categoria?",
        "resposta_sugerida": "uma resposta profissional em português"
    }}
    """

    resultado = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )

    resposta = resultado.text
    resposta_limpa = resposta.replace("```json", "").replace("```", "").strip()
    resposta_json = json.loads(resposta_limpa)
    return jsonify(resposta_json)
    

if __name__ == "__main__":
    app.run(port=5000,host='0.0.0.0',debug=True)

