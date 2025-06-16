// Importa jsPDF do objeto global window
const { jsPDF } = window.jspdf;

const resizeHandle = document.getElementById('resize-handle');
const textarea = document.getElementById('textarea');
const saveButton = document.getElementById('saveButton');
const container = document.querySelector('.container');

let isResizing = false;

const startResize = (e) => {
    isResizing = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', handleResize);
    document.addEventListener('touchend', stopResize);
    e.preventDefault(); 
};

const stopResize = () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', handleResize);
    document.removeEventListener('touchend', stopResize);
};

const handleResize = (e) => {
    if (!isResizing) return;
    
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    
    const maxWidth = window.innerWidth - 50; 
    const maxHeight = window.innerHeight - 50;
    
    const newWidth = Math.min(touch.clientX - containerRect.left + 8, maxWidth); 
    const newHeight = Math.min(touch.clientY - containerRect.top + 8, maxHeight); 
    
    const minWidth = 300; 
    const minHeight = 200; 

    if (newWidth >= minWidth) {
        container.style.width = `${newWidth}px`;
    }
    if (newHeight >= minHeight) {
        container.style.height = `${newHeight}px`;
    }
};

// Função de fallback para download automático
const fallbackSaveTextAsFile = (textToSave, filename = 'nota.txt') => {
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

const saveTextWithNativeDialog = async () => {
    const textToSave = textarea.value;
    const defaultFileName = 'nota.txt';

    try {
        if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
                suggestedName: defaultFileName,
                types: [
                    {
                        description: 'Arquivos de Texto',
                        accept: {
                            'text/plain': ['.txt'],
                        },
                    },
                    {
                        description: 'Documentos PDF',
                        accept: {
                            'application/pdf': ['.pdf'],
                        },
                    },
                    {
                        description: 'Arquivos JSON',
                        accept: {
                            'application/json': ['.json'],
                        },
                    },
                    {
                        description: 'Páginas HTML',
                        accept: {
                            'text/html': ['.html', '.htm'],
                        },
                    },
                    {
                        description: 'Todos os Arquivos',
                        accept: {
                            '*/*': ['.txt', '.pdf', '.json', '.html', '.htm'],
                        },
                    }
                ],
            });

            const selectedFileName = handle.name;
            const fileExtension = selectedFileName.split('.').pop().toLowerCase();

            let fileContent;
            let fileType;

            if (fileExtension === 'pdf') {
                if (typeof jsPDF !== 'undefined') {
                    const doc = new jsPDF();
                    
                    // Configurações de fonte e tamanho
                    doc.setFont('Helvetica'); // Usando Helvetica, similar a Arial e padrão no jsPDF
                    doc.setFontSize(12);

                    // Definição das margens em mm (1 cm = 10 mm)
                    const marginLeft = 30; // 3 cm
                    const marginTop = 30;  // 3 cm
                    const marginRight = 20; // 2 cm
                    const marginBottom = 20; // 2 cm

                    // Dimensões da página
                    const pageHeight = doc.internal.pageSize.height;
                    const pageWidth = doc.internal.pageSize.width;

                    // Largura da área de texto disponível
                    const textWidth = pageWidth - marginLeft - marginRight;

                    // Divide o texto em linhas para quebrar automaticamente e adicionar páginas
                    const textLines = doc.splitTextToSize(textToSave, textWidth);

                    let cursorY = marginTop; // Posição Y atual para o texto

                    textLines.forEach(line => {
                        // Verifica se a linha atual ultrapassará a margem inferior
                        if (cursorY + (doc.getLineHeight() / doc.internal.scaleFactor) > pageHeight - marginBottom) {
                            doc.addPage(); // Adiciona uma nova página
                            cursorY = marginTop; // Reseta o cursor Y para a margem superior da nova página
                        }
                        doc.text(line, marginLeft, cursorY);
                        cursorY += doc.getLineHeight() / doc.internal.scaleFactor; // Avança o cursor Y
                    });

                    fileContent = doc.output('blob');
                    fileType = 'application/pdf';

                } else {
                    alert('A biblioteca jsPDF não está carregada. Não é possível gerar um PDF real. O arquivo será salvo como texto simples.');
                    fileContent = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
                    fileType = 'text/plain';
                }
            } else {
                // Para .txt, .json, .html, etc., salvar como texto puro
                fileContent = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
                fileType = 'text/plain'; 
            }

            const writable = await handle.createWritable();
            await writable.write(fileContent);
            await writable.close();
            console.log('Arquivo salvo com sucesso!');

        } else {
            alert('Seu navegador não suporta a funcionalidade de "Salvar como" nativa com escolha de tipo de arquivo. O arquivo será baixado como .txt automaticamente.');
            fallbackSaveTextAsFile(textToSave, defaultFileName); 
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Salvamento de arquivo cancelado pelo usuário.');
        } else {
            console.error('Erro ao salvar o arquivo:', error);
            alert('Ocorreu um erro ao tentar salvar o arquivo. O arquivo será baixado como .txt automaticamente.');
            fallbackSaveTextAsFile(textToSave, defaultFileName); 
        }
    }
};

resizeHandle.addEventListener('mousedown', startResize);
resizeHandle.addEventListener('touchstart', startResize);
saveButton.addEventListener('click', saveTextWithNativeDialog);