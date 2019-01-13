// variable et constante globales
var clients = [], OM = "ORANGE MONEY"


//------------------------ nom et prenom             téléphone    code    argent  credit
clients.push(creerClient("Souleymane Kenda Sall",   "779990011", "SKS00", 155000, 2327))
clients.push(creerClient("Bechir Ba",               "768882233", "BB00",  100000, 1343))
clients.push(creerClient("Khadi Diallo",            "776663344", "KD00",  200000, 2009))
clients.push(creerClient("Kevin Touvi",             "785554466", "KT00",  320000, 410))
clients.push(creerClient("Diafra Soumare",          "764445577", "DS00",  630000, 135))
clients.push(creerClient("Amina Sow",               "773335588", "AS00",  15000,  4000))
clients.push(creerClient("Emanuel Ngom",            "782221199", "EN00",  130000, 345))
clients.push(creerClient("Brahim Mehdi",            "773224455", "BM00",  400000, 1599))
clients.push(creerClient("Ramata Diop",             "768301338", "RD00",  90000,  0))
clients.push(creerClient("Moussa Camara",           "768941634", "MC00",  240000, 1300))

/**
 * Fonction principale
 */
function main()
{
    var client = null
    while(!(client = connexion())) {
        alert('Le numéro de téléphone ou le mot de passe est incorrecte')
        if(client == -1)
            break
    }

    if(client == -1)
        return

    var terminer = false
    while(!terminer) {
        var message = ""
            //message = "         ORANGE MONEY\n"
            //message += "-----------------------------------------\n"
            message += "Bonjour " + client.nom + ", Que pouvons-nous faire pour vous?\n\n"
            message += "1. Solde de mes comptes\n"
            message += "2. Transfert d'argent / credit\n"
            message += "3. Achat Crédit\n"
            message += "4. Changer de code secret\n"
            message += "5. Quitter\n"
            message += "Entrez votre choix"

        rep = 0
        while(rep > 5 || rep < 1) {
            rep = parseInt(prompt(message)) || null

            if(!rep) break

            if(rep > 5 || rep < 1)
                alert("Choix inconnu")
        }

        switch(rep) {
            case 1:
                afficherSlode(client)
                break
            case 2:
                transfert(client)
                break
            case 3:
                achatCredit(client)
                break
            case 4:
                changerCode(client)
                break
            default:
                terminer = true
                break
        }
    }
}


/**
 * Methode permettant de creer un objet Client avec les proprietes nom, tel, etc.
 * @param {string} nom Le nom du client
 * @param {string} tel son numéro de téléphone
 * @param {string} code son mot de passe
 * @param {number} argent la somme qu'il possede en banque
 * @param {number} credit son credit
 * @return {Client} Un objet client
 */
function creerClient(nom, tel, code, argent, credit)
{
    return {
        nom: nom,
        tel: tel,
        code: code,
        argent: argent,
        credit: credit
    }
}

/**
 * Fonction gerant l'authentification d'un utilisateur
 * @return mixed:
 *      - S'il y a une correspondance numéro de téléphone / code secret, on renvoie cet objet client
 *      - null, Sinon
 */
function connexion()
{
    u_tel = prompt('Entrez votre numéro de téléphone')

    if(null === u_tel)
        return -1

    u_code = prompt("Entrez votre code secret")

    if(null === u_code)
        return -1

    for(client of clients) {
        if(client.tel == u_tel && client.code == u_code)
            return client
    }
    return null
}


/**
 * Affiche les soldes d'un client
 * @param {Client} client
 */
function afficherSlode(client)
{
    var message = "Vous avez " + client.argent + "Fcfa dans votre compte en banque.\n"
        message += "Et votre credit global est de " + client.credit + "Fcfa.\n\n"
        message += "- " + OM
    alert(message)
}

/**
 * Gere le transfert d'argent et de credit.
 * Cette fonction appelle transfertArgent ou transfertCredit en fonction du choix de l'utilisateur
 * @param {Object: Client} client
 */
function transfert(client)
{
    annuler = false
    while(!annuler) {
        var message = "Service de transfert " + OM + "\n\n"
            message += "Quel type de transfert voulez-vous effectuer ?\n"
            message += "1. Transfert d'argent\n"
            message += "2. Transfert de credit\n\n"
            message += "Entrez votre choix"

        var type = question(message)

        if(type === null)
            annuler = true
        else if (type == "1")
            return transfertArgent(client)
        else if(type == "2")
            return transfertCredit(client)
        else
            alert("Choix non disponible")
    }
}

/**
 * Gere le transfert de credit.
 * @param {Object: Client} client
 */
