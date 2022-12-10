import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { buildClient } from "../../api/client";
import { Order } from "../../types/order.types";

interface Props {
  orders?: Order[];
}

const Orders: NextPage<Props> = ({ orders }) => {
  const ordersList = orders?.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.ticket.title + " - " + order.ticket.price + "$"}</td>
        <td>{order.status}</td>
        <td>{order.expiresAt.toString()}</td>
        <td>
          <Link href={`/orders/${order.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <h1>Orders</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
            <th>Expires at</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ordersList}</tbody>
      </table>
    </div>
  );
};

Orders.getInitialProps = async (context: NextPageContext) => {
  const client = buildClient(context);

  const response = await client.get<Order[]>("/api/orders").catch((err) => {
    console.error(err.response.data);
    return null;
  });

  return {
    orders: response?.data,
  };
};

export default Orders;
