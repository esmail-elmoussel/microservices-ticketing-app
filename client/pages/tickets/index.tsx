import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { buildClient } from "../../api/client";
import { Ticket } from "../../types/ticket.types";

interface Props {
  tickets?: Ticket[];
}

const Tickets: NextPage<Props> = ({ tickets }) => {
  const ticketList = tickets?.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

Tickets.getInitialProps = async (context: NextPageContext) => {
  const client = buildClient(context);

  const response = await client.get<Ticket[]>("/api/tickets").catch((err) => {
    console.error(err.response.data);
    return null;
  });

  return {
    tickets: response?.data,
  };
};

export default Tickets;
