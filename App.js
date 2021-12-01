import "./App.css";
import { useEffect, useState, createContext, useContext} from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { LandingPage } from "./LandingPage";
import { useFormik } from 'formik';
import * as yup from "yup"

const SERVER_URL = "http://localhost:9000/";
export const context = createContext({});

function App() {
  const loginButtonStyle = { color: "white" };
  const defaultLoginButtonText = "Login/SignUp";

  const [isLogin, setIsLogin] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const [loginButtonText, setLoginButtonText] = useState(
    defaultLoginButtonText
  );
  const [commonProps, setCommonProps] = useState({isLogin,setIsLogin,isUserAdmin, setIsUserAdmin})
  return (
    <div>
      <context.Provider value={commonProps}>
      <nav className="navigation">
        <li className="navigation-list-item title">
          <Link to="/">Rentals</Link>
        </li>
        {!isLogin?
        <li className="navigation-list-item">
          <Link to="/register">
            <Button variant="contained" className="login-button">
              Login/Register
            </Button>
          </Link>
        </li>:""}
      </nav>
      <div>
        {isUserAdmin ? (
          <li className="navigation-list-item admin-options">
            <Link to="/addProduct">Add Product</Link>
          </li>
        ) : (
          ""
        )}
      </div>
      <Switch>
        <Route exact path="/">
          {isLogin ? <ProductsLists /> : <LandingPage />}
        </Route>
        <Route path = "/addProduct">
          {isLogin?<AddProducts />:<LandingPage/>}
        </Route>
        <Route path = "/login">
          <Login />
        </Route>
         <Route path = "/register">
           <Register />
         </Route>
         <Route path = "/cart">
           <Cart />
         </Route>
      </Switch>
      </context.Provider>
    </div>
  );
}

function ProductsLists() {
  const [productsList, setPoductsList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    fetch(SERVER_URL + "getProducts",{
      headers: {
        'x-auth-token': sessionStorage.getItem("x-auth-token")
    }
    }
    )
      .then((data) => data.json())
      .then((result) => {
        console.log(result);
        setPoductsList(result);
      });

      
  }, []);
  return (
    <div className="container">
      {productsList.map((product, index) => (
        <DisplayProducts key={index} product={product} />
      ))}
    </div>
  );
}

function DisplayProducts({ product }) {

  const {_id} = sessionStorage.getItem("user");
  
  function addToCart() {
    console.log("add to cart")
   const data = {productId :product._id, _id : _id} ;
   fetch(SERVER_URL+"user/addToCart",
   {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
  }
  }).then(data => data.json())
  .then(dataJson => {
    alert("added to cart successfully")
  });
  }

  console.log(product);
  return (
    <div className="card">
      <img className="card-img-top" src={product.productImage} alt="Img" />
      <div className="card-body">
        <h5 className="card-title">{product.productName}</h5>
        <h6 className="card-subtitle">{product.productPricePerDay}</h6>
        <h6 className="card-subtitle rating">{product.rating}</h6>
        <p className="card-text">{product.productDescript}</p>
        <div className="buttonAlign">
          <Button type="submit" 
          className="add-to-cart-btn" onClick = {() => addToCart}
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddProducts() {
  const history = useHistory()
  const addData = ({name, productPricePerHour, 
    productPricePerDay,rating,productImage,totalQuantity,availableQuantity}) =>{
    let data = {name, productPricePerHour, productPricePerDay,rating,productImage,totalQuantity,availableQuantity}

    fetch(SERVER_URL+"getProducts/add",
    {
     method : 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
     })
    .then(data => data.json())
    .then(result => 
     {
       console.log("update result" + JSON.stringify(result))
       history.push("/")
       
     })
   }
   const productValidationSchema = yup.object({
    name : yup
    .string()
    .required(),
    productPricePerHour : yup
    .number()
    .required(),
    productPricePerDay : yup
    .number()
    .required(),
    rating : yup
    .string()
    .required(),
    totalQuantity : yup
    .number()
    .required(),
    availableQuantity : yup
    .number()
    .required()
  })
  const {handleSubmit, handleChange, handleBlur, values, errors, touched} = useFormik({
   initialValues : {
     name : '',
     productPricePerHour : 0,
     productPricePerDay : 0,
     rating : '⭐⭐⭐⭐⭐',
     productImage : '',
     totalQuantity: 0,
     availableQuantity:0

   },
   validationSchema : productValidationSchema,
   onSubmit : (values) => {
    addData(values)
   }
  })
  return(
   <div className="add-product-form">
     <form onSubmit = {handleSubmit}>
     <TextField id = "name" name = "name"  label="name" 
     value = {values.name} type = "text" className = "add-product-input"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.name && touched.name}
     helperText = {errors.name} />
     <TextField id = "productPricePerHour" name = "productPricePerHour" label="Price Per Hour" 
     value = {values.productPricePerHour} type = "number" className = "inputName" className = "add-product-input"
      onChange = {handleChange} onBlur = {handleBlur}
      error = {errors.productPricePerHour && touched.productPricePerHour}
      helperText = {errors.productPricePerHour} />
     <TextField id = "productPricePerDay" name = "productPricePerDay" label="Price Per Day" 
     value = {values.productPricePerDay} type = "number" className = "add-product-input"
      onChange = {handleChange} onBlur = {handleBlur}
      error = {errors.productPricePerDay && touched.productPricePerDay}
      helperText = {errors.price} />
     <TextField id = "rating" name = "rating" label="rating" 
     value = {values.rating} type = "text"  className = "add-product-input"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.rating && touched.rating}
     helperText = {errors.rating} />
     <TextField id = "productImage" name = "productImage" label="productImage" 
     value = {values.productImage} type = "text" className = "add-product-input"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.productImage && touched.productImage}
     helperText = {errors.productImage} />
     <TextField id = "totalQuantity" name = "totalQuantity" label="totalQuantity" 
     value = {values.totalQuantity} type = "number" className = "add-product-input"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.totalQuantity && touched.totalQuantity}
     helperText = {errors.totalQuantity} />
     <TextField id = "availableQuantity" name = "availableQuantity" label="availableQuantity" 
     value = {values.availableQuantity} type = "number" className = "add-product-input"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.availableQuantity && touched.availableQuantity}
     helperText = {errors.availableQuantity} />
     <Button variant="contained" type = "submit" >Add</Button>
     </form>
   </div>
  );
  
}

