import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRequest } from "../../hooks/use-request";

interface UserFormData {
  title: string;
  price: string;
}

const CreateTicket = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>();
  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/tickets",
    method: "post",
    onSuccess: () => {
      router.push("/tickets");
    },
  });

  const onSubmit = async (data: UserFormData) => {
    doRequest({ title: data.title, price: data.price });
  };

  return (
    <div className="container">
      <h1>Create a new ticket</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="titleInput">Title</label>

          <input
            type="text"
            className="form-control"
            id="titleInput"
            aria-describedby="titleHelp"
            placeholder="Enter title"
            {...register("title", { required: true })}
          />

          {errors.title && (
            <span className="text-danger">This field is required</span>
          )}
        </div>

        <div className="form-group mt-2 mb-2">
          <label htmlFor="priceInput">Price</label>

          <input
            type="number"
            className="form-control"
            id="priceInput"
            placeholder="price"
            {...register("price", { required: true })}
          />

          {errors.price && (
            <span className="text-danger">This field is required</span>
          )}
        </div>

        {requestErrors}

        <button type="submit" className="btn btn-primary mt-1">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
