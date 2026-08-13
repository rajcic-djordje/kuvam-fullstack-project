import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  AcceptOrderRequest,
  BuyerOrderActionResponse,
  BuyerOrderResponse,
  BuyerOrdersResponse,
  CompleteOrderRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatus,
  RejectOrderRequest,
  SellerOrderActionResponse,
  SellerOrdersResponse
} from '../models/order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${API_BASE_URL}/orders`;


  createOrder(data: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.ordersUrl, data);
  }


  getMyOrders(status?: OrderStatus): Observable<BuyerOrdersResponse> {
    let params = new HttpParams();


    if (status) {
      params = params.set('status', status);
    }


    return this.http.get<BuyerOrdersResponse>(
      `${this.ordersUrl}/mine`,
      { params }
    );
  }


  getMyOrderById(orderId: string): Observable<BuyerOrderResponse> {
    return this.http.get<BuyerOrderResponse>(
      `${this.ordersUrl}/mine/${orderId}`
    );
  }


  cancelMyOrder(orderId: string): Observable<BuyerOrderActionResponse> {
    return this.http.patch<BuyerOrderActionResponse>(
      `${this.ordersUrl}/mine/${orderId}/cancel`,
      {}
    );
  }


  completeMyOrder(orderId: string): Observable<BuyerOrderActionResponse> {
    return this.markMyOrderAsOnTheWay(orderId);
  }


  markMyOrderAsOnTheWay(orderId: string): Observable<BuyerOrderActionResponse> {
    return this.http.patch<BuyerOrderActionResponse>(
      `${this.ordersUrl}/mine/${orderId}/on-the-way`,
      {}
    );
  }


  getReceivedOrders(status?: OrderStatus): Observable<SellerOrdersResponse> {
    let params = new HttpParams();


    if (status) {
      params = params.set('status', status);
    }


    return this.http.get<SellerOrdersResponse>(
      `${this.ordersUrl}/received`,
      { params }
    );
  }


  getReceivedOrderById(orderId: string): Observable<SellerOrderActionResponse> {
    return this.http.get<SellerOrderActionResponse>(
      `${this.ordersUrl}/received/${orderId}`
    );
  }


  acceptOrder(
    orderId: string,
    data: AcceptOrderRequest
  ): Observable<SellerOrderActionResponse> {
    return this.http.patch<SellerOrderActionResponse>(
      `${this.ordersUrl}/received/${orderId}/accept`,
      data
    );
  }


  rejectOrder(
    orderId: string,
    data: RejectOrderRequest
  ): Observable<SellerOrderActionResponse> {
    return this.http.patch<SellerOrderActionResponse>(
      `${this.ordersUrl}/received/${orderId}/reject`,
      data
    );
  }


  markOrderAsReady(orderId: string): Observable<SellerOrderActionResponse> {
    return this.http.patch<SellerOrderActionResponse>(
      `${this.ordersUrl}/received/${orderId}/ready`,
      {}
    );
  }


  completeOrder(
    orderId: string,
    data: CompleteOrderRequest
  ): Observable<SellerOrderActionResponse> {
    return this.http.patch<SellerOrderActionResponse>(
      `${this.ordersUrl}/received/${orderId}/complete`,
      data
    );
  }
}