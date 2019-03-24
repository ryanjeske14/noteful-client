import React from 'react'

const AppContext = React.createContext({
    notes: [],
    folders: [],
    deleteNote: () => {},
    addFolder: () => {}, 
    addNote: () => {},
})

export default AppContext