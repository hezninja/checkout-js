import classNames from 'classnames';
import { isNumber } from 'lodash';
import React, { memo, FunctionComponent, ReactNode } from 'react';

import { ShopperCurrency } from '../currency';

export interface OrderSummaryItemProps {
    id: string | number;
    amount: number;
    quantity: number;
    name: string;
    brand: string;
    categoryNames?: OrderSummaryItemOption[];
    amountAfterDiscount?: number;
    image?: ReactNode;
    description?: ReactNode;
    productOptions?: OrderSummaryItemOption[];
}

export interface OrderSummaryItemOption {
    testId: string;
    content: ReactNode;
}

const OrderSummaryItem: FunctionComponent<OrderSummaryItemProps> = ({
    amount,
    amountAfterDiscount,
    image,
    name,
    brand,
    categoryNames,
    productOptions,
    quantity,
    description,
}) => { let redLine = ''; let redLineIndex = 0;

   (categoryNames || []).map((option, index) => {
        if (option.content === 'Sale') {
            redLine = 'true';
        }
        redLineIndex = index;
        });

   return (
    <div className="product" data-test="cart-item">
        <figure className="product-column product-figure">
            { image }
        </figure>

        <div className="product-column product-body">
            <h5
                className="product-title optimizedCheckout-contentPrimary"
                data-test="cart-item-product-title"
            >
                <span className="brand-name">{ `${brand}` }</span>
                <br />
                { `${name}` }
                <br />
                { `Qty ${quantity}` }
            </h5>
            <ul
                className="product-options optimizedCheckout-contentSecondary"
                data-test="cart-item-product-options"
            >
                { (productOptions || []).map((option, index) =>
                    <li
                        className="product-option"
                        data-test={ option.testId }
                        key={ index }
                    >
                        { option.content }
                    </li>
                ) }
            </ul>
            { description && <div
                className="product-description optimizedCheckout-contentSecondary"
                data-test="cart-item-product-description"
            >
                { description }
            </div> }
        </div>

        <div className="product-column product-actions">
            <div
                className={ classNames(
                    { 'on-sale-tag': redLine === 'true' },
                    { 'on-sale-index': redLineIndex === 0 },
                    'product-price',
                    'optimizedCheckout-contentPrimary',
                    { 'product-price--beforeDiscount': isNumber(amountAfterDiscount) && amountAfterDiscount !== amount }
                ) }
                data-test="cart-item-product-price"
            >
                <ShopperCurrency amount={ amount } />
                { (categoryNames || []).map((option, index) =>
                    option.content === 'Sale' &&
                    <div className="red-price">
                        <p className="on-sale-tag" key={ index }>On Sale</p>
                    </div>
                ) }
            </div>

            { isNumber(amountAfterDiscount) && amountAfterDiscount !== amount && <div
                className="product-price"
                data-test="cart-item-product-price--afterDiscount"
            >
                <ShopperCurrency amount={ amountAfterDiscount } />
                { (categoryNames || []).map((option, index) =>
                    option.content === 'Sale' &&
                    <p className="on-sale-tag" key={ index }>On Sale</p>
                ) }
            </div> }
        </div>
    </div>
)};

export default memo(OrderSummaryItem);
