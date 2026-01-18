# 📧 Classificador de Emails com IA

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

> Uma aplicação fullstack que utiliza o **Google Gemini** para analisar, classificar e sugerir respostas para emails automaticamente.

---

## ✨ Funcionalidades

- **Classificação Inteligente:** Separa emails entre "Produtivos" e "Improdutivos".
- **Upload de Arquivos:** Suporte para leitura de `.pdf` e `.txt`.
- **Geração de Respostas:** Cria rascunhos de respostas baseados no contexto do email.
- **Dockerizado:** Ambiente configurado com Docker Compose para fácil execução.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Desktop instalados.

### ⚠️ Passo Importante: Configuração da API

Para que a inteligência artificial funcione, você precisa configurar sua chave do Google Gemini no arquivo do Docker.

1. Abra o arquivo `docker-compose.yml` na raiz do projeto.
2. Localize a linha `GEMINI_API_KEY`.
3. Substitua o valor placeholder pela sua chave real.

Exemplo de como deve ficar no arquivo:

```yaml
    environment:
      - GEMINI_API_KEY=AIzaSyD... (Sua Chave Aqui)
```

### Executando a Aplicação

Com a chave configurada, execute o seguinte comando no terminal (na raiz do projeto) para subir os containers:

```bash
docker-compose up --build
```

---

## 🔗 Acesso à Aplicação

Após o terminal confirmar que os containers estão rodando, utilize os links abaixo para acessar o sistema:

### 🏠 Localhost (Rodando na sua máquina)

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:3000` | Interface Visual (React) |
| **Backend** | `http://localhost:5000` | API do Servidor (Flask) |

---

### ☁️ Hospedagem na Nuvem (Deploy)

A aplicação também está disponível nos seguintes links de produção:

* **Aplicação (Full-Stack):** [Acessar via Vercel](https://email-classificator-roberto.vercel.app/)
