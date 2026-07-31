# Painel de Presença por Culto

Ferramenta simples e sem custo para registrar presença por culto (adultos,
crianças, bebês, visitantes, decisões) e visualizar indicadores mensais —
pensada para equipes que ainda não têm essa funcionalidade na sua ferramenta
de gestão principal (ChMS, planilha, etc.) e precisam de algo rápido, fácil
de usar por qualquer pessoa da equipe, e sem depender de aprovação de
orçamento para uma nova ferramenta.

![status](https://img.shields.io/badge/status-est%C3%A1vel-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

## Por que este projeto existe

A maioria dos ChMS (Church Management Systems) trata "registro de presença
por culto" como recurso avançado — quando existe, geralmente vem depois de
funcionalidades de doação e comunicação. Times menores ou em transição de
ferramenta acabam recorrendo a WhatsApp, planilhas soltas ou memória mesmo.

Este projeto resolve isso com o mínimo de fricção possível:

- **Zero instalação** para quem só vai registrar dados (é uma página HTML).
- **Zero custo de infraestrutura** (usa Google Sheets como banco de dados).
- **Dado realmente compartilhado** entre qualquer pessoa que abra o link —
  não fica preso a um navegador ou dispositivo.

## Funcionalidades

- Registro de culto com adultos, crianças, bebês (total calculado
  automaticamente), visitantes e decisões por Jesus.
- Categorização por tipo de culto (configurável).
- Painel de indicadores mensais (totais, médias).
- Histórico com filtro por período, tipo de culto e busca por texto.
- Exportação do período filtrado em CSV.
- Gráficos de barras e distribuição (feitos em SVG/CSS puro — sem
  dependência de bibliotecas externas, ver [Decisões técnicas](#decisões-técnicas)).

## Arquitetura

```
┌─────────────────┐        fetch (JSON)        ┌───────────────────────┐
│   index.html     │ ─────────────────────────▶ │  Google Apps Script    │
│ (HTML/CSS/JS     │ ◀───────────────────────── │  (Web App, doGet/     │
│  puro, sem build)│                             │   doPost)              │
└─────────────────┘                             └───────────┬───────────┘
                                                              │
                                                              ▼
                                                    ┌───────────────────┐
                                                    │   Google Sheets    │
                                                    │  (banco de dados)  │
                                                    └───────────────────┘
```

Não há build step, framework ou dependência de Node — é só abrir o
`index.html` em qualquer navegador.

## Como configurar

### 1. Backend (Google Sheets + Apps Script)

1. Crie uma planilha nova no [Google Sheets](https://sheets.google.com).
2. Menu **Extensões → Apps Script**.
3. Apague o conteúdo padrão e cole o conteúdo de [`backend/apps-script-backend.gs`](backend/apps-script-backend.gs).
4. Salve.
5. **Implantar → Nova implantação**.
6. Tipo: **Aplicativo da Web**. Executar como: **Eu**. Quem tem acesso: **Qualquer pessoa**.
7. Implante e autorize as permissões pedidas.
8. Copie a URL gerada (termina em `/exec`).

> Sempre que editar o script depois, será preciso criar uma nova implantação
> (ou uma nova versão da implantação existente) para as mudanças valerem na
> URL publicada — isso é uma particularidade do Apps Script.

### 2. Frontend (`index.html`)

```bash
cp config.example.js config.js
```

Edite `config.js` e cole a URL do seu Web App:

```js
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/SEU_ID_AQUI/exec'
};
```

`config.js` está no `.gitignore` — ele nunca deve ser commitado, já que
contém a URL do seu backend específico.

### 3. Publicar/distribuir

Qualquer uma dessas opções funciona, porque é HTML/CSS/JS puro:

- Subir os arquivos (`index.html` + `config.js`) em qualquer hospedagem
  estática (GitHub Pages, Netlify, Vercel, Google Drive + extensão de
  hospedagem, etc.).
- Simplesmente compartilhar o arquivo `index.html` + `config.js` juntos
  por e-mail/Drive, para times pequenos.

## Personalização

- **Tipos de culto:** editar as `<option>` dentro do `<select id="r-tipo">`
  em `index.html` (e replicar as mesmas opções no `<select id="h-tipo">`
  do filtro de histórico).
- **Cores/identidade visual:** todas as cores usam variáveis CSS no `:root`
  (`--app-blue`, `--app-navy`, etc.) — trocar os valores lá já reflete em
  toda a interface.

## Decisões técnicas

- **Google Sheets como banco de dados**, em vez de um banco de dados
  "de verdade": para o volume de dados de uma igreja de pequeno/médio
  porte (poucos registros por semana), isso é suficiente, gratuito, e
  qualquer pessoa da equipe consegue abrir a planilha e entender o dado
  bruto sem precisar de conhecimento técnico. Trade-off consciente: não é
  a escolha certa se o volume de escrita crescer muito (Apps Script tem
  cotas diárias de execução).
- **Gráficos em SVG/CSS puro, sem Chart.js ou similar:** a primeira versão
  usava Chart.js via CDN, mas o carregamento de scripts externos não é
  garantido em todos os ambientes de execução (por exemplo, dentro de
  iframes sandboxed). Optamos por gráficos simples feitos à mão para
  eliminar essa dependência de rede por completo.
- **Sem build step/framework:** o objetivo era um artefato que qualquer
  pessoa da equipe (não só desenvolvedores) pudesse abrir e entender,
  e que pudesse ser hospedado em qualquer lugar sem pipeline de build.

## Limitações conhecidas

- Sem autenticação por usuário — qualquer pessoa com o link do arquivo e a
  URL do backend pode ler e escrever dados. Adequado para uso interno de
  equipe, não para dados sensíveis ou públicos.
- Google Apps Script tem cotas diárias de execução (generosas para o uso
  pretendido, mas existem).
- Sem esse controle de usuário, não há histórico de "quem editou o quê".

## Roadmap possível

- [ ] Autenticação simples (ex: senha de equipe compartilhada).
- [ ] Log de quem criou/editou cada registro.
- [ ] Suporte a múltiplas unidades/campi.
- [ ] Exportação também em Excel (.xlsx), além de CSV.

## Licença

[MIT](LICENSE) — use, copie, adapte livremente.
