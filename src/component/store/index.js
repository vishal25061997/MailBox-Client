import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import InboxSlice from "./InboxSlice";

 const store = configureStore({
    reducer:{
        auth:AuthSlice,
        inbox:InboxSlice,
    }
 })

 export default store;