# Ecos da Humanidade — versão Frontend

Esta versão foi convertida do projeto PHP para HTML + CSS + JavaScript puro.
Não existe servidor PHP nem banco de dados remoto. Usuários, sessões e fichas são mantidos no `localStorage`/`sessionStorage` do navegador.

## Como usar

Abra `index.html` em um navegador moderno. Para maior compatibilidade, também pode servir esta pasta com qualquer servidor estático simples.

## Login inicial do Mestre

- Usuário: `mestre`
- Senha: `EcosMestre2026`

A conta é criada automaticamente no primeiro acesso ao sistema. Depois de entrar, use **Painel → Criar usuário** para cadastrar os Jogadores ou outros Mestres.

## Estrutura

- `index.html` — página inicial
- `universo.html` — lore do universo
- `hunters.html` — regras e descrição dos Hunters
- `conceitos.html` — categorias, ameaça, influência e regeneração dos Conceitos
- `login.html`, `logout.html`, `painel.html`, `criar_usuario.html` — acesso e contas
- `criar_ficha.html`, `salvar_ficha.html`, `editar_ficha.html`, `apagar_ficha.html`, `ver_ficha.html`, `listar_fichas.html` — sistema de fichas
- `ecos_core.js` — banco local, sessão, permissões, navegação e funções compartilhadas
- `ecos_constants.js` — atributos, perícias, ranks, categorias, classes de ameaça e armas
- `ficha_forms.js` — formulários, repetidores, leitura de imagem e visualização de fichas
- `main.css` — visual
- `includes/` — versões JavaScript dos antigos arquivos compartilhados do PHP
- `data.json` — referência inicial dos dados; o funcionamento real usa o armazenamento do navegador

## Regras de acesso

- Mestre: vê, cria, edita e apaga todas as fichas; também pode criar usuários.
- Jogador: vê os Hunters vinculados ao próprio usuário e os Conceitos marcados como visíveis para jogadores.
- Conceitos ocultos continuam disponíveis somente para o Mestre até que a opção de visibilidade seja ativada.

## Imagens

As imagens selecionadas nas fichas são convertidas para Data URL e armazenadas junto da ficha no navegador. O limite aplicado é de 5 MB e os formatos aceitos são JPG, JPEG, PNG, GIF e WEBP.

## Importante

Como esta é uma versão somente frontend, não há proteção de servidor, sessão segura ou banco compartilhado entre computadores. O conteúdo fica no navegador em que foi cadastrado. Para uma campanha em vários dispositivos, seria necessário posteriormente conectar o frontend a um backend/API.
