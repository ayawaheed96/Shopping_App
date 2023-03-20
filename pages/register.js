import { getError } from "@/utilities/errors";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
const Register = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { redirect } = router.query;
  const submitHandler = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post("/api/auth/signup", {
        //create a new user in BE
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        //then login user
        redirect: false,
        name,
        email,
        password,
      });
      if (data) {
        toast.success("Signed up successfully");
        router.push(redirect || "/");
      }
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title='Register'>
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register("name", {
              required: "Please enter your name",
            })}
            type="text"
            className="w-full"
            id="name"
            autoFocus
          ></input>
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            type="email"
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter your password",
              minLength: {
                value: 6,
                message: "Please enter at least 6 characters",
              },
            })}
            type="password"
            className="w-full"
            id="password"
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Confirm password should be at least 6 characters",
              },
            })}
            type="password"
            className="w-full"
            id="confirmPassword"
          ></input>
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Register</button>
        </div>
      </form>
    </Layout>
  );
};
export default Register;
