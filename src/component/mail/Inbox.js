import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, ListGroup, Modal, Nav, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedEmail,setSelectedEmail ] = useState(null);
  const userEmail = localStorage.getItem("email");
  const sanitizedEmail = userEmail.replace(/[@.]/g, "");
  const [unreadCount,setUnreadCount] = useState(0)



  const setIsReadToTrue =() =>{
    const key = localStorage.getItem('key which is clicked');
    const res =fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${sanitizedEmail}/inbox/${key}.json`,{
      method:'PATCH',
      body:JSON.stringify({
        read:true
      }),
      headers: {
        'content-type':'application/json'
      }
    })
    res.then((response)=>{
      console.log("Todo updated successfully:", response.data)
    }).catch((err)=>{
      console.log("Error updating todo",err)
    })
  }
const setKeyToLocalStorage = (key)=>{
  localStorage.setItem('key which is clicked',key);
  setIsReadToTrue();
  setSelectedEmail(messages[key])
}

  useEffect(() => {

    setInterval(()=>{
      if(!sanitizedEmail){
        console.log("email not fount in localStorage")
        return;
      }

   const  res= fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${sanitizedEmail}/inbox.json`)

 res.then(res =>{
  if(res.ok){
    res.json().then(data =>{
      console.log('inbox data',data)
      // console.log(Object.values(data))
      // setMessages(Object.values(data))
      let unread = 0;
      for(let i in data){
        console.log(data[i].read,"insideLoop")
        if(data[i].read === false){
          unread += 1;
        }
      }
      if(unread !== unreadCount){
        setUnreadCount(unread)
      }
      setMessages(data)
    })
  }else{
    res.json().then(err =>{
      console.log(err)
    })
  }
})
 },2000)
   }, [sanitizedEmail]);
   const handleClose = () =>{
    setSelectedEmail(null);
   }
   const deleteEmail =(key) =>{
    fetch(`https://mail-box-client-a8137-default-rtdb.firebaseio.com/${sanitizedEmail}/inbox/${key}.json`,{
      method:'DELETE',
      body:JSON.stringify(messages),
      headers: {
        'content-type':'application/json'
      }

    }).then((res=>{
      console.log('email deleted successfully',res.data)
      const updatedMessages = {...messages}
      delete updatedMessages[key];
      setMessages(updatedMessages)
    })).catch(err =>{
      console.log('error deleting email :',err)
    })
   }
// console.log(messages)
  return (
    <div>
      <h3>Inbox- {`(${userEmail}) There are ${unreadCount} unread messages.`}
      </h3>

      <Link to="/composemail">
          {" "}
          <Button>Compose Email</Button>
        </Link>
      <Card className="text-left">
        <ListGroup variant="flush">
          {Object.keys(messages).reverse().map((key,index) =>(
            <ListGroup.Item key={key}>
              <div onClick={()=> setKeyToLocalStorage(key)}>
                {!messages[key].read && (
                  <span   style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "blue",
                        marginRight: "5px",
                      }}></span>
                )}
                {`${messages[key].from}: ${messages[key].subject} - ${messages[key].content}`}
               
              </div>
              <Button
                    variant="outline-danger"
                    style={{ marginLeft: "60rem" }}
                    onClick={() => deleteEmail(key)}
                  >
                    Delete
                  </Button>{" "}
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
            <strong>From: </strong>
            {selectedEmail && selectedEmail.from}
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

export default Inbox;
