import '../styles/App.css'
import Envio from './Envio'

function App() {

  return (
    <div className='main'>
      <div className='header'>

        <div className='quadrado-imagem'>
          <img src='email.svg' className='foto-email' alt='vite,svg'></img>
        </div>

        <h1 className='titulo'>Classificador de <span className='destaque-emails'>Emails</span></h1>
        <h2 className='subtitulo'> Faça upload do arquivo do email ou escreva o conteúdo para obter <br></br>
        uma classificação automática e receber uma resposta sugerida</h2>

        <div className='box-classificacao'>
          <img src='robot.svg' className='icone-robot' alt='robot icon'></img>
          <div className='texto-box-classificacao'>Classificação inteligente com IA</div>
        </div>
      </div>

      <div className='envio-email'>
        <Envio></Envio>
      </div>
    </div>
  )
}

export default App
