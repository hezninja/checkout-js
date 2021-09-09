import { ShippingOption } from '@bigcommerce/checkout-sdk';
import React from 'react';

import { ShopperCurrency } from '../../currency';

import ShippingOptionAdditionalDescription from './ShippingOptionAdditionalDescription';
import './StaticShippingOption.scss';

interface StaticShippingOptionProps {
    displayAdditionalInformation?: boolean;
    method: ShippingOption;
}

const StaticShippingOption: React.FunctionComponent<StaticShippingOptionProps> = ({
displayAdditionalInformation = true,
method,
}) => {
    let ordersOver = '';
    let deliveryTime = '';
    if (method.description === 'Standard Shipping') {
        ordersOver = ' - FREE on orders over $60*';
        deliveryTime = 'est. delivery 2-7 business days';
    } else if (method.description === 'Express Shipping') {
        ordersOver = ' - FREE on orders over $99*';
        deliveryTime = 'est. delivery 1-2 business days';
    } else if (method.description === 'International Express') {
        ordersOver = '';
        deliveryTime = 'est. delivery 3-10 business days';
    } else if (method.description === 'Coolangatta') {
        ordersOver = '';
        deliveryTime = 'The Strand Shopping Centre, Shop 64, 72/80 Marina Parade';
    } else if (method.description === 'Burleigh') {
        ordersOver = '';
        deliveryTime = '1/62 Township Drive, Burleigh Heads ';
    } else if (method.description === 'Tweed Heads') {
        ordersOver = '';
        deliveryTime = 'Tweed City Shopping Centre, Kiosk 41, 54 Minjungbal Drive';
    } else if (method.description === 'Elanora') {
        ordersOver = '';
        deliveryTime = 'The Pines Shopping Centre, Kiosk 11, 13/31 Guineas Creek Road';
    }

    return (
        <>
            <div className="shippingOption shippingOption--alt">
                { method.imageUrl &&
                    <span className="shippingOption-figure">
                        <img
                            alt={ method.description }
                            className="shippingOption-img"
                            src={ method.imageUrl }
                        />
                    </span> }
                <span className="shippingOption-desc">
                    { method.description }
                    { method.type !== 'shipping_pickupinstore' &&
                        <span>{ ordersOver }</span> }
                    { method.transitTime &&
                        <span className="shippingOption-transitTime">
                            { method.transitTime }
                        </span> }
                    { method.additionalDescription && displayAdditionalInformation &&
                        <ShippingOptionAdditionalDescription description={ method.additionalDescription } /> }
                    <span className="shipping-sub-text">
                        { deliveryTime }
                    </span>
                </span>
                <span className="shippingOption-price">
                    { (method.type !== 'shipping_pickupinstore' && method.cost !== 0) &&
                    <ShopperCurrency amount={ method.cost } /> }
                    { (method.type !== 'shipping_pickupinstore' && method.cost === 0) &&
                    'FREE' }
                </span>
            </div>
        </>
    );
};

export default StaticShippingOption;
