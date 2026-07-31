/**
 * BACKEND DO PAINEL DE PRESENÇA POR CULTO — Nova Estação Church
 *
 * COMO INSTALAR:
 * 1. Crie uma planilha nova no Google Sheets (pode chamar de "Painel de Culto - Dados").
 * 2. Menu Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole todo este arquivo.
 * 4. Clique em "Salvar" (ícone de disquete).
 * 5. Clique em "Implantar" (Deploy) > "Nova implantação" (New deployment).
 * 6. Tipo: "Aplicativo da Web" (Web app).
 * 7. Executar como: "Eu" (Me).
 * 8. Quem tem acesso: "Qualquer pessoa" (Anyone).
 * 9. Clique em Implantar. Autorize as permissões pedidas (é a sua própria conta acessando sua própria planilha).
 * 10. Copie a URL gerada (termina em /exec) — essa é a URL que você vai colar no arquivo HTML do painel,
 *     na constante GAS_URL no topo do <script>.
 *
 * IMPORTANTE: sempre que você editar este script depois, é preciso criar uma "Nova implantação"
 * (ou gerenciar implantações > editar > nova versão) para as mudanças valerem na URL publicada.
 */

const SHEET_NAME = 'Registros';
const COLUNAS = ['id','data','tipo','adultos','criancas','bebes','total','visCulto','decisoes','obs'];

function getSheet(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if(!sheet){
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUNAS);
  }
  return sheet;
}

function doGet(e){
  return responder(listarRegistros());
}

function doPost(e){
  try{
    const body = JSON.parse(e.postData.contents);

    if(body.action === 'add'){
      adicionarRegistro(body.registro);
    } else if(body.action === 'delete'){
      excluirRegistro(body.id);
    }

    return responder(listarRegistros());
  }catch(err){
    return responder({ erro: String(err) });
  }
}

function listarRegistros(){
  const sheet = getSheet();
  const dados = sheet.getDataRange().getValues();
  if(dados.length < 2) return [];

  const headers = dados[0];
  const linhas = dados.slice(1);

  return linhas
    .filter(linha => linha[0] !== '' && linha[0] !== null)
    .map(linha => {
      const obj = {};
      headers.forEach((h,i)=> obj[h] = linha[i]);
      return obj;
    });
}

function adicionarRegistro(reg){
  const sheet = getSheet();
  sheet.appendRow(COLUNAS.map(col => reg[col] !== undefined ? reg[col] : ''));
}

function excluirRegistro(id){
  const sheet = getSheet();
  const dados = sheet.getDataRange().getValues();
  for(let i=1; i<dados.length; i++){
    if(String(dados[i][0]) === String(id)){
      sheet.deleteRow(i+1);
      break;
    }
  }
}

function responder(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
