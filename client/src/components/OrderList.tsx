import React from 'react';

interface Order {
    code: string;
    material: string;
    quantityPlanned: number;
    quantityExecuted: number;
    unitOfMeasure: string;
    department: string;
    stock: number;
}

interface OrderListProps {
    orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
    return (
        <div>
            <h2>Lista de Pedidos Processados</h2>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Material</th>
                        <th>Qtd Planejada</th>
                        <th>Qtd Executada</th>
                        <th>UoM</th>
                        <th>Departamento</th>
                        <th>Estoque</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.code}</td>
                            <td>{order.material}</td>
                            <td>{order.quantityPlanned}</td>
                            <td>{order.quantityExecuted}</td>
                            <td>{order.unitOfMeasure}</td>
                            <td>{order.department}</td>
                            <td>{order.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;