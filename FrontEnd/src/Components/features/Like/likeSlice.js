import { createSlice,createAsyncThunk  } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";


export const addToLikeList = createAsyncThunk(
  "like/addToLikeList",
  async ({id,quantity}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(
        `/product/${id}`
      );
      return { 
        product:data.product._id,
         name:data.product.name,
          price:data.product.price,
           image:data.product.image[0].url,
           stock:data.product.stock,
           quantity
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error Occured,Please Try Again Later"
      );
    }
  }
);


const likeSlice=createSlice({
    name:"like",
    initialState:{
        likeItems: JSON.parse(localStorage.getItem("likeItems")) || [],
        loading:false,
        error:null,
        message:null,
        success:false,
        removingId:null,
        shippingInfo:JSON.parse(localStorage.getItem("shippingInfo")) || {}
    },
    reducers:{
        removeError:(state)=>{
              state.error=null;
        },
        removeMessage:(state)=>{
              state.message=null;
        },
        removeItemFromLike:(state,action)=>{
            state.removingId=action.payload;
            state.likeItems=state.likeItems.filter(item=>item.product!==action.payload);
            localStorage.setItem("likeItems",JSON.stringify(state.likeItems));
            state.removingId=null
        },
        saveShippingInfo:(state,action)=>{
          state.shippingInfo=action.payload;
          localStorage.setItem("shippingInfo",JSON.stringify(state.shippingInfo));
        },
        clearLikeList:(state)=>{
          state.likeItems=[];
          localStorage.removeItem("likeItems");
          localStorage.removeItem("shippingInfo");

        }
    },
    extraReducers: (builder) => {
        //addToLikeList
        builder
          .addCase(addToLikeList.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addToLikeList.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            const item=action.payload; 
            const existingItem=state.likeItems.find((i)=>i.product===item.product);
            if(existingItem){
              if(item.quantity>item.stock){
                state.error=`Only ${item.stock} items available`;
                return;
              }
                existingItem.quantity=item.quantity;
                state.message=`${item.name} Updated in Like List Successfully`;
            } else {
              if(item.quantity>item.stock){
                state.error=`Only ${item.stock} items available`;
                return;
              }

               state.likeItems.push(item);
                state.message=`${item.name} Added to Like List Successfully`;
            }
            state.error = null;
            localStorage.setItem("likeItems",JSON.stringify(state.likeItems));
          })
          .addCase(addToLikeList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
  }
})

export const {removeError,removeMessage,removeItemFromLike,saveShippingInfo,clearLikeList}=likeSlice.actions;
export default likeSlice.reducer;
