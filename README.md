# USEC Vesper

**Guia de edição:** abre `ajuda.html` no site ou visita https://usecvesper.github.io/ajuda.html . O editor está em https://usecvesper.github.io/editor.html .

Site estático em português para a equipa de airsoft USEC Vesper. Não necessita de instalação, servidor, base de dados ou subscrições.

## Publicar pela primeira vez

1. Carrega **o conteúdo desta pasta**, incluindo `.github/`, na raiz do repositório `Usecvesper/Usecvesper.github.io`, no ramo `main`.
2. No GitHub, abre **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. No separador **Actions**, executa **Publicar site no GitHub Pages → Run workflow**, se necessário.
4. O endereço esperado é https://usecvesper.github.io/ . Só estará disponível depois de uma publicação bem-sucedida.

Alternativa sem Actions: em Settings → Pages seleciona **Deploy from a branch → main → / (root)** e guarda. Todos os caminhos do site são relativos e funcionam no subdiretório do projeto.

## Atualizar sem editar código

1. Abre `editor.html` no site, ou localmente no navegador.
2. Altera os textos, o estado de recrutamento, os membros, as fotografias e as perguntas frequentes.
3. Usa **Pré-visualizar** para verificar o resultado.
4. Clica em **Exportar content.js**.
5. No GitHub, carrega o novo `content.js` na raiz do repositório e confirma **Commit changes**.

O editor é uma ferramenta de preparação de ficheiros. Não tem uma sessão de administração nem publica diretamente. Qualquer visitante pode usar o editor, mas apenas pessoas com acesso de escrita ao repositório podem publicar. Nunca coloques dados privados, palavras-passe ou tokens neste projeto público.

**Guardar rascunho** guarda apenas no navegador atual; **Cópia JSON** cria uma cópia transferível que pode ser recuperada em **Importar JSON**. Guarda uma cópia antes de mudar de computador ou limpar os dados do navegador. Em alguns navegadores o modo `file://` limita o armazenamento e a pré-visualização; nesse caso usa um servidor local (`python3 -m http.server 8000`) ou o site publicado.

## Páginas e álbuns locais

O site tem páginas separadas: início, equipa, membros, fotografias, perguntas frequentes e contactos. Cada álbum tem a sua própria página. Não existem ligações públicas para o WordPress.

Os sete álbuns atualmente publicados usam as fotografias carregadas pela equipa. Podes acrescentar mais imagens nas mesmas pastas quando quiseres.

### Adicionar fotografias

1. Carrega as imagens na pasta correspondente abaixo, mantendo a estrutura `assets/albums/nome-da-pasta/`.
2. Confirma **Commit changes** no ramo `main`.
3. A publicação por GitHub Actions deteta automaticamente as imagens e apresenta-as no álbum, sem editar código. Aceita JPG, JPEG, PNG, WebP, AVIF e GIF; ordena pelos nomes dos ficheiros. Usa `001.jpg`, `002.jpg`, etc. se quiseres definir a ordem.

| Álbum | Pasta para carregar fotografias |
| --- | --- |
| OSOT — Souselas · 03/12/2023 | `assets/albums/osot-03-12-2023/` |
| OSOT — Souselas · 08/10/2023 | `assets/albums/osot-08-10-2023/` |
| OSOT — Souselas · 01/10/2023 | `assets/albums/osot-01-10-2023/` |
| OSOT — Souselas · 11/06/2023 | `assets/albums/osot-11-06-2023/` |
| OSOT — Souselas · 28/05/2023 | `assets/albums/osot-28-05-2023/` |
| OSOT — Souselas · 15/05/2023 | `assets/albums/osot-15-05-2023/` |
| 239EAT — Ribeira de Frades · 07/05/2023 | `assets/albums/239eat-07-05-2023/` |

Para criar um álbum novo, adiciona o registo no editor e indica em **Nome da pasta do álbum** um identificador único sem espaços (ex.: `coimbra-2026-10-18`). Carrega as imagens em `assets/albums/coimbra-2026-10-18/` e exporta o novo `content.js`. As capas continuam a ser configuradas no campo **Fotografia**.

O ficheiro `albums.json` é gerado por `scripts/build-albums.py` durante a publicação. Para testar localmente, executa esse script e `python3 -m http.server 8000` na raiz do projeto. Se usares publicação diretamente de um ramo, gera e carrega também o ficheiro `albums.json` a cada atualização das fotografias.

## Conteúdo atual e universo narrativo

O site apresenta nove membros. Os lugares 8 e 9 aguardam nomes/callsigns; o membro 8 usa `assets/member-placeholder.svg`, enquanto o 9 usa a fotografia já carregada em `assets/member-9.png`. Podes mudar os nomes e os caminhos no editor.

Estão apresentados apenas os sete álbuns com fotografias carregadas pela equipa, num total inicial de 66 imagens. As pastas sem imagens foram mantidas no repositório para uso futuro, mas não aparecem na galeria. Para publicar uma dessas pastas mais tarde, adiciona o álbum no editor.

