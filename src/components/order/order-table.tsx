import dayjs from 'dayjs';
import { useState } from 'react';

const OrderTable: React.FC<{ orders: any[] }> = ({ orders }) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

  // Toggle expanded state for the row
  const toggleReadMore = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Quantity</th>
            <th className="px-4 py-2 border-b">Price</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="px-4 py-2 border-b">
                {expandedRows[order.id] || order.name.length <= 20
                  ? order.name
                  : `${order.name.substring(0, 20)}... `}
                {order.name.length > 20 && (
                  <button
                    onClick={() => toggleReadMore(order.id)}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {expandedRows[order.id] ? 'Show less' : 'Read more'}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 border-b">
                <img
                  src={order.image}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 border-b">{order.quantity}</td>
              <td className="px-4 py-2 border-b">₹{order.price}</td>
              <td className="px-4 py-2 border-b capitalize">{order.status}</td>
              <td className="px-4 py-2 border-b">
                {dayjs(order.created_at).format('DD MMM YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
