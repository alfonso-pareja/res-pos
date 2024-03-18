// eslint-disable-next-line no-unused-vars
import { useState } from 'react';
import './PrinterStyleComponent.css';

const PrinterComponent = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);
  const [orders, setOrders] = useState([]);
  const [amountOrder, setAmountOrder] = useState({
    total: 0,
    subtotal: 0,
    tip: 0
  });

  const addOrder = () => {
    const newOrder = {
      id: Math.floor(Math.random() * 100),
      product,
      quantity,
      price
    };

    setOrders([...orders, newOrder]);

    setAmountOrder(prevState => ({
      total: prevState.total + (newOrder.price * newOrder.quantity),
      subtotal: prevState.subtotal + (newOrder.price * newOrder.quantity),
      tip: prevState.tip + (newOrder.price * newOrder.quantity * 0.1)
    }));

    clearFields();
  };

  const clearFields = () => {
    setProduct('');
    setQuantity(1);
    setPrice(null);
  };

  const print = () => {
    const body = {
      products: orders.map(order => ({
        description: order.product,
        quantity: order.quantity,
        price: formatToCLP(order.price)
      })),
      total: formatToCLP(amountOrder.total),
      subtotal: formatToCLP(amountOrder.subtotal),
      iva: formatToCLP(0),
      tip: formatToCLP(amountOrder.tip),
      totaltip: formatToCLP(amountOrder.total + amountOrder.tip)
    };

    fetch('http://localhost:3000/printer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(() => {
      setAmountOrder({
        total: 0,
        subtotal: 0,
        tip: 0
      });
      setOrders([]);
    })
    .catch(error => console.error('Error printing:', error));
  };

  const formatToCLP = value => {
    // Formatea el valor como un string con separadores de miles y sin decimales
    const formattedValue = value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Remueve el símbolo de la moneda
    return formattedValue.replace('$', '');
  };

  return (
    <main className="main">
      <div className="content">
        <div className="left-side">
          <div className="form-group">
            <label htmlFor="quantity">Cantidad</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} id="quantity" className="form-control" placeholder="Producto" />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="product">Detalle</label>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)} id="product" className="form-control" placeholder="Detalle Producto" />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input type="number" value={price || ''} onChange={e => setPrice(parseFloat(e.target.value))} id="price" className="form-control" placeholder="Precio" />
          </div>
          <div className="center">
            <button type="button" className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"onClick={addOrder}>Agregar</button>
          </div>
        </div>

        <div className="right-side">
          <div>
            <h2 className='h2'>La Florentina Cafeteria</h2>
            <p className='p'>Larrain #3212, Peñaflor</p>
            <br /><br />
            <p className='p'>Detalle de Mesa</p>
            <div className="center">--------------------------------------------</div>
            <div className="spacer-30"></div>
            {orders.map(order => (
              <div className="order row" key={order.id}>
                <span className="quantity col">{order.quantity}</span>
                <span className="product col">{order.product}</span>
                <span className="price col">{formatToCLP(order.price * order.quantity)}</span>
              </div>
            ))}
            <div className="center">--------------------------------------------</div>
            <div>
              <div className="total row">
                <p style={{fontSize: '14px'}}><span className="col">TOTAL A PAGAR {formatToCLP(amountOrder.total)}</span></p>
                <p style={{fontSize: '14px'}}><span className="col">Propina Sugerida 10% {formatToCLP(amountOrder.tip)}</span></p>
                <p><strong className="totaltip col">TOTAL + PROPINA SUGERIDA {formatToCLP(amountOrder.total + amountOrder.tip)}</strong></p>
              </div>
            </div>
          </div>
          <div className="center">
            <button type="submit" className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"onClick={print}>Imprimir</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrinterComponent;