A lore e as nove biografias foram reescritas para o universo ficcional Vesper. O site identifica estas histórias como ficção de airsoft; não são alegações de historial militar real. Podes editar o título, a introdução, a história e o lema em **Universo Vesper / Lore**. As informações da equipa continuam separadas da ficção.

O arquivo `original-content.json` conserva a primeira referência para consulta e não é incluído na publicação. O site público não depende do WordPress nem contém ligações para lá.

## Estrutura

- `index.html`, `style.css`, `app.js`: apresentação e interações.
- `content.js`: todos os textos editáveis, contactos, membros, fotografias e FAQ.
- `editor.html`, `editor.css`, `editor.js`: editor visual e exportação.
- `assets/`: imagens locais, independentes do WordPress.
- `.github/workflows/pages.yml`: publicação automática.

As fontes Barlow e Barlow Condensed são carregadas a partir de Google Fonts, com alternativas do sistema se estiverem indisponíveis. Não existem rastreadores, anúncios nem formulários que recolham dados. Os botões de contacto abrem as redes sociais.

## PT / EN e arquivo da unidade

O português continua a ser a entrada principal. O botão ENG abre a mesma página em inglês, mantendo o álbum selecionado e o modo de pré-visualização. O botão PT regressa à página portuguesa. As páginas inglesas têm o sufixo `.en.html`.

`content.js` contém ambos os idiomas: os campos terminados em `En` guardam a tradução inglesa. O editor apresenta os pares PT/EN na mesma ficha. Callsigns, caminhos de imagens e pastas dos álbuns são partilhados. Os campos traduzidos ficam ligados à própria ficha, por isso a ordem dos membros ou álbuns pode ser alterada sem trocar as traduções.

A nova página `arquivo.html` reúne a história (Coimbra / 2022, a antiga base de Souselas e a atual unidade itinerante), BOTOKUH e JACK enquanto antigos membros que saíram da equipa, e transmissões narrativas ambientadas no universo de Tarkov. As secções História da unidade, Antigos membros e Transmissões são editáveis nos dois idiomas. As saídas de BOTOKUH e JACK não são apresentadas como mortes.

As páginas HTML definem a interface de cada idioma. Se alterares títulos fixos ou botões diretamente no HTML, atualiza também o ficheiro `.en.html` correspondente. A aparência partilhada está em `style.css`; as interações nos dois idiomas estão em `app.js` e `editor.js`.

## USEC / operações externas — revisão da premissa

A Vesper faz parte da USEC e opera noutro teatro, sem estar destacada em Tarkov. O enquadramento das páginas, os dossiers e as perguntas frequentes refletem essa premissa de roleplay. O histórico refere Coimbra / 2022, Souselas e a estrutura móvel atual. As saídas anteriores não têm uma secção de destaque no site; a referência fica integrada no histórico.

A página inicial volta a usar uma fotografia a ocupar toda a abertura, com um painel de destacamento sobre a imagem. Tem cartões fotográficos de contratos, números do arquivo e retratos de operadores. O arquivo inclui seis dossiers narrativos, com resumo, estado e relato expansível. A página da equipa inclui três entradas de doutrina operacional.

No editor, os dossiers estão em Transmissões, com código, estado, título, resumo, relato e fotografia. A Doutrina do destacamento tem a sua própria secção. Todos os campos narrativos têm pares PT/EN. As histórias dos contratos são construções narrativas para este universo do destacamento.

## Informação real e contexto narrativo

As perguntas frequentes conservam as dez perguntas e respostas reais originais da equipa, com tradução fiel para inglês. Esta secção não deve ser reescrita como ficção nem adotar a hierarquia ou os contratos do roleplay. O resto do site mantém o enquadramento narrativo.

Souselas foi onde a equipa começou a jogar, num campo que não lhe pertencia. Não foi uma base, oficina ou instalação propriedade da Vesper. As referências no histórico e nas biografias refletem essa distinção.


## Estatísticas e exclusão do administrador

A integração GoatCounter está preparada mas inativa até configurar uma conta. Em app.js, na função initialiseMetrics, definir endpoint com o URL https://CODIGO.goatcounter.com/count da conta verificada. Nunca colocar palavras-passe ou chaves privadas no repositório. O painel de estatísticas usa o login da conta GoatCounter.

O link pessoal de exclusão usa um fragmento aleatório, verificado por SHA-256. Guarda apenas a preferência de exclusão no localStorage deste site. Abrir uma vez em cada navegador/dispositivo; repetir se apagar os dados do navegador. O link não concede acesso administrativo nem acesso ao painel. O token original não é guardado no código. Editor, ajuda e pré-visualizações são excluídos. O caminho do álbum é conservado nas métricas; parâmetros de cache e fragmentos do arquivo são ignorados.
