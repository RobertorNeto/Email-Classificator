import { useRef, useState } from 'react';
import axios from 'axios';
import '../styles/Envio.css';

function Envio() {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para limpar tudo e voltar ao início
  const handleNovaClassificacao = () => {
    setResultado(null);
    setInputText("");
    setSelectedFile(null);
  };

  const handleEnviar = async () => {
    if (!inputText && !selectedFile) {
      alert("Por favor, digite um texto OU selecione um arquivo.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFile ? formData.append('file', selectedFile) : formData.append('texto', inputText);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, formData);
      setResultado(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className='container'>
      {!resultado ? (
        <>
          <div className='text-email'>
            <div className="header-box">
              <img src='text.svg' className='icone-robot' alt='robot icon' />
              <span className="header-titulo">Escreva seu E-mail neste campo</span>
            </div>

            <textarea
              placeholder="Escreva seu E-mail aqui para classificação"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedFile(null);
              }}
              disabled={!!selectedFile}
              className="input-text"
            />
          </div>

          <div className='input-pdf-box' onClick={handleBoxClick}>
            <div className="icon-container">
              <img src="upload.svg" alt="Upload" width="50" />
            </div>

            <h1>Clique para selecionar o arquivo</h1>
            <h2>Apenas arquivos com extensão (.txt ou .pdf)</h2>

            {selectedFile && (
              <div className='select-file'>
                <p className='file'>{selectedFile.name}</p>
                <button onClick={handleRemoveFile} className="remove-file-btn">✕</button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className='upload'
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                  setInputText("");
                }
              }}
            />
          </div>

          <div className='container-botao'>
            <button className='botao-envio' onClick={handleEnviar} disabled={loading || (!inputText && !selectedFile)}>
              <img src='emailbranco.svg' className='email-btn' alt='email icon'></img>
              {loading ? "Analisando..." : "Classificar Email"}
            </button>
          </div>
        </>
      ) : (
        <div className="resultado-card">
    
          <div className="resultado-header">
            <h2>Análise Concluída</h2>
            {resultado.categoria =='IMPRODUTIVO' ? 
            <span className='Improdutivo'> {resultado.categoria}</span> 
            : 
            <span className='Produtivo'> {resultado.categoria}</span> }
          </div>

          <div className="resultado-body">
            <div className="info-group">
              <label>Sugestão de Resposta:</label>
              <div className="resposta-box">
                <div dangerouslySetInnerHTML={{ __html: resultado.resposta_sugerida }} /> 
              </div>
            </div>
          </div>

          <div className="resultado-footer">
            <button className="botao-voltar" onClick={handleNovaClassificacao}>
              Realizar Nova Classificação
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Envio;