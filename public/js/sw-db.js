let db = new PouchDB("bdmensajes");
let dbPersonajes = new PouchDB("bdpersonajes");

function guardarMensaje( mensaje ){

    mensaje._id = new Date().toISOString();

    return db.put( mensaje )
        .then( resp => {
            //console.log("Se guardo en indexdb");

            self.registration.sync.register("nuevo-mensaje");

            const respuesta = { ok:true, offline: true};

            return new Response( JSON.stringify(respuesta) );
        })
        .catch( error => {
            console.log("Fallo al guardar", error);
        })

}
function guardarPersonaje( personaje ){

    personaje._id = new Date().toISOString();

    return dbPersonajes.put( personaje )
        .then( resp => {
            console.log("Se guardo en indexdb");

            self.registration.sync.register("nuevo-personaje");

            const respuesta = { ok:true, offline: true};

            return new Response( JSON.stringify(respuesta) );
        })
        .catch( error => {
            console.log("Fallo al guardar", error);
        })

}

function enviarPersonajes(){

    let personajes = []

    return dbPersonajes.allDocs( {include_docs : true} ).then( docs => {
        docs.rows.forEach(row => {
            const doc = row.doc;
            const prom = fetch("/api/personaje", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify( doc )
            })
            .then( resp => {
                return dbPersonajes.remove( doc );
            });

            personajes.push( prom );
        });
        return Promise.all( personajes );
    });

}
function enviarMensajes(){

    let mensajes = []

    return db.allDocs( {include_docs : true} ).then( docs => {
        docs.rows.forEach(row => {
            const doc = row.doc;
            const prom = fetch("/api", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify( doc )
            })
            .then( resp => {
                return db.remove( doc );
            });

            mensajes.push( prom );
        });
        return Promise.all( mensajes );
    });

}