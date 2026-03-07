import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchLastOrder, fetchOrdersByDate, fetchOrderItems, lastOrderSelector, ordersSelector, loadingSelector } from "@/store/slices/orderSlice";
import { PageLayout, FilterCard } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Orders = () => {
  const dispatch = useAppDispatch();
  const lastOrder = useSelector(lastOrderSelector);
  const orders = useSelector(ordersSelector);
  const loading = useSelector(loadingSelector);
  const { isAuthenticated } = usePageData();
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
      dispatch(fetchOrdersByDate({ from, to })).then((response) => {
        console.log(response);
      });
    }
  }, [startDate, endDate, dispatch]);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    dispatch(fetchOrderItems(orderId));
  };

  const DateFilter = () => (
    <FilterCard
      title="Filter Orders by Date"
      onClear={() => {
        setStartDate(null);
        setEndDate(null);
      }}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">From:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select start date"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">To:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select end date"
          />
        </div>
      </div>
    </FilterCard>
  );

  const LastOrderCard = () => (
    lastOrder && (
      <div className="card p-4 shadow-sm mb-4">
        <h3 className="mb-4">Last Order</h3>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Order ID:</strong> {lastOrder.id}</p>
            <p><strong>Created At:</strong> <Moment format="DD/MM/YYYY HH:mm">{lastOrder.createdAt}</Moment></p>
          </div>
          <div className="col-md-6">
            <h5>Items:</h5>
            <ul className="list-group">
              {lastOrder?.items?.map((item) => (
                <li key={item.id} className="list-group-item">
                  <strong>Product ID:</strong> {item.productId} | <strong>Quantity:</strong> {item.quantity} | <strong>Price:</strong> ${item.price}
                </li>
              )) || <p>No items available for this order.</p>}
            </ul>
          </div>
        </div>
      </div>
    )
  );

  const FilteredOrdersTable = () => {
    if ((orders?.length ?? 0) === 0) {
      return null;
    }
    
    return (
      <div className="card p-4 shadow-sm mb-4">
        <h3 className="mb-4">Filtered Orders</h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders!.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
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
      </div>
    );
  };

  const OrderItemsList = () => {
    if (!selectedOrderId) {
      return null;
    }
    
    return (
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4">Order Items</h3>
        <ul className="list-group">
          {orders!
            .find((order) => order.id === selectedOrderId)
            ?.items?.map((item) => (
              <li key={item.id} className="list-group-item">
                <strong>Product ID:</strong> {item.productId} | <strong>Quantity:</strong> {item.quantity} | <strong>Price:</strong> ${item.price}
              </li>
            )) || <p>No items available for the selected order.</p>}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <PageLayout title="Your Orders" protected={true}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your last order...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Your Orders" protected={true}>
      <DateFilter />
      <LastOrderCard />
      <FilteredOrdersTable />
      <OrderItemsList />
    </PageLayout>
  );
};

export default function ProtectedOrders() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
}