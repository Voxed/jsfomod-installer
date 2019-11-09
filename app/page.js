const { ipcRenderer } = require('electron')

function next() {
    const selections = []
    Array.from(document.querySelectorAll('.option'))
        .filter(o => o.querySelector('input').checked).forEach(o => {
            selections.push([
                parseInt(o.parentElement.parentElement
                    .getAttribute('data-index')),
                parseInt(o.getAttribute('data-index'))])
        })
    ipcRenderer.send('next', selections)
}

function previous() {
    ipcRenderer.send('previous')
}

function validate() {
    let success = true
    Array.from(document.querySelectorAll('.group')).forEach(group => {
        const options = Array.from(group.querySelectorAll('.option'))
        const checkedOptions = options.filter(
            o => o.querySelector('input').checked)
        if (group.getAttribute('data-type') === 'SelectAll')
            if (checkedOptions.length !== options.length) success = false
        options.forEach(o => {
            if (o.getAttribute('data-type') === 'Required')
                if (!checkedOptions.contains(o)) success = false
        })
    })
    document.querySelector('.next').disabled = !success
}

document.addEventListener("DOMContentLoaded", () => {
    const options = Array.from(document.querySelectorAll('.option'))
    const optionImage = document.querySelector('.optionImage')
    const optionDescription = document.querySelector('.optionDescription')

    options.forEach(o => {
        o.addEventListener('mouseover', e => {
            const img = e.target.getAttribute('data-image')
            const description = e.target.getAttribute('data-description')

            if (img !== null)
                optionImage.style.backgroundImage = `url("${img}")`

            if (description !== null)
                optionDescription.innerHTML = description
        })

        o.querySelector('input').addEventListener('click', e => {
            const group = e.target.parentElement.parentElement.parentElement
            const groupType = group.getAttribute('data-type')
            const options = Array.from(group.querySelectorAll('.option'))
            const checkedOptions = options.filter(
                o => o.querySelector('input').checked)

            if (groupType === 'SelectExactlyOne' ||
                groupType === 'SelectAtLeastOne') {
                if (checkedOptions.length < 1)
                    e.target.checked = true
            }

            if (groupType === 'SelectExactlyOne' ||
                groupType === 'SelectAtMostOne') {
                if (checkedOptions.length > 1)
                    options.forEach(o => {
                        if (o !== e.target.parentElement)
                            o.querySelector('input').checked = false
                    })
            }

            validate()
        })
    })
    Array.from(document.querySelectorAll('.group'), group => {
        const groupType = group.getAttribute('data-type')

        if (groupType === 'SelectExactlyOne' || groupType === 'SelectAtLeastOne') {
            o = group.querySelector('ul > .option[data-type="Recommended"] > input')
            if (o !== null)
                o.checked = true
            else
                group.querySelector('ul > .option > input').checked = true
        }
    })
    
    validate()
})