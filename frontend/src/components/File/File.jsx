import {useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid'
import {useParams} from "react-router-dom";

export const File = () => {
    const [identity, setIdentity] = useState(uuidv4());
    const [socket, setSocket] = useState(null);
    const [socketRedy, setSocketRedy] = useState(false);
    const [error, setError] = useState(null);
    const {devID, fileID} = useParams()
    const privKeyRef = useRef('');
    useEffect(()=>{
        if(!socketRedy){
            return
        }
        socket.send(JSON.stringify({cmd:'transmit',to:devID,data:{fileID:fileID,cmd:'getFile'}}))
    },[socketRedy])


    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        const wsUrl = `${protocol}://${hostname}${port}/beacon`;
        const newSocket = new WebSocket(wsUrl); // Replace with your WebSocket server URL
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const obj = JSON.parse(event.data)
            if(obj.error){
                setError(obj.error)
            }
            console.log(obj.file)
            if("fileData"===obj.cmd){
                console.log(obj.file)
                const byteCharacters = atob(obj.file);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/octet-stream' });
                const downloadLink = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadLink;
                a.download = obj.fileName; // Nazwa pliku
                a.click();
            }
            console.log(obj)
        };

        socket.onopen = ()=>{
            socket.send(JSON.stringify({cmd:'connect',identity:identity}))
            setSocketRedy(true)
        }

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, [socket]);

    const sendMessage = (m) => {
        if (!socket) return;
        socket.send(m);
    };


    // useEffect(() => {
    //     console.log(keyPair)
    //     if(keyPair==={}){
    //         return
    //     }
    //     const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    //     const hostname = window.location.hostname;
    //     const port = window.location.port ? `:${window.location.port}` : '';
    //     const wsUrl = `${protocol}://${hostname}${port}/beacon`;
    //     const ws = new WebSocket(wsUrl);
    //     ws.onopen = () => {
    //         console.log('Connected to WebSocket server');
    //         ws.send(JSON.stringify({cmd:'connect',identity:identity}))
    //         setTimeout(()=>{
    //             ws.send(JSON.stringify({cmd:'transmit',to:devID,data:{fileID:fileID,publicKey:keyPair.publicKey}}))
    //         },750)
    //     };
    //     ws.onmessage = (event) => {
    //         console.log(event.data)
    //     };
    //     ws.onclose = () => {
    //         console.log('Disconnected from WebSocket server');
    //     };
    //     return () => {
    //         ws.close();
    //     };
    // }, [keyPair]);
    return (
        <><h1>{error}</h1></>
    )
}
function convert_word_array_to_uint8Array(wordArray) {
    var len = wordArray.words.length,
        u8_array = new Uint8Array(len << 2),
        offset = 0, word, i
    ;
    for (i=0; i<len; i++) {
        word = wordArray.words[i];
        u8_array[offset++] = word >> 24;
        u8_array[offset++] = (word >> 16) & 0xff;
        u8_array[offset++] = (word >> 8) & 0xff;
        u8_array[offset++] = word & 0xff;
    }
    return u8_array;
}