function Register() {
  const history = useHistory();
  const registerUser = ({name, password}) =>{
    let data = { name,password}
    fetch(SERVER_URL+"user/register",
    {
     method : 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
     })
    .then(data => data.json())
    .then(result => 
     {
      //console.log("update result" + JSON.stringify(result))
      if(result.error) {
        alert(result.message);
      }
      else {
        alert(result.message);
       history.push("/login")
      }
     })
   }

  const userRegisterValidation = yup.object({
    name : yup
    .string()
    .required()
    .min(5)
    .max(10),
    password : yup
    .string()
    .required()
    .min(5)
    .max(10)
  })

  const {handleSubmit, handleChange, handleBlur, values, errors, touched} = useFormik({
     initialValues : {
       name:'',
       password:''
     },
     validationSchema : userRegisterValidation,
     onSubmit : (values) => {
      registerUser(values)
     }
    })
    return(
     <div className="signUp">
       <form onSubmit = {handleSubmit}>
       <TextField id = "name" name = "name"  label="name" 
       value = {values.name} type = "text" className="inputName"
       onChange = {handleChange} onBlur = {handleBlur}
       error = {errors.name && touched.name}
       helperText = {errors.name} />
       <TextField id = "password" name = "password"  label="password" 
       value = {values.password} type = "text" className="password"
       onChange = {handleChange} onBlur = {handleBlur}
       error = {errors.password && touched.password}
       helperText = {errors.password} />
      <Button variant="outlined" type = "submit" >Register</Button>
      <Button variant="outlined"
      onClick={()=>{history.push("/login")}}> Existing user? </Button>
      </form>
       </div>
       );
}

function Login() {

  const value = useContext(context)
  const {isLogin, setIsLogin, isUserAdmin, setIsUserAdmin} = value
  const history = useHistory();
  const loginUser = ({name, password}) =>{
    let data = { name,password}
    fetch(SERVER_URL+"user/login",
    {
     method : 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
     })
    .then(data => data.json())
    .then(result => 
     {
      //console.log("update result" + JSON.stringify(result))
      try {
      sessionStorage.setItem("x-auth-token",result.jwtToken)
      sessionStorage.setItem("user",result.user)
      setIsLogin(true);
      console.log(result.user)
      setIsUserAdmin(result.user.userRole==="admin"?true:false)
      history.push("/")
      }
      catch(e){
        alert(e)
      }
       
     })
   }

  const userRegisterValidation = yup.object({
    name : yup
    .string()
    .required()
    .min(5)
    .max(10),
    password : yup
    .string()
    .required()
    .min(5)
    .max(10)
  })

  const {handleSubmit, handleChange, handleBlur, values, errors, touched} = useFormik({
     initialValues : {
       name:'',
       password:''
     },
     validationSchema : userRegisterValidation,
     onSubmit : (values) => {
      loginUser(values)
     }
    })
    return(
     <div className="signUp">
       <form onSubmit = {handleSubmit}>
       <TextField id = "name" name = "name"  label="name" 
       value = {values.name} type = "text" 
       onChange = {handleChange} onBlur = {handleBlur}
       error = {errors.name && touched.name}
       helperText = {errors.name} className = "inputName"
       />
       <TextField id = "password" name = "password"  label="password" 
       value = {values.password} type = "text" className = "password"
       onChange = {handleChange} onBlur = {handleBlur}
       error = {errors.password && touched.password}
       helperText = {errors.password} />
      <Button variant="contained" type = "submit" >Login</Button>
      </form>
       </div>
       );
}

function Cart() {

  const[cartItems,setCartItems] = useState([]);
  

  useEffect(()=>{
    const {_id} = sessionStorage.getItem("user")
    fetch(SERVER_URL+"user",
    {
     method : 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(_id)
     })
    .then(data => data.json())
    .then(result => 
     {
      setCartItems(result) 
     })
    },[])

   return(
     <div>
       Cart page
     </div>
   )
}
export default App;