function transfertCredit(client)
{
    var message = "Vous allez faire un transfert de credit.\n"
        message += "Entrez le numéro du destinataire"

    if(!(tel = question(message)))
        return operationAnnulee()

    if(!(somme = question("Entrez le montant que vous voulez envoyer")))
        return operationAnnulee()

    if(!verifierCode(client))
        return operationAnnulee()

    if(confirm("Confirmation:\nVous allez envoyer une somme de " + somme + "Fcfa de crédit au " + tel + ".")) {
        var i_dest = clientParTel(tel)

        if(!i_dest)
            return echec("Le numéro du destinataire est introuvable.")

        if(client.credit < somme)
            return echec("Vous n'avez pas assez de credit pour effectuer cette operation.")

        clients[clientParTel(client.tel)].credit -= somme
        clients[i_dest].credit += somme

        message = "Opération reussi!\n"
        message += "Vous avez envoyé " + somme + "Fcfa de credit au " + tel + "."
        alert(message)
        return true
    }
}


/**
 * Gere le transfert d'argent'.
 * @param {Object: Client} client
 */
function transfertArgent(client)
{
    var message = "Vous allez faire un transfert d'argent.\n"
        message += "Entrez le numéro du destinataire"

    if(!(tel = question(message)))
        return operationAnnulee()

    if(!(somme = question("Entrez la somme que vous voulez envoyer")))
        return operationAnnulee()

    if(!verifierCode(client))
        return operationAnnulee()

    if(confirm("Confirmation:\nVous allez envoyer une somme de " + somme + "Fcfa au " + tel + ".")) {
        var i_dest = clientParTel(tel)
        somme = parseInt(somme)

        if(!i_dest)
            return echec("Le numéro du destinataire est introuvable.")

        if(client.argent < somme)
            return echec("Vous n'avez pas assez d'argent pour effectuer cette opération.")

        clients[clientParTel(client.tel)].argent -= somme
        clients[i_dest].argent += somme

        message = "Opération reussi!\n"
        message += "Vous avez envoyé " + somme + "Fcfa au " + tel + "."
        alert(message)
        return true
    }
}


function achatCredit(client)
{
    var message = "Achat de crédit\n"
        message += "Entrez le montant"

    if(!(montant = question(message)))
        return operationAnnulee()

    if(!verifierCode(client))
        return operationAnnulee()

    if(confirm("Confirmation:\nVous allez achetr " + montant + " Fcfa de credit.")) {
        montant = parseInt(montant)

        if(client.argent < montant)
            return echec("Vous n'avez pas assez d'argent pour effectuer cette opération.")

        clients[clientParTel(client.tel)].argent -= montant
        clients[clientParTel(client.tel)].credit += montant

        message = "Opération reussi!\n"
        message += "Vous avez achetr " + montant + " Fcfa de crédit."
        alert(message)
        return true
      }
}


function changerCode(client)
{
    code = question("Changement de code\n\nEntrez l'ancien code")

    if(code === null)
        return operationAnnulee()

    if(client.code != code)
        return echec("Mot de passe incorrecte.")

    if(!(nouveauCode = question("Entrez le nouveau code")))
        return operationAnnulee()

    if(!(nouveauCodeConfirm = question("Confirmez le nouveau code")))
        return operationAnnulee()

    if(nouveauCode != nouveauCodeConfirm)
        return echec("Les deux mots de passes ne correspondent pas.")

    clients[clientParTel(client.tel)].code = nouveauCode
    alert("Le code a été modifié avec succes.")
    return true
}

/**
 * Verifie qu'un client est autorisé d'access
 */
function verifierCode(client)
{
    var code = ""
    while(code != client.code) {
        if(!(code = question("Entrez votre mot de passe")))
            return false

        if(code != client.code)
            alert("Le mot de passe est invalide.")
    }
    return true
}


/**
 * Recherche un client a partir d'un numéro de téléphone
 * @param {string} le numéro de téléphone du client recherche
 * @return {mixed} false|Client: S'il y a correspondance, on retourne le client trouve, sinon on renvoie false
 */
function clientParTel(tel)
{
    for(i in clients) {
        if(clients[i].tel == tel)
            return i
    }
    return false
}


/**
 * Fonction promp personnalisee
 * @param {string} message
 * @return mixed:
 *    - {string}: La reponse de l'utilisateur
 *    - {null}: Si l'utilisateur clique sur annuler
 */
function question(message)
{
    rep = prompt(message)

    if(rep === null) {
        return operationAnnulee()
    }
    return rep
}


/**
 * Raccourci pour renvoyer un nessage d'erreur
 * @return false
 */
function operationAnnulee()
{
    return echec("Opération annulée.")
}


/**
 * Fonction affichant un message d'erreur
 * @param {string} message: Le message a afficher
 * @return {bool} false
 */
function echec(message)
{
    alert(message)
    return false
}
