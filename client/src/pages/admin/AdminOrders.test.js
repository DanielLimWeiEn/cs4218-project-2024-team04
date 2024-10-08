import React from 'react'
import {render, waitFor, screen, fireEvent} from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import AdminOrders from './AdminOrders';
import axios from "axios";
import moment from "moment";

jest.mock('axios')
jest.mock('react-hot-toast')

jest.mock('moment', () => {
    return jest.fn(() => ({
        fromNow: jest.fn(() => '1 Hour Ago')
    }));
});

jest.mock('../../context/auth', () => ({
    useAuth: jest.fn(() => [{
        token: '123',
    }, jest.fn()]) // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock('../../context/cart', () => ({
    useCart: jest.fn(() => [null, jest.fn()]) // Mock useCart hook to return null state and a mock function
}));

jest.mock('../../context/search', () => ({
    useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) // Mock useSearch hook to return null state and a mock function
}));

Object.defineProperty(window, 'localStorage', {
    value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
    },
    writable: true,
});

describe('Admin Orders Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('renders order table correctly with failed order', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    "products": [
                        {
                            "_id": "1",
                            "name": "Jeans",
                            "description": "Classic denim jeans",
                            "price": 49.99
                        },
                        {
                            "_id": "2",
                            "name": "Shirt",
                            "description": "Classic t-shirt",
                            "price": 9.99
                        }
                    ],
                    "payment": {
                        "success": false
                    },
                    "buyer": {
                        "name": "John Doe"
                    },
                    "status": "Not Process",
                    "createdAt": "2024-09-14T08:26:06.070Z"
                }
            ]
        });

        render(
            <MemoryRouter initialEntries={['/admin/orders']}>
                <Routes>
                    <Route path="/admin/orders" element={<AdminOrders />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('All Orders')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('#')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Buyer')).toBeInTheDocument();
            expect(screen.getByText('Date')).toBeInTheDocument();
            expect(screen.getByText('Payment')).toBeInTheDocument();
            expect(screen.getByText('Quantity')).toBeInTheDocument();

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Not Process')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('1 Hour Ago')).toBeInTheDocument();
            expect(screen.getByText('Failed')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();

            expect(screen.getByText('Jeans')).toBeInTheDocument();
            expect(screen.getByText('Classic denim jeans')).toBeInTheDocument();
            expect(screen.getByText('Price : 49.99')).toBeInTheDocument();

            expect(screen.getByText('Shirt')).toBeInTheDocument();
            expect(screen.getByText('Classic t-shirt')).toBeInTheDocument();
            expect(screen.getByText('Price : 9.99')).toBeInTheDocument();

            expect(moment).toHaveBeenCalledWith("2024-09-14T08:26:06.070Z");
        });
    });

    it('renders order table correctly with processed order', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    "products": [
                        {
                            "_id": "1",
                            "name": "Jeans",
                            "description": "Classic denim jeans",
                            "price": 49.99
                        },
                        {
                            "_id": "2",
                            "name": "Shirt",
                            "description": "Classic t-shirt",
                            "price": 9.99
                        }
                    ],
                    "payment": {
                        "success": true
                    },
                    "buyer": {
                        "name": "Doe John"
                    },
                    "status": "Processed",
                    "createdAt": "2024-09-14T08:26:06.070Z"
                }
            ]
        });

        render(
            <MemoryRouter initialEntries={['/admin/orders']}>
                <Routes>
                    <Route path="/admin/orders" element={<AdminOrders />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('All Orders')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('#')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Buyer')).toBeInTheDocument();
            expect(screen.getByText('Date')).toBeInTheDocument();
            expect(screen.getByText('Payment')).toBeInTheDocument();
            expect(screen.getByText('Quantity')).toBeInTheDocument();

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Processed')).toBeInTheDocument();
            expect(screen.getByText('Doe John')).toBeInTheDocument();
            expect(screen.getByText('1 Hour Ago')).toBeInTheDocument();
            expect(screen.getByText('Success')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();

            expect(screen.getByText('Jeans')).toBeInTheDocument();
            expect(screen.getByText('Classic denim jeans')).toBeInTheDocument();
            expect(screen.getByText('Price : 49.99')).toBeInTheDocument();

            expect(screen.getByText('Shirt')).toBeInTheDocument();
            expect(screen.getByText('Classic t-shirt')).toBeInTheDocument();
            expect(screen.getByText('Price : 9.99')).toBeInTheDocument();

            expect(moment).toHaveBeenCalledWith("2024-09-14T08:26:06.070Z");
        });
    });

    // TODO: Add test for changing order status
});
