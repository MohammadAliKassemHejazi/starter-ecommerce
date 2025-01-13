import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchLastOrder, fetchOrdersByDate, fetchOrderItems,lastOrderSelector, ordersSelector, loadingSelector  } from "@/store/slices/orderSlice";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Orders = () => {
  const dispatch = useAppDispatch();
  const lastOrder = useSelector(lastOrderSelector);
  const orders = useSelector(ordersSelector);
  const loading = useSelector(loadingSelector);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate 2-second loading delay
    setTimeout(() => {
      dispatch(fetchLastOrder());
    }, 2000);
  }, [dispatch]);

  useEffect(() => {
    if (startDate && endDate) {
      const from = startDate.toISOString().split("T")[0];
      const to = endDate.toISOString().split("T")[0];
      dispatch(fetchOrdersByDate({ from, to }));
    }
  }, [startDate, endDate, dispatch]);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    dispatch(fetchOrderItems(orderId));
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-5 text-center mt-3">Orders</h1>

            {/* Date Filter */}
            <div className="mb-4">
              <label>From:</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                className="form-control"
              />
              <label>To:</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="form-control"
              />
            </div>

            {/* Last Order */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              lastOrder && (
                <div className="mb-5">
                  <h3>Last Order</h3>
                  <p>Order ID: {lastOrder.id}</p>
                  <p>Created At: <Moment format="DD/MM/YYYY HH:mm">{lastOrder.createdAt}</Moment></p>
                  <ul>
                    {lastOrder.items.map((item) => (
                      <li key={item.id}>
                        Product ID: {item.productId}, Quantity: {item.quantity}, Price: {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {/* Filtered Orders */}
            {orders.length > 0 && (
              <div>
                <h3>Filtered Orders</h3>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td><Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleOrderClick(order.id)}
                          >
                            View Items
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Items */}
            {selectedOrderId && (
              <div>
                <h3>Order Items</h3>
                <ul>
                  {orders
                    .find((order) => order.id === selectedOrderId)
                    ?.items.map((item) => (
                      <li key={item.id}>
                        Product ID: {item.productId}, Quantity: {item.quantity}, Price: {item.price}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(Orders);