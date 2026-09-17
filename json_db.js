// Camada de compatibilidade do antigo json_db.php.
// O banco funcional agora é o localStorage e é exposto por Ecos.
window.EcosDB={loadDB:Ecos.loadDB,saveDB:Ecos.saveDB,nextUserId:Ecos.nextUserId,nextFichaCodigo:Ecos.nextFichaCodigo,findFichaIndex:Ecos.findFichaIndex,findUsuarioById:(db,id)=>db.usuarios.find(u=>String(u.id)===String(id))||null};
