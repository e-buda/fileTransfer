import {useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {File} from "./components/File/File.jsx";
function App() {
    const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:devID/file/:fileID" element={<File/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
