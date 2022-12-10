import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { buildClient } from "../../api/client";
import { useRequest } from "../../hooks/use-request";
import { Ticket } from "../../types/ticket.types";

interface Props {
  ticket?: Ticket;
}

const Ticket: NextPage<Props> = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
  });

  if (!ticket) {
    return (
      <div className="alert alert-danger">
        <ul className="my-0">No ticket found</ul>
      </div>
    );
  }
  return (
    <div className="container">
      <div>
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button
          onClick={() => {
            doRequest({
              ticketId: ticket.id,
            });
          }}
          className="btn btn-primary"
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

Ticket.getInitialProps = async (context: NextPageContext) => {
  const client = buildClient(context);

  const response = await client
    .get<Ticket>(`/api/tickets/${context.query.ticketId}`)
    .catch((err) => {
      console.error(err.response.data);
      return null;
    });

  return {
    ticket: response?.data,
  };
};

export default Ticket;
