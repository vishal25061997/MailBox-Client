import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, ListGroup, Modal, Nav, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const SentBox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedEmail,setSelectedEmail ] = useState(null);
  const userEmail = localStorage.getItem("email");
  const sanitizedEmail = userEmail.replace(/[@.]/g, "");


  useEffect(() => {
   const  res= fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${sanitizedEmail}/sentbox.json`)

 res.then(res =>{
  if(res.ok){
    res.json().then(data =>{
      console.log('inbox data',data)
      // console.log(Object.values(data))
      // setMessages(Object.values(data))
     
        setMessages(data)
      
      
    })
  }else{
    res.json().then(err =>{
      console.log(err)
    })
  }
 })
   }, []);
   const handleClose = () =>{
    setSelectedEmail(null);
   }
   
// console.log(messages)
  return (
    <div>
      <h3 style={{color:"blue"}}>Sentbox</h3>
      <Card className="text-left">
        <ListGroup variant="flush">
          {Object.keys(messages).reverse().map((key,index) =>(
            <ListGroup.Item key={key}>
              <div>
                {`${messages[key].to}: ${messages[key].subject} - ${messages[key].content}`}
               
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
       
      </Card>
      <Modal show={selectedEmail !== null} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Email Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>To: </strong>
            {selectedEmail && selectedEmail.to}
          </p>
          <p>
            <strong>Subject: </strong>
            {selectedEmail && selectedEmail.subject}
          </p>
          <p>
            <strong>Content: </strong>
            {selectedEmail && selectedEmail.content}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SentBox;

