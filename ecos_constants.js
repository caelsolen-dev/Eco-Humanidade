const ECOS_CONSTANTS = {
  ATTRS: ['FOR','RES','AGI','PER','INT','VON','INF'],
  ATTR_LABELS: {FOR:'Força',RES:'Resistência',AGI:'Agilidade',PER:'Percepção',INT:'Intelecto',VON:'Vontade',INF:'Influência'},
  PERICIAS: ['Atletismo','Acrobacia','Combate','Furtividade','Investigação','Medicina','Pontaria','Persuasão','Intimidação','Sobrevivência','Tecnologia','Conhecimento'],
  RANKS: ['Novato','Veterano','Elite','Lendário'],
  CATEGORIAS: ['Nacional','Social','Civilizacional','Cultural','Utensílio'],
  CLASSES_AMEACA: ['E','D','C','B','A','S'],
  ARMAS: [
    {nome:'Punho',dano:'1d4'},{nome:'Faca',dano:'1d6'},{nome:'Espada',dano:'1d8'},
    {nome:'Machado',dano:'1d10'},{nome:'Pistola',dano:'1d8'},{nome:'Rifle',dano:'1d10'},
    {nome:'Arma pesada',dano:'1d12'},{nome:'Personalizada',dano:''}
  ],
  REPEATER_FIELDS: {
    contratos:[['conceito','Conceito','text'],['preco','Preço','text'],['beneficios','Benefícios / habilidades concedidas','textarea']],
    tecnicas:[['nome','Nome','text'],['descricao','Descrição','textarea']],
    poderes:[['nome','Nome','text'],['descricao','Descrição','textarea']],
    fraquezas:[['nome','Nome','text'],['descricao','Por que enfraquece (relação conceitual)','textarea']],
    resistencias:[['nome','Nome','text'],['descricao','Descrição','textarea']],
    absorvidos:[['nome','Conceito absorvido','text'],['detalhe','O que foi incorporado','textarea']],
    itens:[['nome','Item','text']]
  }
};
window.ECOS_CONSTANTS = ECOS_CONSTANTS;
