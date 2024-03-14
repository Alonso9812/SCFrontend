// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const useForm = () => {
//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   const renderFieldError = (field) => {
//     if (errors && errors.hasOwnProperty(field) && errors[field][0]) {
//       return (
//         <span className="invalid-feedback" role="alert">
//           <strong>{errors[field][0]}</strong>
//         </span>
//       );
//     }
//     return null;
//   };

//   return {
//     navigate,
//     errors,
//     setErrors,
//     message,
//     setMessage,
//     renderFieldError,
//   };
// };
