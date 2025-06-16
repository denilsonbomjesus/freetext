## Funcionalidade

- A área de texto pode ser redimensionada ao arrastar o canto inferior direito.
- O conteúdo pode ser escrito livremente e o `scroll` será ativado quando o conteúdo exceder o limite da tela.
- O código usa a propriedade `resize: none` no CSS para desabilitar o redimensionamento padrão da área de texto e permitir o controle manual via o script.

### Funcionalidades V2

- **Botão de Salvar:** Adicionado um botão "⭳ Salvar" no canto superior direito da tela, fora da área de texto principal.
- **Diálogo "Salvar como" Nativo:** Ao clicar em "⭳ Salvar", o gerenciador de arquivos nativo do sistema operacional é aberto, permitindo ao usuário escolher o nome e a pasta para salvar o arquivo.
    - **Múltiplos Formatos de Salvamento:** O usuário pode escolher salvar o conteúdo como:
        - **Texto Simples (.txt):** Padrão e mais recomendado para o conteúdo do `textarea`.
        - **PDF (.pdf):** O conteúdo do `textarea` é convertido e salvo como um documento PDF real, com fonte Helvetica, tamanho 12, e margens de 3cm (superior e esquerda) e 2cm (inferior e direita). O texto é automaticamente quebrado em múltiplas páginas, se necessário.
        - **HTML (.html/.htm):** O conteúdo é salvo como texto puro com a extensão HTML.
        - **JSON (.json):** O conteúdo é salvo como texto puro com a extensão JSON.
    - **Fallback de Compatibilidade:** Em navegadores que não suportam a API "Salvar como" nativa, o arquivo é baixado automaticamente como texto simples (.txt) com o nome padrão "nota.txt".
- **Link do Projeto no GitHub:** Um link discreto para o repositório do GitHub (https://github.com/denilsonbomjesus/freetext) foi adicionado no canto inferior direito da tela, fora da área de texto.
- **Tooltip no Botão Salvar:** Ao passar o mouse sobre o botão "Salvar TXT", uma dica de ferramenta ("Salvar como PDF, HTML, TXT ou JSON") é exibida, informando o usuário sobre as opções de formato de salvamento.