// Elementos da página
const openModalBtn = document.getElementById('openModalBtn');
const captureModal = document.getElementById('captureModal');
const startCaptureBtn = document.getElementById('startCaptureBtn');
const sendImageBtn = document.getElementById('sendImageBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const previewImage = document.getElementById('previewImage');
const anexosDiv = document.getElementById('anexos');
const finalSendBtn = document.getElementById('finalSendBtn');

// Variável para armazenar a imagem capturada
let capturedImageData = '';

// Abrir o modal
openModalBtn.addEventListener('click', () => {
  captureModal.style.display = 'block';
});

// Fechar o modal
closeModalBtn.addEventListener('click', () => {
  captureModal.style.display = 'none';
  previewImage.style.display = 'none';
  sendImageBtn.disabled = true; // Desabilita o botão de anexar até que uma imagem seja capturada
});

// Função de captura de tela
async function captureScreen() {
  try {
    // Solicita ao usuário a permissão para capturar a tela
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'screen' }
    });

    // Cria um elemento de vídeo temporário para desenhar o stream
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;

    // Aguarda o vídeo carregar
    await new Promise((resolve) => {
      videoElement.onloadedmetadata = resolve;
    });

    videoElement.play();

    // Quando o vídeo estiver pronto, desenha o frame capturado em um canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Pausa o vídeo e para a captura
    videoElement.pause();
    stream.getTracks().forEach(track => track.stop());

    // Converte o canvas em uma imagem base64
    capturedImageData = canvas.toDataURL('image/png');

    // Mostra a imagem capturada
    previewImage.src = capturedImageData;
    previewImage.style.display = 'block';

    // Habilita o botão de anexar
    sendImageBtn.disabled = false;

  } catch (err) {
    console.error('Erro ao capturar a tela:', err);
  }
}

// Iniciar a captura de tela quando o botão for clicado
startCaptureBtn.addEventListener('click', captureScreen);

// Função de anexar a imagem ao "site"
function anexarImagem() {
  if (capturedImageData) {
    // Cria um novo elemento de imagem e adiciona à seção de anexos
    const imgElement = document.createElement('img');
    imgElement.src = capturedImageData;

    anexosDiv.appendChild(imgElement);

    // Habilita o botão de enviar para o servidor
    finalSendBtn.disabled = false;

    // Fecha o modal
    captureModal.style.display = 'none';
    previewImage.style.display = 'none';
    sendImageBtn.disabled = true;
  }
}

// Função de envio final para o servidor (simulado)
function enviarParaServidor() {
  if (capturedImageData) {
    console.log('Enviando para o servidor...');
    alert('Imagem enviada com sucesso!');
    finalSendBtn.disabled = true; // Desabilita após o envio
  }
}

// Adicionar eventos de clique
sendImageBtn.addEventListener('click', anexarImagem);
finalSendBtn.addEventListener('click', enviarParaServidor);
