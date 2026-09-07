# Setembro Amarelo FDG — Landing Page (Versão 1 / pasta "Site 2")

Landing page one-page, B2B, focada em pequenas e médias empresas.
Construída conforme o `relatorio_concorrencia.html` (Dossiê Estratégico FDG).

## Como abrir

Basta abrir `index.html` no navegador — não há build, framework ou dependência.
Único recurso externo: Google Fonts (Instrument Serif + Inter).

## Estrutura de arquivos

```
Site 2/
├── index.html
├── LEIA-ME.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/            (vazia — colocar aqui as imagens)
```

## Seções, na ordem do dossiê

| # | Seção do dossiê | Onde está |
|---|---|---|
| — | Barra de urgência + menu âncora | `.topbar` / `.header` |
| 1 | Hero (promessa B2B) | `#hero` |
| 2 | Contexto e urgência (a dor) | `#contexto` |
| 3 | Soluções e formatos | `#solucoes` |
| 4 | Diferenciais e metodologia | `#diferenciais` |
| 5 | Prova social e cases | `#prova` |
| 6 | Escassez + oferta final (formulário) | `#contato` |
| 7 | FAQ | `#faq` |
| 8 | Rodapé | `.footer` |

Todos os CTAs da página apontam para `#contato`. O formulário qualifica o lead
(porte da equipe, formato de interesse) e envia tudo formatado para o WhatsApp
comercial. O botão flutuante verde vai direto ao WhatsApp.

---

## ⚠️ O QUE PRECISA SER SUBSTITUÍDO ANTES DE PUBLICAR

### 1. WhatsApp (obrigatório — nada funciona sem isso)
`assets/js/main.js`, topo do arquivo:
```js
whatsapp: '5500000000000'   // 55 + DDD + número, só dígitos
```

### 2. Imagens
- **Foto do palestrante** — `#hero`, bloco `<!-- SUBSTITUIR -->`.
  Proporção 4:5, mínimo 900×1125px. Trocar a `div.photo__slot` por
  `<img src="assets/img/palestrante.jpg" alt="...">`.
  Conforme o dossiê: palestrante em palco corporativo ou líderes interagindo.
  **Evitar:** laço amarelo gigante, pessoas tristes, banco de imagens genérico.
- **Imagem de compartilhamento (OG)** — `assets/img/og-image.jpg`, 1200×630px.

### 3. Logos de clientes
`#prova`, dentro de `#marquee-track` → substituir cada
`<span class="logo-slot">Logo cliente</span>` por
`<img src="assets/img/logos/nome.svg" alt="Nome da empresa" height="40">`.
O JavaScript duplica o grupo sozinho para o carrossel rodar em loop.
Para PMEs, priorize logos de empresas de porte parecido — logo de multinacional
pode afastar o lead ("isso não é pro meu tamanho").

### 4. Depoimentos
`#prova`, os três blocos `<figure class="quote">`.
Os textos atuais são **ilustrativos, apenas para layout**. Substituir por
relatos reais e autorizados, com nome, cargo, empresa e nº de colaboradores.
Depois de substituir, **remover a `<p class="note note--center">** logo abaixo,
que avisa que os depoimentos são fictícios.

### 5. Dados institucionais
`.footer`: e-mail comercial, telefone, cidade/UF, razão social, CNPJ e os
links de Política de Privacidade e Termos de Uso (hoje `href="#"`).

### 6. Domínio e SEO
No `<head>`: `<link rel="canonical">`, `og:url`, `og:image` e as três
ocorrências de `https://www.exemplo.com.br/` no bloco JSON-LD.

### 7. Estatísticas — CONFERIR ANTES DE PUBLICAR
A seção `#contexto` cita: 472 mil afastamentos por transtornos mentais pelo
INSS em 2024, crescimento de +68% sobre 2023, e o retorno de R$ 4 para cada
R$ 1 investido (OMS). São dados públicos e amplamente divulgados, mas
**valide os números vigentes** e a redação sobre o prazo de fiscalização da
NR-1 com sua assessoria antes de ir ao ar. A nota de fontes está logo abaixo
dos números; ajuste-a junto.

---

## Funcionalidades implementadas

- Menu fixo com estado ao rolar, âncoras suaves e destaque da seção ativa
- Menu mobile lateral (fecha com Esc, clique fora ou ao escolher um link)
- Contagem regressiva até 30 de setembro (vira automaticamente para o ano
  seguinte quando a data passa) — na barra do topo e na seção de oferta
- Contadores numéricos animados ao entrar na tela
- Carrossel infinito de logos (pausa ao passar o mouse)
- Acordeão de FAQ acessível (`aria-expanded`, um aberto por vez)
- Formulário com validação, máscara de telefone BR, consentimento LGPD,
  honeypot anti-spam e envio para o WhatsApp
- Botão flutuante de WhatsApp e "voltar ao topo"
- Animações de entrada respeitando `prefers-reduced-motion`
- SEO: meta tags, Open Graph e JSON-LD (Organization + Service + FAQPage)
- Acessibilidade: skip link, HTML semântico, foco visível, labels e ARIA
- Responsivo de 320px a telas grandes; estilo de impressão incluído

### Analytics (opcional)
Se instalar o Google Analytics/Tag Manager, o envio do formulário já dispara
o evento `generate_lead` automaticamente (`main.js`, seção 11).

---

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| Ink | `#0B0F14` | Fundos escuros, hero, rodapé |
| Off-white | `#F7F5F1` | Seções claras alternadas |
| Âmbar | `#F2B705` | Botões, ícones, detalhes — **apenas acento** |
| Texto | `#111A22` / `#46525E` | Títulos / corpo |

Tipografia: **Instrument Serif** (títulos, editorial/premium) + **Inter**
(interface e corpo). Ritmo de seções alternando escuro → claro → branco →
escuro, com bastante respiro e fios de 1px em vez de bordas pesadas.

Conforme o dossiê, o amarelo aparece só como destaque: nada de página
inteiramente amarela ou visual infantil.
