import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { buildClient } from "../../api/client";
import { configs } from "../../configs";
import { useRequest } from "../../hooks/use-request";
import { Order } from "../../types/order.types";
import { User } from "../../types/user.types";

interface Props {
  order?: Order;
  user?: User;
}

const Order: NextPage<Props> = ({ order, user }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const router = useRouter();
  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/payments",
    method: "post",
    onSuccess: () => {
      router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft =
        new Date(order!.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div className="container">Order Expired</div>;
  }

  return (
    <div className="container">
      <div>Time left to pay: {timeLeft} seconds</div>

      {order?.ticket.price && (
        <>
          <StripeCheckout
            token={(data) =>
              doRequest({ orderId: order.id, cardToken: data.id })
            }
            stripeKey={configs.STRIPE_PUBLISHABLE_KEY}
            amount={order.ticket.price * 100}
            email={user?.email}
          />

          {requestErrors}
        </>
      )}
    </div>
  );
};

Order.getInitialProps = async (context: NextPageContext) => {
  const { orderId } = context.query;

  const client = buildClient(context);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default Order;
