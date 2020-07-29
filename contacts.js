const urlBase = 'https://front-end-5a452.firebaseio.com/contacts.json'
const nameField = document.querySelector('input[name=name]')
const firstNameField = document.querySelector('input[name=firstname]')
const phoneField = document.querySelector('input[name=phone]')
const emailField = document.querySelector('input[name=email]')
const adressField = document.querySelector('input[name=adress]')
const zipcodeField = document.querySelector('input[name=zipcode]')
const cityField = document.querySelector('input[name=city]')
const searchField = document.querySelector('input[name=search]')

const btnAdd = document.querySelector('.add-contact')
const btnSearch = document.querySelector('.search-contact')
const contactForm = document.querySelector('.form')


btnAdd.addEventListener('click', function(e) {
    e.preventDefault;

    axios.post(urlBase, {
        'name' : nameField.value,
        'firstname' : firstNameField.value,
        'phone' : phoneField.value,
        'email' : emailField.value,
        'adress' : adressField.value,
        'zipcode' : zipcodeField.value,
        'city' : cityField.value
    })
    .then(
        resp => {
            builtContactsList()
        }
    )
})




function builtContactsList() {

    let contacts = []

    axios.get('https://front-end-5a452.firebaseio.com/contacts.json')
        .then(resp => {
            document.querySelector('.list-group').innerHTML= ''
            
            for(contact in resp.data) {

            resp.data[contact].key = contact   // on assigne la clé automatique à un nouveau paramètre "key"
            contacts.push(resp.data[contact])
            let btnModify = document.createElement('button')
            btnModify.classList.add('btn','btn-secondary','modify')
            btnModify.setAttribute('data-key', resp.data[contact].key )
            btnModify.innerText = 'Modifier'
            let li = document.createElement('li')
            li.classList.add('list-group-item')
            let spanName = document.createElement('span')
            let linkPhone = document.createElement('a')
            let linkEmail = document.createElement('a')
            let link = 'mailto:' + resp.data[contact].email
            linkEmail.setAttribute('href', link )
            let linkAdress = document.createElement('a')
            spanName.innerHTML = resp.data[contact].firstname + ' ' + resp.data[contact].name
            linkPhone.innerHTML = resp.data[contact].phone
            linkEmail.innerHTML = resp.data[contact].email
            linkAdress.innerHTML = resp.data[contact].adress + ' - ' + resp.data[contact].zipcode + ' ' + resp.data[contact].city
            li.innerHTML = spanName.outerHTML + linkPhone.outerHTML + linkEmail.outerHTML + linkAdress.outerHTML + btnModify.outerHTML

            document.querySelector('.list-group').appendChild(li)

            li.lastChild.addEventListener('click', function(e) {

                let fields = document.querySelectorAll('input')
                let contactKey = e.target.dataset.key
                let hiddenField = document.querySelector('input[type=hidden]')
                hiddenField.setAttribute('id', contactKey )
                console.log(contactKey)
                console.log(hiddenField)

                fields.forEach(function(field){
                    
                    nameField.value = resp.data[contactKey].name
                    firstNameField.value = resp.data[contactKey].firstname
                    phoneField.value = resp.data[contactKey].phone
                    emailField.value = resp.data[contactKey].email
                    adressField.value = resp.data[contactKey].adress
                    zipcodeField.value = resp.data[contactKey].zipcode
                    cityField.value = resp.data[contactKey].city
                })

                if( document.querySelector('.delete-contact') == null) {

                    btnAdd.classList.add('inactive')
                    contactForm.classList.toggle('fixed')
                    let btnDelete = document.createElement('button')
                    let btnCancel = document.createElement('button')
                    //let btnSave = document.querySelector('.add-contact')
                    let btnSave = document.createElement('button')
                    //btnSave.classList.toggle('add-contact')
                    btnSave.classList.add('btn','btn-primary','save-contact')
                    btnDelete.innerText = 'Supprimer'
                    btnCancel.innerText = 'Annuler'
                    btnDelete.classList.add('btn','btn-danger','delete-contact')
                    btnCancel.classList.add('btn','btn-secondary','cancel')
                    document.querySelector('.form__col').appendChild(btnSave)
                    document.querySelector('.form__col').appendChild(btnCancel)
                    document.querySelector('.form__col').appendChild(btnDelete)
                    btnSave.innerText = 'Enregistrer'
                    
                    const jsonTarget = 'https://front-end-5a452.firebaseio.com/contacts/' + contactKey + '.json'
                    
                    btnCancel.onclick = function() { location.reload() }
                    btnDelete.onclick = function() 
                    { 
                        e.preventDefault;

                        axios.delete(jsonTarget)
                        .then( (response) => {     
                            window.location.reload()
                        })
                    }
                    btnSave.onclick = function() { 

                        e.preventDefault;
                        
                        axios({
                            method: 'put',
                            url: jsonTarget,          // On récupère l'url json
                            data: {
                                'name' : nameField.value,
                                'firstname' : firstNameField.value,
                                'phone' : phoneField.value,
                                'email' : emailField.value,
                                'adress' : adressField.value,
                                'zipcode' : zipcodeField.value,
                                'city' : cityField.value
                             },
                            })
                        .then( (response) => {     
                            window.location.reload()
                         })
                    }
                }
                 
            })
            let term = searchField.value
            if( resp.data[contact].name = term) {

                axios({
                    method: 'put',
                    url: urlBase,          // On récupère l'url json
                    data: {
                        "name" : term,   // On récupère les données renseignée dans le champ
                        "search" : 'true'      // On renseigne un paramètre supplémentaire
                        }
                    })

            }
            btnSearch.addEventListener('click', function(e) {
                console.log(e.target)  

                console.log(resp.data[contact].search)

            })
        }  
        
    })
}

builtContactsList()