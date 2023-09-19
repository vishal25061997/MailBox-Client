// import { Editor } from 'draft-js'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { Button, Card, FloatingLabel, Form, FormControl } from 'react-bootstrap'
// import { EditorState } from 'react-draft-wysiwyg'
import { useSelector } from 'react-redux'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'

const ComposeMail = () => {
  console.log(EditorState)
    const[editorState, setEditorState]=useState(EditorState.createEmpty())
    const toRef = useRef();
    const subjectRef = useRef();
    const senderEmail = useSelector(state => state.auth.userEmail)
    const sEmail = senderEmail.replace(/[@.]/g, "");

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
      };
    const submitHandler =(e)=>{
        e.preventDefault()
        const receiverEmail = toRef.current.value;
        const rEmail = receiverEmail.replace(/[@.]/g, "");

        const message = {
            to: toRef.current.value,
            subject:subjectRef.current.value,
            content:editorState.getCurrentContent().getPlainText(),
        }
//sending data to inbox
const res = fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${rEmail}/inbox.json`,{
    method:'POST',
    body: JSON.stringify({
      from: senderEmail,
      subject: subjectRef.current.value,
      content: editorState.getCurrentContent().getPlainText(),
      read: false,
    })
})
res.then(res =>{
    if(res.ok){
        res.json().then(data =>{
            alert('mail sent successfully')
            toRef.current.value = '';
            subjectRef.current.value ='';
            setEditorState('')
        })
    }else{
        res.json().then(err =>{
            console.log('mail not sent',err)
        })
    }
})
 // Sending mail in sentbox of sender
const res1 = fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${sEmail}/sentbox.json`,{
    method:'POST',
    body: JSON.stringify(message)
})
res1.then(res =>{
    if(res.ok){
        res.json().then(data =>{
            alert('mail sent successfully')
            toRef.current.value = '';
            subjectRef.current.value ='';
            setEditorState('')
        })
    }else{
        res.json().then(err =>{
            console.log('mail not sent',err)
        })
    }
})

    }
 
  return (
    <>
        <Form onSubmit={submitHandler}>
      <Card
        style={{
          width: "90%",
          padding: "2rem",
          marginLeft: "5rem",
          marginTop: "2rem",
        }}
      >
        <Card.Title style={{ fontFamily: "Arial", fontWeight: "bolder" }}>
          Compose Email
        </Card.Title>
        <FloatingLabel label="To:">
          <FormControl type="Email" placeholder="To" ref={toRef} />
        </FloatingLabel>
        <FloatingLabel label="Subject">
          <FormControl type="text" placeholder="Subject" ref={subjectRef} />
        </FloatingLabel>
        <Card.Body
          style={{
            backgroundColor: "rgb(48, 74, 119)",
            
            color: "white",
            textAlign: "left",
          }}
        >
          Compose email
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
        </Card.Body>
        <Button variant="success" type="submit">
          Send
        </Button>
      </Card>
    </Form>
    </>
  )
}

export default ComposeMail
