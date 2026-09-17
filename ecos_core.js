(function(){
  const DB_KEY='ecos_db';
  const SESSION_KEY='ecos_current_user';
  const MASTER_USER='mestre';
  const MASTER_PASSWORD='EcosMestre2026';
  const MASTER_HASH='sha256$615149d85cea65fbd4f0a50efb290059231663d2f51ad261de7a1f9385145019';

  function emptyDB(){
    return {usuarios:[],fichas:[]};
  }

  function normalizeDB(db){
    if(!db||typeof db!=='object'||Array.isArray(db)){
      throw new Error('Banco local inválido.');
    }

    if(!Array.isArray(db.usuarios)||!Array.isArray(db.fichas)){
      throw new Error('Estrutura do banco local inválida. Os dados existentes não foram apagados.');
    }

    return {
      usuarios:db.usuarios,
      fichas:db.fichas
    };
  }

  function hashPassword(password){
    return crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password)
    ).then(buf=>'sha256$'+Array.from(new Uint8Array(buf))
      .map(b=>b.toString(16).padStart(2,'0')).join(''));
  }

  function seedDB(){
    const db=emptyDB();

    db.usuarios.push({
      id:1,
      usuario:MASTER_USER,
      senha:MASTER_HASH,
      tipo:'admin'
    });

    saveDB(db);
    return db;
  }

  function loadDB(){
    const raw=localStorage.getItem(DB_KEY);

    // Primeiro acesso: cria o banco inicial.
    if(raw===null){
      return seedDB();
    }

    let parsed;

    try{
      parsed=JSON.parse(raw);
    }catch(e){
      // NUNCA substituir o banco por um vazio quando o JSON estiver inválido.
      console.error(
        'Ecos: não foi possível ler ecos_db. O conteúdo original foi preservado.',
        e
      );

      throw new Error(
        'O banco local está inválido. Nenhum dado foi apagado.'
      );
    }

    let db;

    try{
      db=normalizeDB(parsed);
    }catch(e){
      console.error(
        'Ecos: estrutura do banco inválida. O conteúdo original foi preservado.',
        e
      );

      throw e;
    }

    // Se o Mestre não existir, adiciona somente o Mestre.
    // As fichas existentes continuam intactas.
    if(!db.usuarios.some(u=>u&&u.usuario===MASTER_USER)){
      db.usuarios.push({
        id:nextUserId(db),
        usuario:MASTER_USER,
        senha:MASTER_HASH,
        tipo:'admin'
      });

      saveDB(db);
    }else{
      const mestre=db.usuarios.find(
        u=>u&&u.usuario===MASTER_USER
      );

      // Migração da senha antiga em bcrypt, se existir.
      if(
        mestre&&
        typeof mestre.senha==='string'&&
        mestre.senha.startsWith('$2y$')
      ){
        mestre.senha=MASTER_HASH;
        mestre.tipo='admin';
        saveDB(db);
      }
    }

    return db;
  }

  function saveDB(db){
    const normalized=normalizeDB(db);
    const serialized=JSON.stringify(normalized);

    try{
      localStorage.setItem(DB_KEY,serialized);
    }catch(e){
      console.error(
        'Ecos: falha ao salvar o banco local.',
        e
      );

      if(
        e&&(
          e.name==='QuotaExceededError'||
          e.code===22||
          e.code===1014
        )
      ){
        throw new Error(
          'Não foi possível salvar a ficha porque o armazenamento do navegador está cheio. Remova imagens muito grandes ou libere espaço.'
        );
      }

      throw new Error(
        'Não foi possível salvar os dados no navegador.'
      );
    }
  }

  function getCurrentUser(){
    try{
      return JSON.parse(
        sessionStorage.getItem(SESSION_KEY)||'null'
      );
    }catch(e){
      return null;
    }
  }

  function setCurrentUser(user){
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id:user.id,
        usuario:user.usuario,
        tipo:user.tipo||'player'
      })
    );
  }

  function logout(){
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('ecos_ficha_pendente');
  }

  function requireLogin(){
    const u=getCurrentUser();

    if(!u){
      location.href='login.html';
      return null;
    }

    return u;
  }

  function requireAdmin(){
    const u=getCurrentUser();

    if(!u||u.tipo!=='admin'){
      location.href='login.html';
      return null;
    }

    return u;
  }

  function nextUserId(db){
    return Math.max(
      0,
      ...db.usuarios.map(
        u=>Number(u&&u.id)||0
      )
    )+1;
  }

  function nextFichaCodigo(db,tipo){
    const prefix=
      tipo==='conceito'
        ?'CONCEITO'
        :'HUNTER';

    let code;

    do{
      const d=new Date();

      const stamp=[
        d.getFullYear(),
        String(d.getMonth()+1).padStart(2,'0'),
        String(d.getDate()).padStart(2,'0'),
        String(d.getHours()).padStart(2,'0'),
        String(d.getMinutes()).padStart(2,'0'),
        String(d.getSeconds()).padStart(2,'0'),
        String(d.getMilliseconds()).padStart(3,'0')
      ].join('');

      code=
        `${prefix}-${stamp}-${Math.floor(1000+Math.random()*9000)}`;

    }while(
      db.fichas.some(
        f=>f&&f.codigo===code
      )
    );

    return code;
  }

  function findFicha(db,codigo){
    return db.fichas.find(
      f=>f&&f.codigo===codigo
    )||null;
  }

  function findFichaIndex(db,codigo){
    const i=db.fichas.findIndex(
      f=>f&&f.codigo===codigo
    );

    return i<0?null:i;
  }

  function canViewFicha(f,user){
    if(!f||!user)return false;

    if(user.tipo==='admin')return true;

    if(f.tipo==='hunter'){
      return f.usuario_id!=null&&
        String(f.usuario_id)===String(user.id);
    }

    return !!f.visivel_jogadores;
  }

  function esc(v){
    return String(v??'').replace(
      /[&<>"']/g,
      c=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
      }[c])
    );
  }

  function nav(active){
    const u=getCurrentUser();

    const links=[
      ['index.html','Início','inicio'],
      ['universo.html','Universo','universo'],
      ['hunters.html','Hunters','hunters'],
      ['conceitos.html','Conceitos','conceitos']
    ];

    let html=links.map(
      ([href,label,key])=>
        `<a href="${href}"${active===key?' class="active"':''}>${label}</a>`
    ).join('');

    if(u){
      html+=
        `<a href="painel.html"${active==='painel'?' class="active"':''}>Painel</a>`+
        `<a href="logout.html">Sair</a>`;
    }else{
      html+='<a href="login.html" class="login-btn">ENTRAR</a>';
    }

    const el=document.getElementById('site-nav');

    if(el){
      el.innerHTML=html;
    }

    const brand=document.getElementById('site-brand');

    if(brand){
      brand.href='index.html';
    }
  }

  function shell(title,active){
    document.title=`${title} — Hunter Association`;
    nav(active);
  }

  function footer(){
    const f=document.getElementById('site-footer');

    if(f){
      f.innerHTML=
        'ECOS DA HUMANIDADE © 2026 • HUNTER ASSOCIATION';
    }
  }

  window.Ecos={
    DB_KEY,
    MASTER_USER,
    MASTER_PASSWORD,
    emptyDB,
    normalizeDB,
    hashPassword,
    seedDB,
    loadDB,
    saveDB,
    getCurrentUser,
    setCurrentUser,
    logout,
    requireLogin,
    requireAdmin,
    nextUserId,
    nextFichaCodigo,
    findFicha,
    findFichaIndex,
    canViewFicha,
    esc,
    nav,
    shell,
    footer
  };
})();
